import type { BeliefStep, Scenario } from "@/types";

/**
 * Server-side validation of a submitted response.
 *
 * The client enforces the simplex constraint, so anything arriving outside it either
 * came from a bug or did not come from the interface. Either way it is not an
 * observation and is refused rather than repaired: silently normalising bad input
 * would put numbers in the dataset that no participant ever chose.
 */
export function validateSteps(scenario: Scenario, steps: unknown): { ok: true; steps: BeliefStep[] } | { ok: false; error: string } {
  if (!Array.isArray(steps)) return { ok: false, error: "steps must be an array" };

  const expected = scenario.evidence.length + 1;
  if (steps.length !== expected) {
    return { ok: false, error: `expected ${expected} steps for scenario '${scenario.id}', received ${steps.length}` };
  }

  const validIds = new Set(scenario.interpretations.map((i) => i.id));
  const out: BeliefStep[] = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i] as Partial<BeliefStep>;
    if (!step || typeof step !== "object") return { ok: false, error: `step ${i} is not an object` };

    const expectedEvidence = i === 0 ? null : scenario.evidence[i - 1].id;
    if ((step.evidenceId ?? null) !== expectedEvidence) {
      return { ok: false, error: `step ${i} has evidenceId '${step.evidenceId}', expected '${expectedEvidence}'` };
    }

    const dist = step.distribution;
    if (!dist || typeof dist !== "object") return { ok: false, error: `step ${i} has no distribution` };

    const keys = Object.keys(dist);
    if (keys.length !== validIds.size || !keys.every((k) => validIds.has(k))) {
      return { ok: false, error: `step ${i} distribution keys do not match the scenario's interpretations` };
    }

    let total = 0;
    for (const k of keys) {
      const v = (dist as Record<string, unknown>)[k];
      if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 100) {
        return { ok: false, error: `step ${i}: '${k}' is not a number between 0 and 100` };
      }
      total += v;
    }
    if (Math.abs(total - 100) > 1.5) {
      return { ok: false, error: `step ${i} totals ${total.toFixed(1)}%, which is not 100%` };
    }

    const confidence = step.confidence;
    if (confidence !== null && confidence !== undefined) {
      if (typeof confidence !== "number" || confidence < 0 || confidence > 100) {
        return { ok: false, error: `step ${i}: confidence must be null or a number between 0 and 100` };
      }
    }

    out.push({
      evidenceId: expectedEvidence,
      distribution: dist as Record<string, number>,
      confidence: typeof confidence === "number" ? confidence : null,
    });
  }

  return { ok: true, steps: out };
}

const SESSION_RE = /^s_[A-Za-z0-9_]{4,40}$/;

export function validateSessionId(id: unknown): id is string {
  return typeof id === "string" && SESSION_RE.test(id);
}
