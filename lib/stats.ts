/**
 * Statistics used across the site.
 *
 * Rules followed here, deliberately:
 *  - every function takes percentages (0..100) or proportions and says which;
 *  - nothing silently invents data: empty input returns null, not zero;
 *  - KL divergence is only reported with explicit smoothing, because a participant
 *    who puts 0% on an interpretation would otherwise make it infinite.
 */

import type { Distribution, ParticipantResponse } from "@/types";

/** Convert a percentage map (0..100) to proportions summing to 1. */
export function toProportions(d: Distribution): Record<string, number> {
  const total = Object.values(d).reduce((a, b) => a + b, 0);
  if (total <= 0) return Object.fromEntries(Object.keys(d).map((k) => [k, 0]));
  return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v / total]));
}

/** Rescale a percentage map so it sums to exactly 100 (used for display only). */
export function normalizePercent(d: Distribution): Distribution {
  const p = toProportions(d);
  return Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v * 100]));
}

export function mean(xs: number[]): number | null {
  if (xs.length === 0) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function median(xs: number[]): number | null {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function standardDeviation(xs: number[]): number | null {
  if (xs.length < 2) return null;
  const m = mean(xs)!;
  const variance = xs.reduce((acc, x) => acc + (x - m) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(variance);
}

/**
 * Total variation distance between two distributions over the same keys.
 * Returns 0..1. 0 = identical, 1 = disjoint support.
 * TVD = (1/2) * sum_i |p_i - q_i| over proportions.
 */
export function totalVariation(a: Distribution, b: Distribution): number {
  const pa = toProportions(a);
  const pb = toProportions(b);
  const keys = new Set([...Object.keys(pa), ...Object.keys(pb)]);
  let sum = 0;
  keys.forEach((k) => {
    sum += Math.abs((pa[k] ?? 0) - (pb[k] ?? 0));
  });
  return sum / 2;
}

/**
 * KL divergence D(P || Q) in bits, with additive (Laplace-style) smoothing.
 *
 * Smoothing is not cosmetic: participants routinely assign an interpretation 0%,
 * and an unsmoothed KL against such a Q is infinite. `epsilon` is added to every
 * component of both distributions before renormalising, so the returned number is
 * a smoothed estimate, and the site always says so where it is displayed.
 */
export function klDivergence(p: Distribution, q: Distribution, epsilon = 0.01): number {
  const keys = Array.from(new Set([...Object.keys(p), ...Object.keys(q)]));
  const smooth = (d: Distribution) => {
    const raw = Object.fromEntries(keys.map((k) => [k, (toProportions(d)[k] ?? 0) + epsilon]));
    return toProportions(raw);
  };
  const sp = smooth(p);
  const sq = smooth(q);
  return keys.reduce((acc, k) => acc + sp[k] * Math.log2(sp[k] / sq[k]), 0);
}

/** Shannon entropy in bits. Max for n interpretations is log2(n). */
export function entropy(d: Distribution): number {
  const p = toProportions(d);
  return -Object.values(p).reduce((acc, v) => (v > 0 ? acc + v * Math.log2(v) : acc), 0);
}

/** Entropy expressed as a 0..1 fraction of the maximum for that many options. */
export function normalizedEntropy(d: Distribution): number | null {
  const n = Object.keys(d).length;
  if (n < 2) return null;
  return entropy(d) / Math.log2(n);
}

/**
 * Update magnitude: how far belief moved between two stages, on the same 0..1 TVD
 * scale. Reported in the UI as a percentage of the maximum possible move.
 */
export function updateMagnitude(before: Distribution, after: Distribution): number {
  return totalVariation(before, after);
}

/**
 * Disagreement within a group: mean pairwise total variation distance.
 * Returns null for fewer than two responses — there is no disagreement to measure.
 */
export function meanPairwiseDisagreement(ds: Distribution[]): number | null {
  if (ds.length < 2) return null;
  let sum = 0;
  let pairs = 0;
  for (let i = 0; i < ds.length; i++) {
    for (let j = i + 1; j < ds.length; j++) {
      sum += totalVariation(ds[i], ds[j]);
      pairs++;
    }
  }
  return pairs === 0 ? null : sum / pairs;
}

/** The pointwise mean distribution of a group, renormalised to percentages. */
export function meanDistribution(ds: Distribution[]): Distribution | null {
  if (ds.length === 0) return null;
  const keys = Array.from(new Set(ds.flatMap((d) => Object.keys(d))));
  const out: Distribution = {};
  keys.forEach((k) => {
    out[k] = mean(ds.map((d) => toProportions(d)[k] ?? 0))! * 100;
  });
  return out;
}

/**
 * Bayes' rule on a discrete hypothesis space, used by the teaching widget.
 * Priors and likelihoods are given as percentages; the posterior comes back as
 * percentages. If no hypothesis assigns the evidence any probability, the update
 * is undefined and we return null rather than dividing by zero.
 */
export function bayesUpdate(
  priors: Distribution,
  likelihoods: Distribution,
): { posterior: Distribution; marginal: number } | null {
  const p = toProportions(priors);
  const unnormalised: Record<string, number> = {};
  let marginal = 0;
  Object.keys(p).forEach((k) => {
    const lik = (likelihoods[k] ?? 0) / 100;
    unnormalised[k] = p[k] * lik;
    marginal += unnormalised[k];
  });
  if (marginal <= 0) return null;
  const posterior = Object.fromEntries(
    Object.entries(unnormalised).map(([k, v]) => [k, (v / marginal) * 100]),
  );
  return { posterior, marginal: marginal * 100 };
}

/** Pull the distribution at a given stage index out of a stored response. */
export function stageDistribution(r: ParticipantResponse, stage: number): Distribution | null {
  return r.steps[stage]?.distribution ?? null;
}

export function formatPct(n: number | null, digits = 0): string {
  if (n === null || Number.isNaN(n)) return "—";
  return `${n.toFixed(digits)}%`;
}
