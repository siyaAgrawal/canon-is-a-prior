import { NextResponse } from "next/server";
import { getStoreOrNull } from "@/lib/db";
import { candidates, researchQuestion, STATUS_LABEL } from "@/research/discovery";
import { hypotheses, limitations, method } from "@/research/lab";
import { allScenarios } from "@/data";
import { cases as discriminateCases } from "@/data/discriminate";
import { INSTRUMENTS } from "@/lib/trace-schema";

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
  const hard = insufficient(traces.length + responses.length);
  if (hard) {
    w(hard);
    w(
      "No effect sizes, no tests, and no figures are produced at this sample size. Reporting them would be the most respectable-looking mistake available to this project.",
    );
  } else {
    const disc = traces.filter((t) => t.instrument === "discriminate");
    const discriminatingChosen = disc.filter(
      (t) => (t.payload as any)?.proposedTestIsDiscriminating === true,
    ).length;
    w(
      `**Discriminating-test selection.** Of ${disc.length} proposals, ${discriminatingChosen} (${(
        (discriminatingChosen / Math.max(1, disc.length)) *
        100
      ).toFixed(0)}%) selected an observation that separates the two models. Raw counts only; no inferential test is reported.`,
    );
    const cat = traces.filter((t) => t.instrument === "category");
    if (cat.length > 0) {
      const tally: Record<string, number> = {};
      cat.forEach((t) => {
        const r = String((t.payload as any)?.anomalyResponse ?? "—");
        tally[r] = (tally[r] ?? 0) + 1;
      });
      w(
        `**Anomaly response.** ${Object.entries(tally)
          .map(([k, v]) => `${k}: ${v}`)
          .join("; ")}.`,
      );
    }
    const shape = traces.filter((t) => t.instrument === "shape");
    if (shape.length > 0) {
      const accepted = shape.map((t) => Number((t.payload as any)?.controlsAccepted ?? 0));
      const mean = accepted.reduce((a, b) => a + b, 0) / accepted.length;
      w(
        `**Control acceptance.** Mean fabricated connections accepted: ${mean.toFixed(2)} of 3 (n = ${shape.length}).`,
      );
    }
  }

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
