"use client";

import { useState } from "react";

/**
 * Wave and particle behaviour as a continuum, not a switch.
 *
 * The curve drawn here is I(x) ∝ 1 + V·cos(kx), where V is fringe visibility, and V
 * is tied to path distinguishability D by the Greenberger–Yasin relation V² + D² ≤ 1
 * (Greenberger & Yasin, 1988; tested by Dürr, Nonn & Rempe, Nature 395, 1998). Taking
 * the equality case gives V = √(1 − D²), which is what the slider computes.
 *
 * This is a schematic of that relation, not a simulation of an experiment: no
 * particles are being propagated and no apparatus is being modelled. The relation
 * itself is the accurate part, and it is the part that carries the argument — you do
 * not flip between two descriptions, you trade one off against the other continuously.
 */
export function Complementarity() {
  const [d, setD] = useState(0); // path distinguishability, 0..1
  const visibility = Math.sqrt(Math.max(0, 1 - d * d));

  const w = 640;
  const h = 200;
  const samples = 220;

  const points = Array.from({ length: samples }, (_, i) => {
    const x = (i / (samples - 1)) * w;
    const phase = ((i / (samples - 1)) - 0.5) * Math.PI * 9;
    // Envelope keeps the pattern localised, as a real single-slit envelope would.
    const envelope = Math.exp((-1) * (((i / (samples - 1)) - 0.5) * 3.1) ** 2);
    const intensity = envelope * (1 + visibility * Math.cos(phase)) / 2;
    const y = h - 16 - intensity * (h - 46);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const label =
    d < 0.08
      ? "Full interference. No information anywhere about which path was taken."
      : d > 0.92
        ? "No interference. The path is fully knowable, and the pattern is two lumps."
        : "Partial both. Some path information, some fringes — and their sum is bounded.";

  return (
    <div className="card p-6 sm:p-8">
      <p className="eyebrow">Interactive</p>
      <h3 className="mt-2 font-display text-2xl leading-tight">Not a switch. A trade.</h3>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-6 h-auto w-full"
        role="img"
        aria-label={`Intensity pattern with fringe visibility ${(visibility * 100).toFixed(0)} percent and path distinguishability ${(d * 100).toFixed(0)} percent.`}
      >
        <defs>
          <linearGradient id="fringe-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(38,58,102,0.22)" />
            <stop offset="100%" stopColor="rgba(38,58,102,0.02)" />
          </linearGradient>
        </defs>
        <line x1="0" y1={h - 16} x2={w} y2={h - 16} stroke="rgba(23,24,26,0.2)" strokeWidth={1} />
        <polygon points={`0,${h - 16} ${points} ${w},${h - 16}`} fill="url(#fringe-fill)" />
        <polyline points={points} fill="none" stroke="#263A66" strokeWidth={1.6} />
        <text x={4} y={14} fontSize={9} className="fill-ink-ghost font-mono">
          INTENSITY AT THE SCREEN
        </text>
      </svg>

      <div className="mt-6">
        <label htmlFor="distinguishability" className="flex flex-wrap items-baseline justify-between gap-3">
          <span className="text-[0.9rem] text-ink-soft">How much can you tell which path it took?</span>
          <span className="font-mono text-[0.78rem] tabular text-indigo">D = {d.toFixed(2)}</span>
        </label>
        <input
          id="distinguishability"
          type="range"
          min={0}
          max={100}
          value={Math.round(d * 100)}
          onChange={(e) => setD(Number(e.target.value) / 100)}
          className="mt-2 text-indigo"
          aria-valuetext={`Path distinguishability ${d.toFixed(2)}`}
        />
      </div>

      <div className="mt-5 grid gap-4 border-t border-rule-soft pt-5 sm:grid-cols-2">
        <div>
          <p className="eyebrow">Fringe visibility</p>
          <p className="mt-1 font-mono text-lg tabular text-indigo">V = {visibility.toFixed(2)}</p>
        </div>
        <div>
          <p className="eyebrow">The constraint</p>
          <p className="mt-1 font-mono text-lg tabular text-rust">V² + D² = {(visibility ** 2 + d ** 2).toFixed(2)}</p>
        </div>
      </div>

      <p className="mt-5 text-[0.9rem] leading-relaxed text-ink-soft">{label}</p>

      <p className="mt-4 border-t border-rule-soft pt-4 text-[0.78rem] leading-relaxed text-ink-ghost">
        Schematic, not a simulation. The relation V² + D² ≤ 1 is real — Greenberger and Yasin
        formulated it in 1988 and Dürr, Nonn and Rempe tested it in 1998 — and it is the honest
        version of &ldquo;wave or particle&rdquo;: the two descriptions are not alternatives you pick
        between, they are quantities whose squares are bounded by one.
      </p>
    </div>
  );
}
