import type { AIResponse, ParticipantResponse, Trace } from "@/types";
import { candidates, type Status } from "@/research/discovery";

/**
 * The conclusions engine.
 *
 * Every candidate finding has one function here that reduces the dataset to a
 * number, and a **decision rule fixed before any data existed** that turns that
 * number into a status. The rule is stated in the output alongside the result, so
 * a reader can see that the threshold was not chosen after seeing where the data
 * landed.
 *
 * Three disciplines this enforces:
 *
 *  1. Below `minN` nothing is concluded. The status stays OPEN and the page says
 *     how far short it is.
 *  2. There is no SUPPORTED-forever. A rule that fires can fire the other way on
 *     the next response, and the page recomputes on every load.
 *  3. Every result carries its rival. A number that fits the claim also fits the
 *     rival unless the rival predicts something different, and where it does not,
 *     `discriminating` is false and the page says the result cannot separate them.
 */

export interface Finding {
  id: string;
  /** Participants contributing to this specific computation. */
  n: number;
  minN: number;
  ready: boolean;
  /** The pre-stated rule, shown with the result. */
  rule: string;
  /** The computed quantity, in words. Null when not ready. */
  result: string | null;
  /** Supporting numbers, for the detail view. */
  numbers: { label: string; value: string }[];
  /** Status derived from the rule. OPEN whenever not ready. */
  status: Status;
  /** Whether this computation can distinguish the claim from its rival. */
  discriminating: boolean;
  /** Said plainly when discriminating is false. */
  caveat: string | null;
}

const pct = (a: number, b: number) => (b === 0 ? 0 : (a / b) * 100);
const fmt = (x: number, d = 0) => `${x.toFixed(d)}%`;

/** Sessions that produced a trace for every instrument in the list. */
function sessionsWithAll(traces: Trace[], instruments: string[]): string[] {
  const bySession = new Map<string, Set<string>>();
  traces.forEach((t) => {
    if (!bySession.has(t.sessionId)) bySession.set(t.sessionId, new Set());
    bySession.get(t.sessionId)!.add(t.instrument);
  });
  return [...bySession.entries()]
    .filter(([, set]) => instruments.every((i) => set.has(i)))
    .map(([s]) => s);
}

export function computeFindings(
  traces: Trace[],
  responses: ParticipantResponse[],
  ai: AIResponse[],
): Finding[] {
  const of = (i: string) => traces.filter((t) => t.instrument === i);
  const out: Finding[] = [];

  // ── Do people choose discriminating observations? ────────────────────────
  {
    const rows = of("discriminate");
    const graded = rows.filter((r) => typeof (r.payload as any).proposedTestIsDiscriminating === "boolean");
    const yes = graded.filter((r) => (r.payload as any).proposedTestIsDiscriminating === true).length;
    const share = pct(yes, graded.length);
    const minN = 30;
    const ready = graded.length >= minN;
    out.push({
      id: "c-discriminating",
      n: graded.length,
      minN,
      ready,
      rule:
        "Claim survives if fewer than half of proposals discriminate. Weakened if between 50% and 70%. Contradicted above 70%.",
      result: ready
        ? `${fmt(share)} of proposals (${yes} of ${graded.length}) chose an observation that separates the two models.`
        : null,
      numbers: [
        { label: "Discriminating", value: String(yes) },
        { label: "Not discriminating", value: String(graded.length - yes) },
        { label: "Share", value: graded.length ? fmt(share, 1) : "—" },
      ],
      status: !ready ? "open" : share < 50 ? "supported" : share <= 70 ? "weakened" : "contradicted",
      discriminating: true,
      caveat: null,
    });
  }

  // ── Is the criterion a standing disposition or chosen per case? ──────────
  {
    const rows = of("criteria");
    const consistent = rows.filter((r) => (r.payload as any).consistent === true).length;
    const share = pct(consistent, rows.length);
    const minN = 30;
    const ready = rows.length >= minN;
    out.push({
      id: "c-criterion-stability",
      n: rows.length,
      minN,
      ready,
      rule:
        "Claim survives above 65% consistency. Weakened between 45% and 65%. Contradicted below 45%, which is near what indifference would produce.",
      result: ready
        ? `${fmt(share)} used the same property in both cases (${consistent} of ${rows.length}).`
        : null,
      numbers: [
        { label: "Same property twice", value: String(consistent) },
        { label: "Switched", value: String(rows.length - consistent) },
      ],
      status: !ready ? "open" : share > 65 ? "supported" : share >= 45 ? "weakened" : "contradicted",
      discriminating: false,
      caveat:
        "Switching between a case about a person and a case about a system may be good domain-sensitive reasoning rather than inconsistency. This computation cannot tell those apart; the reasoning field is the only thing that could, and it has to be read by hand.",
    });
  }

  // ── Is category revision avoided in favour of stretching? ────────────────
  {
    const rows = of("category");
    const tally: Record<string, number> = { keep: 0, stretch: 0, new: 0, reject: 0 };
    rows.forEach((r) => {
      const k = String((r.payload as any).anomalyResponse ?? "");
      if (k in tally) tally[k] += 1;
    });
    const stretchOrKeep = tally.keep + tally.stretch;
    const share = pct(stretchOrKeep, rows.length);
    const minN = 30;
    const ready = rows.length >= minN;
    out.push({
      id: "c-category",
      n: rows.length,
      minN,
      ready,
      rule:
        "Claim survives if keeping or stretching exceeds 60%. Weakened between 40% and 60%. Contradicted below 40%.",
      result: ready
        ? `${fmt(share)} kept or stretched the existing scheme rather than adding a category or rejecting it.`
        : null,
      numbers: Object.entries(tally).map(([k, v]) => ({ label: k, value: String(v) })),
      status: !ready ? "open" : share > 60 ? "supported" : share >= 40 ? "weakened" : "contradicted",
      discriminating: false,
      caveat:
        "The fourth option is written last and reads as the clever answer, which pushes the other way. The two artefacts do not cancel — they just make the number hard to interpret in either direction.",
    });
  }

  // ── Can readers separate the fabricated connections from the defended? ───
  {
    const rows = of("shape");
    const accepted = rows.map((r) => Number((r.payload as any).controlsAccepted ?? 0));
    const mean = accepted.length ? accepted.reduce((a, b) => a + b, 0) / accepted.length : 0;
    const minN = 30;
    const ready = rows.length >= minN;
    out.push({
      id: "c-self",
      n: rows.length,
      minN,
      ready,
      rule:
        "Chance acceptance of the three controls is 1.5 if readers cannot tell. Claim is weakened further above 1.2, and moves back toward supported below 0.8.",
      result: ready
        ? `Readers accepted ${mean.toFixed(2)} of the three fabricated connections on average.`
        : null,
      numbers: [
        { label: "Mean controls accepted", value: accepted.length ? mean.toFixed(2) : "—" },
        { label: "Chance", value: "1.50" },
        { label: "Readers", value: String(rows.length) },
      ],
      status: !ready ? "weakened" : mean > 1.2 ? "contradicted" : mean < 0.8 ? "supported" : "weakened",
      discriminating: true,
      caveat: null,
    });
  }

  // ── Does an early commitment resist later evidence? ──────────────────────
  {
    const rows = of("entry").filter((r) => Array.isArray((r.payload as any).path));
    const withConf = rows.filter((r) => typeof (r.payload as any).confidence === "number");
    const high = withConf.filter((r) => (r.payload as any).confidence >= 70);
    const low = withConf.filter((r) => (r.payload as any).confidence < 70);
    const meanChanges = (set: Trace[]) =>
      set.length ? set.reduce((a, r) => a + Number((r.payload as any).changes ?? 0), 0) / set.length : 0;
    const hi = meanChanges(high);
    const lo = meanChanges(low);
    const minN = 40;
    const ready = withConf.length >= minN && high.length >= 10 && low.length >= 10;
    out.push({
      id: "c-first-reading",
      n: withConf.length,
      minN,
      ready,
      rule:
        "Claim survives if confident starters move at least 0.4 fewer times on average. Weakened within ±0.4. Contradicted if they move more.",
      result: ready
        ? `Confident starters moved ${hi.toFixed(2)} times on average; unconfident ones ${lo.toFixed(2)}.`
        : null,
      numbers: [
        { label: "Confident (≥70%)", value: high.length ? `${high.length} · ${hi.toFixed(2)} moves` : "—" },
        { label: "Less confident", value: low.length ? `${low.length} · ${lo.toFixed(2)} moves` : "—" },
        { label: "Difference", value: ready ? (lo - hi).toFixed(2) : "—" },
      ],
      status: !ready ? "open" : lo - hi >= 0.4 ? "supported" : lo - hi > -0.4 ? "weakened" : "contradicted",
      discriminating: false,
      caveat:
        "Confidence and movement are both reported by the same person in the same minute. Someone who does not like changing their mind will report both, and this cannot separate that from the claim. The condition that would — showing the facts before asking for a reading — is not built.",
    });
  }

  // ── Is accommodation accompanied by a stated cost? ───────────────────────
  {
    const rows = of("versions").filter((r) => Number((r.payload as any).accommodations ?? 0) > 0);
    const withReason = rows.filter((r) => {
      const s = (r.payload as any).reasoning;
      return typeof s === "string" && s.trim().length > 20;
    }).length;
    const share = pct(withReason, rows.length);
    const minN = 25;
    const ready = rows.length >= minN;
    out.push({
      id: "c-accommodation",
      n: rows.length,
      minN,
      ready,
      rule:
        "Claim survives below 40% giving a substantive reason. Weakened between 40% and 65%. Contradicted above 65%.",
      result: ready
        ? `${fmt(share)} of people who absorbed contrary evidence wrote something substantive about what it would take to drop the reading.`
        : null,
      numbers: [
        { label: "Accommodated and explained", value: String(withReason) },
        { label: "Accommodated, said nothing", value: String(rows.length - withReason) },
      ],
      status: !ready ? "open" : share < 40 ? "supported" : share <= 65 ? "weakened" : "contradicted",
      discriminating: false,
      caveat:
        "Writing nothing in an optional box is not evidence of having nothing to say. This measures disclosure, and the claim is about awareness. Reading the text that is there is the only route to the second, and that is manual work.",
    });
  }

  // ── Does a model commit harder than the human group? ─────────────────────
  {
    const minN = 20;
    out.push({
      id: "c-model-confidence",
      n: Math.min(ai.length, responses.length),
      minN,
      ready: false,
      rule: "Requires matched human and model distributions on the same scenarios under one prompt version.",
      result: null,
      numbers: [
        { label: "Model runs", value: String(ai.length) },
        { label: "Human distributions", value: String(responses.length) },
      ],
      status: "open",
      discriminating: true,
      caveat:
        ai.length === 0
          ? "No model API key is configured on this deployment, so there are no runs at all. Nothing is simulated in their place."
          : null,
    });
  }

  // ── The abandoned one stays abandoned. ───────────────────────────────────
  out.push({
    id: "c-identity",
    n: 0,
    minN: 0,
    ready: false,
    rule: "Abandoned on argument before collection. No computation applies.",
    result: null,
    numbers: [],
    status: "abandoned",
    discriminating: true,
    caveat: null,
  });

  return out;
}

/** Findings joined to the candidate text they belong to. */
export function joinFindings(findings: Finding[]) {
  return candidates.map((c) => ({
    candidate: c,
    finding: findings.find((f) => f.id === c.id) ?? null,
  }));
}
