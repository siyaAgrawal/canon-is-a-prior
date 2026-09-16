import type { AIResponse, BeliefStep, Distribution, Scenario } from "@/types";
import { roundToSum } from "./simplex";

/**
 * Running a scenario through a language model.
 *
 * Method notes that matter for the comparison to mean anything:
 *
 *  1. The model gets exactly what a participant gets — same context, same stimulus,
 *     same interpretation labels and glosses, same evidence in the same order — and
 *     never the design notes.
 *  2. It is asked for numbers that sum to 100, under the same constraint the sliders
 *     impose on a person.
 *  3. Each stage is a separate request carrying the accumulated evidence and the
 *     model's own previous distribution, mirroring the fact that the participant can
 *     see their previous position on screen.
 *  4. PROMPT_VERSION is stored with every response. Elicited confidence is known to be
 *     sensitive to prompt wording, so responses from different prompt versions are
 *     never pooled in the analysis.
 */

export const PROMPT_VERSION = "v1-2026-09-16";

export function buildStagePrompt(scenario: Scenario, stage: number, previous: Distribution | null): string {
  const evidenceSoFar = scenario.evidence.slice(0, stage);
  const lines: string[] = [];

  lines.push(
    "You are taking part in an experiment on interpretation under incomplete evidence. You will be given a situation, an ambiguous act, and a fixed list of competing interpretations.",
    "",
    `SITUATION: ${scenario.context}`,
    "",
    `THE AMBIGUOUS PART: ${scenario.stimulus}`,
    "",
    `QUESTION: ${scenario.question}`,
    "",
    "INTERPRETATIONS:",
    ...scenario.interpretations.map((i) => `- ${i.id} — ${i.label}: ${i.gloss}`),
  );

  if (evidenceSoFar.length > 0) {
    lines.push("", "EVIDENCE, in the order it was revealed:");
    evidenceSoFar.forEach((e, i) => lines.push(`${i + 1}. ${e.text}`));
  }

  if (previous) {
    lines.push(
      "",
      "YOUR PREVIOUS DISTRIBUTION, before the most recent evidence:",
      ...Object.entries(previous).map(([k, v]) => `- ${k}: ${Math.round(v)}`),
    );
  }

  lines.push(
    "",
    "Assign a probability to each interpretation. Your probabilities must be integers summing to exactly 100.",
    "There is no correct answer and none will be revealed to you. If the evidence does not discriminate between two interpretations, say so by giving them similar weight — do not manufacture a distinction.",
    "Also give a confidence score from 0 to 100 for the distribution as a whole: how sure are you that this spread is the right spread.",
    "",
    "Reply with JSON only, in exactly this form:",
    `{"probabilities": {${scenario.interpretations.map((i) => `"${i.id}": <integer>`).join(", ")}}, "confidence": <integer 0-100>, "reasoning": "<two sentences at most>"}`,
  );

  return lines.join("\n");
}

export interface StageResult {
  distribution: Distribution;
  confidence: number | null;
  reasoning: string;
}

export function parseStageResponse(scenario: Scenario, raw: string): StageResult {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Model reply contained no JSON object. Reply began: ${raw.slice(0, 120)}`);

  let parsed: any;
  try {
    parsed = JSON.parse(match[0]);
  } catch (err) {
    throw new Error(`Model reply was not valid JSON: ${(err as Error).message}`);
  }

  const probs = parsed?.probabilities;
  if (!probs || typeof probs !== "object") throw new Error("Model reply had no 'probabilities' object.");

  const dist: Distribution = {};
  for (const interp of scenario.interpretations) {
    const v = Number(probs[interp.id]);
    if (!Number.isFinite(v) || v < 0) throw new Error(`Model gave no usable probability for '${interp.id}'.`);
    dist[interp.id] = v;
  }

  const total = Object.values(dist).reduce((a, b) => a + b, 0);
  if (total <= 0) throw new Error("Model probabilities summed to zero.");
  // A model that returns 99 or 101 is renormalised and the raw sum is reported in the
  // rationale, because failure to obey the constraint is itself a finding worth keeping.
  const normalised = roundToSum(
    Object.fromEntries(Object.entries(dist).map(([k, v]) => [k, (v / total) * 100])),
  );

  const confidence = Number(parsed?.confidence);
  const note = Math.abs(total - 100) > 0.5 ? ` [raw sum from model: ${total}]` : "";

  return {
    distribution: normalised,
    confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(100, confidence)) : null,
    reasoning: `${String(parsed?.reasoning ?? "").slice(0, 600)}${note}`,
  };
}

/**
 * Calls the Anthropic Messages API. Throws if no key is available — never fabricates.
 *
 * A key may be supplied per request instead of via the environment, so runs can be
 * performed without a redeploy. A per-request key is used for that call and is
 * never stored, never written to a response row, and never included in an error
 * message.
 */
export async function callModel(prompt: string, model: string, overrideKey?: string): Promise<string> {
  const key = overrideKey?.trim() || process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("No model API key available: none configured, and none supplied with the request.");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 700,
      temperature: 1,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // Scrub anything key-shaped out of upstream errors before it reaches a client.
    const safe = text.replace(/sk-[A-Za-z0-9_-]{8,}/g, "sk-***").slice(0, 300);
    throw new Error(`Model API returned ${res.status}: ${safe}`);
  }

  const body = await res.json();
  const text = (body?.content ?? [])
    .filter((b: any) => b?.type === "text")
    .map((b: any) => b.text)
    .join("\n");
  if (!text) throw new Error("Model API returned no text content.");
  return text;
}

export async function runScenario(
  scenario: Scenario,
  model: string,
  overrideKey?: string,
): Promise<AIResponse> {
  const steps: BeliefStep[] = [];
  const rationales: string[] = [];
  let previous: Distribution | null = null;

  for (let stage = 0; stage <= scenario.evidence.length; stage++) {
    const prompt = buildStagePrompt(scenario, stage, previous);
    const raw = await callModel(prompt, model, overrideKey);
    const result = parseStageResponse(scenario, raw);
    steps.push({
      evidenceId: stage === 0 ? null : scenario.evidence[stage - 1].id,
      distribution: result.distribution,
      confidence: result.confidence,
    });
    rationales.push(result.reasoning);
    previous = result.distribution;
  }

  return {
    id: `ai_${crypto.randomUUID()}`,
    scenarioId: scenario.id,
    model,
    steps,
    rationales,
    origin: "live",
    promptVersion: PROMPT_VERSION,
    createdAt: new Date().toISOString(),
    schema: 1,
  };
}

export function isAIConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function defaultModel(): string {
  return process.env.AI_MODEL ?? "claude-sonnet-5";
}
