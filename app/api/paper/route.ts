import { NextResponse } from "next/server";
import { getStoreOrNull } from "@/lib/db";
import { candidates, researchQuestion, STATUS_LABEL } from "@/research/discovery";
import { hypotheses, limitations, method } from "@/research/lab";
import { allScenarios } from "@/data";
import { cases as discriminateCases } from "@/data/discriminate";
import { INSTRUMENTS } from "@/lib/trace-schema";
import { computeFindings } from "@/lib/analysis";

export const dynamic = "force-dynamic";

/**
 * The paper, as far as the data supports it.
 *
 * Emits a Markdown manuscript whose Results section is generated from storage at
 * request time. Every section where the data is insufficient says so in those
 * words rather than being omitted — an absent section reads as an oversight, and
 * "insufficient" reads as a finding about the state of the work.
 *
 * Requires RESEARCH_TOKEN. This is a working draft, not a publication.
 */
function authorised(req: Request, url: URL): boolean {
  const token = process.env.RESEARCH_TOKEN;
  if (!token) return false;
  if ((req.headers.get("authorization") ?? "") === `Bearer ${token}`) return true;
  return url.searchParams.get("token") === token;
}

const MIN_FOR_ANALYSIS = 30;

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!authorised(req, url)) {
    return NextResponse.json(
      { error: process.env.RESEARCH_TOKEN ? "invalid token" : "RESEARCH_TOKEN is not configured" },
      { status: 401 },
    );
  }

  const store = getStoreOrNull();
  const [traces, responses, ai] = store
    ? await Promise.all([store.listTraces(), store.listResponses(), store.listAIResponses()])
    : [[], [], []];

  const n = (i: string) => traces.filter((t) => t.instrument === i).length;
  const sessions = new Set([...traces, ...responses].map((r) => r.sessionId)).size;
  const insufficient = (count: number) =>
    count < MIN_FOR_ANALYSIS
      ? `**Insufficient data.** n = ${count}; no analysis is reported below ${MIN_FOR_ANALYSIS}.`
      : null;

  const L: string[] = [];
  const w = (...lines: string[]) => L.push(...lines, "");

  w(`# ${researchQuestion.headline}`);
  w(`*Working draft generated ${new Date().toISOString()}. Not a publication.*`);

  w("## Abstract");
  w(
    sessions === 0
      ? "No data has been collected. This draft exists to show what the instruments would produce and where the argument would have to be made; every quantitative claim below is currently marked insufficient."
      : `Participants (${sessions} sessions) interpreted underdetermined material across ${
          INSTRUMENTS.length
        } instruments spanning hypothesis construction, belief revision, and model justification. ${
          insufficient(traces.length) ?? "Results are reported below."
        }`,
  );

  w("## 1. Question");
  w(researchQuestion.headline, "", researchQuestion.second);

  w("## 2. Three levels");
  w(
    "The design separates three problems that are routinely collapsed:",
    "",
    "1. **Construction** — where a hypothesis comes from at all. Not addressed by any updating rule.",
    "2. **Revision** — what evidence does to a hypothesis set. Bayes' rule describes this completely.",
    "3. **Justification** — what makes one surviving model better supported than another. The difficulty.",
  );

  w("## 3. Pre-registered predictions");
  hypotheses.forEach((h) => {
    w(`**${h.id.toUpperCase()}.** ${h.statement}`, "", `*Wrong if:* ${h.wouldBeWrongIf}`);
  });

  w("## 4. Method");
  method.steps.forEach((s) => w(`**${s.title}.** ${s.body}`));
  w(
    `Stimuli: ${allScenarios.length} interpretation scenarios (${
      allScenarios.filter((s) => s.source === "original").length
    } written for the experiment, ${
      allScenarios.filter((s) => s.source === "public-domain-myth").length
    } paraphrased from public-domain texts); ${discriminateCases.length} underdetermination cases with paired models and graded candidate tests.`,
  );

  w("## 5. Data");
  w(`| Instrument | Level | n |`, `|---|---|---|`);
  L.pop();
  [
    ["entry", "II revision"],
    ["character", "I construction"],
    ["versions", "II revision"],
    ["rewrite", "I construction"],
    ["criteria", "III justification"],
    ["discriminate", "III justification"],
    ["category", "III justification"],
    ["shape", "III justification"],
    ["map", "I construction"],
  ].forEach(([k, lvl]) => L.push(`| ${k} | ${lvl} | ${n(k)} |`));
  L.push(`| scenario distributions | II revision | ${responses.length} |`);
  L.push(`| model runs | II revision | ${ai.length} |`);
  L.push("");
  w(`Distinct sessions: ${sessions}.`);

  w("## 6. Results");
  w(
    "Computed from storage at request time by the same function the site uses, so the manuscript and the live page cannot disagree. Each decision rule was fixed before any data existed.",
  );

  const findings = computeFindings(traces, responses, ai);
  const ready = findings.filter((f) => f.ready);
  if (ready.length === 0) {
    w(
      `**Insufficient data on every measure.** ${traces.length} responses across ${sessions} sessions; no candidate has reached its stated minimum. No effect sizes, tests or figures are produced, and reporting them at this sample size would be the most respectable-looking mistake available here.`,
    );
  }
  findings.forEach((f) => {
    const c = candidates.find((x) => x.id === f.id);
    if (!c) return;
    if (f.status === "abandoned") return;
    if (!f.ready) {
      w(
        `**${c.claim}**`,
        "",
        `Insufficient data: n = ${f.n}, minimum ${f.minN}. Rule: ${f.rule}`,
      );
      return;
    }
    w(
      `**${c.claim}**`,
      "",
      `${f.result} Status: ${f.status.toUpperCase()}.`,
      "",
      `*Rule (fixed in advance):* ${f.rule}`,
      "",
      `*Rival:* ${c.rival}`,
      f.discriminating
        ? ""
        : `\n*This number cannot separate the claim from its rival.* ${f.caveat ?? ""}`,
    );
  });

  w("## 7. Candidate findings and their status");
  candidates.forEach((c) => {
    w(
      `**${STATUS_LABEL[c.status]} — ${c.claim}**`,
      "",
      `*Standing:* ${c.standing}`,
      "",
      `*Would move it:* ${c.needs}`,
      "",
      `*Rival explanation:* ${c.rival}`,
    );
  });

  w("## 8. Limitations");
  limitations.forEach((l) => w(`**${l.title}.** ${l.body}`));

  w("## 9. What this cannot become");
  w(
    "There is no ground truth in any scenario here, so no accuracy can be scored and no proper scoring rule applies. Nothing in this design can establish that an interpretation was correct. It can establish what people do, what they say they did it for, and whether a language model given identical material does the same.",
  );

  return new NextResponse(L.join("\n"), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": `attachment; filename="canon-draft-${new Date().toISOString().slice(0, 10)}.md"`,
    },
  });
}
