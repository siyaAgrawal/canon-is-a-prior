/**
 * Assertions on the numerical core.
 *
 * Run with `npm test`. These are the calculations every chart on the site depends on,
 * so they are checked against values worked out by hand rather than against whatever
 * the implementation happened to return.
 */
import assert from "node:assert/strict";
import {
  bayesUpdate,
  entropy,
  klDivergence,
  meanPairwiseDisagreement,
  median,
  normalizedEntropy,
  totalVariation,
} from "../lib/stats";
import { evenDistribution, isValid, roundToSum, setAndRebalance, sum } from "../lib/simplex";
import { allScenarios } from "../data";
import { canonModules } from "../data/canon";
import { mapEdges, mapNodes } from "../data/connections";
import { validateTrace, INSTRUMENTS, REASONING_MAX } from "../lib/trace-schema";
import { cases as discriminateCases } from "../data/discriminate";
import { categoryCase, RESPONSES } from "../data/category";
import { candidates } from "../research/discovery";

let failures = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ok  ${name}`);
  } catch (err) {
    failures++;
    console.error(`FAIL  ${name}\n      ${(err as Error).message}`);
  }
}

const close = (a: number, b: number, eps = 1e-9) =>
  assert.ok(Math.abs(a - b) < eps, `expected ${a} ≈ ${b}`);

console.log("\nsimplex");

check("even distribution sums to exactly 100", () => {
  [2, 3, 4, 5, 7].forEach((n) => {
    const ids = Array.from({ length: n }, (_, i) => `i${i}`);
    assert.equal(sum(evenDistribution(ids)), 100);
  });
});

check("largest-remainder rounding preserves the total", () => {
  const d = roundToSum({ a: 33.33, b: 33.33, c: 33.34 });
  assert.equal(sum(d), 100);
  assert.ok(Object.values(d).every(Number.isInteger));
});

check("rebalancing keeps the total at 100", () => {
  let d = evenDistribution(["a", "b", "c", "d"]);
  for (const [id, v] of [["a", 70], ["c", 5], ["b", 0], ["d", 100], ["a", 12]] as const) {
    d = setAndRebalance(d, id, v);
    assert.equal(sum(d), 100, `after setting ${id}=${v}: ${JSON.stringify(d)}`);
    assert.ok(isValid(d));
  }
});

check("rebalancing preserves the ratio between the untouched options", () => {
  // b:c starts at 2:1; after moving a, the ratio must survive.
  const start = { a: 40, b: 40, c: 20 };
  const next = setAndRebalance(start, "a", 10);
  assert.equal(next.a, 10);
  close(next.b / next.c, 2, 0.06);
});

check("all-zero others are split evenly rather than left at zero", () => {
  const next = setAndRebalance({ a: 100, b: 0, c: 0 }, "a", 40);
  assert.equal(sum(next), 100);
  assert.equal(next.b, 30);
  assert.equal(next.c, 30);
});

check("a locked entry is never redistributed into", () => {
  const next = setAndRebalance({ a: 50, b: 30, c: 20 }, "a", 10, new Set(["b"]));
  assert.equal(next.b, 30);
  assert.equal(sum(next), 100);
});

console.log("\nstatistics");

check("total variation of identical distributions is 0", () => {
  close(totalVariation({ a: 60, b: 40 }, { a: 60, b: 40 }), 0);
});

check("total variation of disjoint distributions is 1", () => {
  close(totalVariation({ a: 100, b: 0 }, { a: 0, b: 100 }), 1);
});

check("total variation matches a hand calculation", () => {
  // |0.5-0.3| + |0.3-0.4| + |0.2-0.3| = 0.4, halved = 0.2
  close(totalVariation({ a: 50, b: 30, c: 20 }, { a: 30, b: 40, c: 30 }), 0.2, 1e-12);
});

check("total variation is symmetric", () => {
  const p = { a: 12, b: 71, c: 17 };
  const q = { a: 40, b: 25, c: 35 };
  close(totalVariation(p, q), totalVariation(q, p));
});

check("entropy of a uniform distribution over 4 is exactly 2 bits", () => {
  close(entropy({ a: 25, b: 25, c: 25, d: 25 }), 2, 1e-12);
});

check("entropy of a point mass is 0", () => {
  close(entropy({ a: 100, b: 0, c: 0 }), 0);
});

check("normalised entropy is 1 for uniform and 0 for a point mass", () => {
  close(normalizedEntropy({ a: 25, b: 25, c: 25, d: 25 })!, 1, 1e-12);
  close(normalizedEntropy({ a: 100, b: 0, c: 0 })!, 0);
});

check("KL divergence of a distribution from itself is 0", () => {
  close(klDivergence({ a: 30, b: 70 }, { a: 30, b: 70 }), 0, 1e-12);
});

check("KL divergence is finite when the second distribution has zeroes", () => {
  const kl = klDivergence({ a: 50, b: 50 }, { a: 100, b: 0 });
  assert.ok(Number.isFinite(kl) && kl > 0, `expected a finite positive value, got ${kl}`);
});

check("KL divergence is not symmetric", () => {
  const p = { a: 90, b: 10 };
  const q = { a: 50, b: 50 };
  assert.notEqual(klDivergence(p, q).toFixed(6), klDivergence(q, p).toFixed(6));
});

check("median handles even and odd counts", () => {
  assert.equal(median([1, 2, 3]), 2);
  assert.equal(median([1, 2, 3, 4]), 2.5);
  assert.equal(median([]), null);
});

check("disagreement is null below two responses and 0 for identical ones", () => {
  assert.equal(meanPairwiseDisagreement([{ a: 50, b: 50 }]), null);
  close(meanPairwiseDisagreement([{ a: 50, b: 50 }, { a: 50, b: 50 }])!, 0);
});

console.log("\nbayes");

check("equal likelihoods leave the prior untouched", () => {
  const r = bayesUpdate({ a: 60, b: 30, c: 10 }, { a: 40, b: 40, c: 40 })!;
  close(r.posterior.a, 60, 1e-9);
  close(r.posterior.b, 30, 1e-9);
  close(r.posterior.c, 10, 1e-9);
});

check("posterior matches a hand calculation", () => {
  // priors .5/.5, likelihoods .8/.2 → .4/.1 → normalised 80/20
  const r = bayesUpdate({ h1: 50, h2: 50 }, { h1: 80, h2: 20 })!;
  close(r.posterior.h1, 80, 1e-9);
  close(r.posterior.h2, 20, 1e-9);
  close(r.marginal, 50, 1e-9);
});

check("a zero likelihood eliminates a hypothesis entirely", () => {
  const r = bayesUpdate({ h1: 50, h2: 50 }, { h1: 0, h2: 60 })!;
  close(r.posterior.h1, 0);
  close(r.posterior.h2, 100);
});

check("an impossible observation returns null rather than dividing by zero", () => {
  assert.equal(bayesUpdate({ h1: 50, h2: 50 }, { h1: 0, h2: 0 }), null);
});

check("posteriors always total 100", () => {
  const r = bayesUpdate({ a: 17, b: 41, c: 42 }, { a: 13, b: 77, c: 3 })!;
  close(Object.values(r.posterior).reduce((x, y) => x + y, 0), 100, 1e-9);
});

console.log("\ndata integrity");

check("scenario ids are unique", () => {
  const ids = allScenarios.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

check("every scenario has 3-5 interpretations and at least 2 evidence items", () => {
  allScenarios.forEach((s) => {
    assert.ok(s.interpretations.length >= 3 && s.interpretations.length <= 5, `${s.id}: ${s.interpretations.length} interpretations`);
    assert.ok(s.evidence.length >= 2, `${s.id}: ${s.evidence.length} evidence items`);
  });
});

check("interpretation and evidence ids are unique within each scenario", () => {
  allScenarios.forEach((s) => {
    assert.equal(new Set(s.interpretations.map((i) => i.id)).size, s.interpretations.length, s.id);
    assert.equal(new Set(s.evidence.map((e) => e.id)).size, s.evidence.length, s.id);
  });
});

check("every interpretation and evidence item carries prose, not a placeholder", () => {
  const thin: string[] = [];
  allScenarios.forEach((s) => {
    s.interpretations.forEach((i) => {
      if (i.gloss.length <= 20) thin.push(`${s.id}/${i.id} gloss (${i.gloss.length})`);
    });
    s.evidence.forEach((e) => {
      if (e.text.length <= 30) thin.push(`${s.id}/${e.id} text (${e.text.length})`);
      if (e.designNote.length <= 40) thin.push(`${s.id}/${e.id} note (${e.designNote.length})`);
    });
  });
  assert.deepEqual(thin, [], `too thin: ${thin.join(", ")}`);
});

check("the scenario set is at least the 30 the method claims", () => {
  assert.ok(allScenarios.length >= 30, `only ${allScenarios.length} scenarios`);
});

check("every canon premise names what it resists", () => {
  canonModules.forEach((m) => {
    m.premises.forEach((p) => {
      assert.ok(p.resists.length > 40, `${m.id}/${p.id} has no substantive 'resists' note`);
      p.consequences.forEach((c) =>
        assert.ok(m.dimensions.includes(c.dimension), `${m.id}/${p.id}: unknown dimension '${c.dimension}'`),
      );
    });
    m.dimensions.forEach((d) =>
      assert.ok(m.baseline.some((b) => b.dimension === d), `${m.id}: no baseline for '${d}'`),
    );
  });
});

check("every map edge connects two real nodes", () => {
  const ids = new Set(mapNodes.map((n) => n.id));
  mapEdges.forEach((e) => {
    assert.ok(ids.has(e.from), `unknown edge source '${e.from}'`);
    assert.ok(ids.has(e.to), `unknown edge target '${e.to}'`);
  });
});

check("every break edge says what was cut", () => {
  mapEdges
    .filter((e) => e.strength === "break")
    .forEach((e) => {
      assert.ok(e.claim.length > 80, `${e.from}→${e.to} is a break with no explanation`);
    });
});

check("every analogical edge states its disanalogy", () => {
  mapEdges
    .filter((e) => e.strength === "analogical")
    .forEach((e) => {
      assert.ok(e.caveat && e.caveat.length > 40, `${e.from}→${e.to} is analogical with no caveat`);
    });
});

check("every map node is reachable by at least one edge", () => {
  const touched = new Set(mapEdges.flatMap((e) => [e.from, e.to]));
  mapNodes.forEach((n) => assert.ok(touched.has(n.id), `'${n.id}' is isolated`));
});

console.log("\nstored payloads");

check("every instrument has a schema", () => {
  assert.ok(INSTRUMENTS.length >= 6, `only ${INSTRUMENTS.length} instruments`);
});

check("an unknown instrument is refused", () => {
  const r = validateTrace("not_an_instrument", {});
  assert.equal(r.ok, false);
});

check("unknown fields are stripped, not stored", () => {
  const r = validateTrace("versions", {
    steps: [{ itemId: "i1", reading: "cold", stance: "fits", smuggled: "free text" }],
    switches: 0,
    accommodations: 0,
    survived: true,
    note: "this should never reach storage",
  });
  assert.ok(r.ok, "valid payload was rejected");
  if (!r.ok) return;
  assert.deepEqual(Object.keys(r.clean).sort(), ["accommodations", "steps", "survived", "switches"]);
  assert.deepEqual(Object.keys((r.clean.steps as any[])[0]).sort(), ["itemId", "reading", "stance"]);
  assert.ok(!JSON.stringify(r.clean).includes("free text"));
  assert.ok(!JSON.stringify(r.clean).includes("never reach storage"));
});

check("reasoning is kept, trimmed and capped", () => {
  const long = "x".repeat(REASONING_MAX + 400);
  const r = validateTrace("category", {
    caseId: "kinds",
    assignments: { s1: "alpha" },
    anomalyResponse: "stretch",
    createdCategory: null,
    reasoning: "  because the rule said never  ",
  });
  assert.ok(r.ok, "valid reasoning was rejected");
  if (!r.ok) return;
  assert.equal(r.clean.reasoning, "because the rule said never");

  const capped = validateTrace("category", {
    caseId: "kinds",
    assignments: { s1: "alpha" },
    anomalyResponse: "keep",
    createdCategory: null,
    reasoning: long,
  });
  assert.ok(capped.ok);
  if (!capped.ok) return;
  assert.equal((capped.clean.reasoning as string).length, REASONING_MAX);
});

check("control characters never reach storage", () => {
  const r = validateTrace("discriminate", {
    caseId: "seminar", preferred: "chilled", preferenceCriterion: "fit",
    prediction: "chilled", predictionConfidence: 50, proposedTestId: "other-seminar",
    proposedTestIsDiscriminating: true, afterOutcome: "chilled", revised: true,
    reasoning: `a${String.fromCharCode(7)}b\nc`,
  });
  assert.ok(r.ok);
  if (!r.ok) return;
  const stored = r.clean.reasoning as string;
  assert.ok(![...stored].some((ch) => ch.charCodeAt(0) < 32), `control char survived: ${JSON.stringify(stored)}`);
});

check("every underdetermination case has both discriminating and non-discriminating tests", () => {
  discriminateCases.forEach((c) => {
    const yes = c.candidates.filter((t) => t.discriminates).length;
    const no = c.candidates.filter((t) => !t.discriminates).length;
    assert.ok(yes >= 2, `${c.id}: only ${yes} discriminating candidates`);
    assert.ok(no >= 2, `${c.id}: only ${no} non-discriminating candidates`);
    assert.ok(
      c.candidates.every((t) => t.note.length > 80),
      `${c.id}: a candidate has no substantive note`,
    );
    const ids = c.candidates.map((t) => t.id);
    assert.ok(ids.includes(c.resolution.testId), `${c.id}: resolution names an unknown test`);
    assert.ok(
      c.resolution.favours === null || c.models.some((m) => m.id === c.resolution.favours),
      `${c.id}: resolution favours an unknown model`,
    );
  });
});

check("the category task has exactly one anomaly and four costed responses", () => {
  const anomalies = categoryCase.specimens.filter((s) => s.fits === null);
  assert.equal(anomalies.length, 1);
  assert.equal(anomalies[0].id, categoryCase.anomalyId);
  assert.equal(RESPONSES.length, 4);
  RESPONSES.forEach((r) => assert.ok(r.note.length > 80, `${r.id} has no substantive cost note`));
});

check("every candidate finding names what would move it and a rival", () => {
  candidates.forEach((c) => {
    assert.ok(c.needs.length > 40, `${c.id} does not say what would move it`);
    assert.ok(c.rival.length > 1, `${c.id} has no rival explanation`);
  });
  assert.ok(!candidates.some((c) => (c.status as string) === "proven"), "a candidate is marked proven");
});

check("malformed values are refused rather than coerced", () => {
  assert.equal(validateTrace("shape", { judgements: { a: "maybe" }, controlsAccepted: 0, realRejected: 0 }).ok, false);
  assert.equal(validateTrace("entry", { assumptions: ["ok"], switches: 1.5 }).ok, false);
  assert.equal(validateTrace("map", { opened: ["fine", "<script>"] }).ok, false);
});

console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
