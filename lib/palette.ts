/**
 * Series colours.
 *
 * Five hues, chosen to stay distinguishable on paper-white and to remain
 * distinguishable in the common forms of colour vision deficiency by pairing hue with
 * a different lightness at every step. Charts on this site never rely on colour alone:
 * every series is also labelled directly.
 */
export const series = [
  { key: "rust", stroke: "#A33B2C", fill: "rgba(163,59,44,0.14)", text: "text-rust" },
  { key: "indigo", stroke: "#263A66", fill: "rgba(38,58,102,0.12)", text: "text-indigo" },
  { key: "gold", stroke: "#8A6620", fill: "rgba(138,102,32,0.15)", text: "text-gold" },
  { key: "moss", stroke: "#4A6146", fill: "rgba(74,97,70,0.13)", text: "text-moss" },
  { key: "slate", stroke: "#5A5C62", fill: "rgba(90,92,98,0.13)", text: "text-ink-faint" },
] as const;

export function colorAt(i: number) {
  return series[i % series.length];
}
