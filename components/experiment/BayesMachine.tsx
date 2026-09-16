"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { bayesUpdate } from "@/lib/stats";
import { setAndRebalance } from "@/lib/simplex";
import { colorAt } from "@/lib/palette";
import type { Distribution } from "@/types";

/**
 * Bayes' rule with the handles exposed.
 *
 * Two inputs you control: where you started, and how expected the evidence would be
 * under each explanation. The posterior is computed, not chosen — which is the point
 * worth feeling rather than reading. The same evidence produces a large update or
 * almost none depending on the second input alone.
 */

const HYPOTHESES = [
  { id: "curiosity", label: "Curiosity", gloss: "He climbs to find out what is up there." },
  { id: "freedom", label: "Freedom", gloss: "He has been confined, and altitude is the opposite of that." },
  { id: "hubris", label: "Hubris", gloss: "He overrates himself against the limits of his materials." },
];

const EVIDENCE = "Ovid describes him playing in the air on the way up, reaching after the open sky.";

export function BayesMachine() {
  const [prior, setPrior] = useState<Distribution>({ curiosity: 34, freedom: 33, hubris: 33 });
  const [likelihood, setLikelihood] = useState<Distribution>({ curiosity: 80, freedom: 60, hubris: 40 });
  const reduce = useReducedMotion();

  const result = bayesUpdate(prior, likelihood);
  const posterior = result?.posterior ?? null;

  return (
    <div className="card p-6 sm:p-8">
      <p className="eyebrow">A working model</p>
      <h3 className="mt-2 font-display text-2xl leading-tight">The same evidence, weighted two ways</h3>

      <p className="mt-4 border-l-2 border-rust pl-4 text-[0.92rem] leading-relaxed">
        <span className="eyebrow mr-2 text-rust">Evidence</span>
        {EVIDENCE}
      </p>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-1">1 — Where you start</p>
          <p className="mb-5 text-[0.82rem] leading-relaxed text-ink-faint">
            Your prior. Totals 100, because these are competing explanations of one thing.
          </p>
          <div className="space-y-5">
            {HYPOTHESES.map((h, i) => {
              const c = colorAt(i);
              return (
                <div key={h.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor={`prior-${h.id}`} className="text-[0.88rem]" style={{ color: c.stroke }}>
                      {h.label}
                    </label>
                    <span className="font-mono text-[0.78rem] tabular" style={{ color: c.stroke }}>
                      {Math.round(prior[h.id])}%
                    </span>
                  </div>
                  <input
                    id={`prior-${h.id}`}
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(prior[h.id])}
                    style={{ color: c.stroke }}
                    onChange={(e) => setPrior(setAndRebalance(prior, h.id, Number(e.target.value)))}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-1">2 — How expected the evidence is</p>
          <p className="mb-5 text-[0.82rem] leading-relaxed text-ink-faint">
            The likelihood. &ldquo;If this explanation were true, how likely would I be to see this?&rdquo;
            These do not total anything — they are separate questions.
          </p>
          <div className="space-y-5">
            {HYPOTHESES.map((h, i) => {
              const c = colorAt(i);
              return (
                <div key={h.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor={`lik-${h.id}`} className="text-[0.88rem]" style={{ color: c.stroke }}>
                      If {h.label.toLowerCase()}…
                    </label>
                    <span className="font-mono text-[0.78rem] tabular" style={{ color: c.stroke }}>
                      {Math.round(likelihood[h.id])}%
                    </span>
                  </div>
                  <input
                    id={`lik-${h.id}`}
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(likelihood[h.id])}
                    style={{ color: c.stroke }}
                    onChange={(e) => setLikelihood({ ...likelihood, [h.id]: Number(e.target.value) })}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-rule-soft pt-7">
        <p className="eyebrow mb-1">3 — Where you end up</p>
        <p className="mb-5 text-[0.82rem] leading-relaxed text-ink-faint">
          The posterior. You do not set this one. It is what the first two force.
        </p>

        {posterior ? (
          <ul className="space-y-3.5">
            {HYPOTHESES.map((h, i) => {
              const c = colorAt(i);
              const v = posterior[h.id];
              const shift = v - prior[h.id];
              return (
                <li key={h.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[0.9rem]" style={{ color: c.stroke }}>
                      {h.label}
                    </span>
                    <span className="font-mono text-[0.82rem] tabular" style={{ color: c.stroke }}>
                      {Math.round(v)}%
                      <span className={`ml-2 ${Math.abs(shift) < 0.5 ? "text-ink-ghost" : shift > 0 ? "text-moss" : "text-ink-faint"}`}>
                        {shift > 0.5 ? "+" : ""}
                        {Math.abs(shift) < 0.5 ? "no change" : Math.round(shift)}
                      </span>
                    </span>
                  </div>
                  <div className="relative mt-1 h-[8px] w-full bg-ink/[0.06]">
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 border-r border-ink/35"
                      style={{ width: `${prior[h.id]}%` }}
                    />
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0"
                      style={{ background: c.stroke }}
                      animate={{ width: `${v}%` }}
                      transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[0.88rem] text-rust">
            Every explanation says this evidence is impossible, so there is nothing to update on. The
            rule is undefined here rather than wrong — and the honest response is that your
            hypothesis list is missing the true explanation.
          </p>
        )}

        <div className="mt-7 border-t border-rule-soft pt-5">
          <p className="text-[0.86rem] leading-relaxed text-ink-soft">
            Try setting all three likelihoods to the same number. The posterior collapses back onto
            the prior and nothing moves — because evidence equally expected under every explanation
            is not evidence about which one is right. That single fact is most of what Bayes&rsquo;
            rule is for.
          </p>
          {result && (
            <p className="mt-3 font-mono text-[0.7rem] tabular text-ink-ghost">
              P(E) = {result.marginal.toFixed(1)}% — how likely you were to see this evidence at all,
              averaged over your explanations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
