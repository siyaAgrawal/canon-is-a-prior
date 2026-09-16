/**
 * Keeping a set of sliders on the probability simplex.
 *
 * The constraint "these must sum to 100" is the whole pedagogical point of the
 * instrument: you cannot raise your confidence in one reading without taking
 * confidence away from another. Getting the feel of that right matters more here
 * than any animation on the site.
 *
 * Policy when slider `id` is dragged to `value`:
 *   - the remaining mass (100 - value) is shared among the other interpretations in
 *     proportion to their current values, so relative standings you already set are
 *     preserved;
 *   - if every other value is 0, the remainder is split evenly, because there is no
 *     proportion to preserve;
 *   - locked entries keep their value and are excluded from redistribution;
 *   - the result is rounded to integers by largest remainder, so the displayed
 *     numbers sum to exactly 100 rather than to 99 or 101.
 */

import type { Distribution } from "@/types";

export function evenDistribution(ids: string[]): Distribution {
  const base = Math.floor(100 / ids.length);
  const out: Distribution = Object.fromEntries(ids.map((id) => [id, base]));
  let remainder = 100 - base * ids.length;
  for (let i = 0; remainder > 0; i++, remainder--) out[ids[i % ids.length]] += 1;
  return out;
}

/** Largest-remainder rounding to integers that sum to `target`. */
export function roundToSum(d: Distribution, target = 100): Distribution {
  const entries = Object.entries(d);
  const floors = entries.map(([k, v]) => [k, Math.floor(v), v - Math.floor(v)] as const);
  let used = floors.reduce((a, [, f]) => a + f, 0);
  const out: Distribution = Object.fromEntries(floors.map(([k, f]) => [k, f]));
  const order = [...floors].sort((a, b) => b[2] - a[2]);
  let i = 0;
  while (used < target && order.length > 0) {
    out[order[i % order.length][0]] += 1;
    used += 1;
    i += 1;
  }
  // If floors already overshot (possible with dirty input), trim the smallest.
  const ascending = [...floors].sort((a, b) => a[2] - b[2]);
  let j = 0;
  while (used > target && ascending.length > 0) {
    const key = ascending[j % ascending.length][0];
    if (out[key] > 0) {
      out[key] -= 1;
      used -= 1;
    }
    j += 1;
    if (j > 1000) break;
  }
  return out;
}

export function setAndRebalance(
  current: Distribution,
  id: string,
  rawValue: number,
  locked: Set<string> = new Set(),
): Distribution {
  const ids = Object.keys(current);
  const lockedMass = ids
    .filter((k) => k !== id && locked.has(k))
    .reduce((a, k) => a + current[k], 0);

  const ceiling = Math.max(0, 100 - lockedMass);
  const value = Math.min(ceiling, Math.max(0, rawValue));

  const others = ids.filter((k) => k !== id && !locked.has(k));
  const remaining = ceiling - value;

  const next: Distribution = { ...current, [id]: value };

  if (others.length === 0) {
    // Nothing can absorb the change: snap the dragged slider back to the ceiling.
    next[id] = ceiling;
    return roundToSum(next);
  }

  const othersTotal = others.reduce((a, k) => a + current[k], 0);
  if (othersTotal <= 0) {
    others.forEach((k) => {
      next[k] = remaining / others.length;
    });
  } else {
    others.forEach((k) => {
      next[k] = (current[k] / othersTotal) * remaining;
    });
  }

  return roundToSum(next);
}

export function sum(d: Distribution): number {
  return Object.values(d).reduce((a, b) => a + b, 0);
}

export function isValid(d: Distribution): boolean {
  return Math.abs(sum(d) - 100) < 0.51 && Object.values(d).every((v) => v >= 0);
}
