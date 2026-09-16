"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CanonModule } from "@/types";

/**
 * Change one premise; watch which readings move.
 *
 * The display deliberately keeps the canonical reading on screen next to the revised
 * one. The interesting quantity is not the new reading on its own — it is how many
 * dimensions had to move to accommodate a single altered assumption, and which ones
 * stayed put.
 *
 * Every premise also carries what it cannot do. A counterfactual engine with no
 * constraints would be an argument that any reading is available, which is the
 * opposite of this project's claim.
 */
export function CounterfactualEngine({ module: mod }: { module: CanonModule }) {
  const [premiseId, setPremiseId] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const premise = mod.premises.find((p) => p.id === premiseId) ?? null;

  const baselineFor = (dimension: string) =>
    mod.baseline.find((b) => b.dimension === dimension)?.reading ?? "";
  const changedFor = (dimension: string) =>
    premise?.consequences.find((c) => c.dimension === dimension)?.reading ?? null;

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
        <section aria-labelledby={`${mod.id}-frame`}>
          <h3 id={`${mod.id}-frame`} className="eyebrow">
            The canonical frame
          </h3>
          <ol className="mt-4 space-y-3">
            {mod.canonicalFrame.map((line, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-[5px] font-mono text-[0.6rem] tracking-widest text-ink-ghost tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.92rem] leading-relaxed text-ink-soft">{line}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[0.74rem] leading-relaxed text-ink-ghost">{mod.attribution}</p>
        </section>

        <section aria-labelledby={`${mod.id}-premises`}>
          <h3 id={`${mod.id}-premises`} className="eyebrow">
            Change one assumption
          </h3>
          <p className="mt-3 text-[0.86rem] leading-relaxed text-ink-faint">
            Not the events — none of the four lines opposite changes. Only what you assume about why.
          </p>
          <div className="mt-5 space-y-2">
            {mod.premises.map((p) => {
              const active = p.id === premiseId;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPremiseId(active ? null : p.id)}
                  className={`block w-full border px-4 py-3 text-left transition-colors ${
                    active
                      ? "border-rust bg-rust/[0.06]"
                      : "border-rule-soft hover:border-ink/40 hover:bg-paper-raised"
                  }`}
                >
                  <span className={`block font-display text-[1.04rem] leading-snug ${active ? "text-rust" : ""}`}>
                    {p.label}
                  </span>
                  <span className="mt-1 block text-[0.84rem] leading-snug text-ink-faint">{p.statement}</span>
                </button>
              );
            })}
          </div>
          {premiseId && (
            <button type="button" className="btn-quiet mt-4" onClick={() => setPremiseId(null)}>
              ← Back to the inherited reading
            </button>
          )}
        </section>
      </div>

      <div className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-3">
          <h3 className="eyebrow">Interpretive consequences</h3>
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink-ghost">
            {premise ? `${premise.consequences.length} of ${mod.dimensions.length} dimensions move` : "Inherited reading"}
          </p>
        </div>

        <ul>
          {mod.dimensions.map((dim, i) => {
            const before = baselineFor(dim);
            const after = changedFor(dim);
            const moved = Boolean(after && after !== before);
            return (
              <li key={dim} className="grid gap-3 border-b border-rule-soft py-6 md:grid-cols-[11rem_1fr] md:gap-8">
                <div>
                  <p className="font-mono text-[0.66rem] uppercase leading-relaxed tracking-[0.12em] text-ink-faint">
                    {dim}
                  </p>
                  {premise && (
                    <p
                      className={`mt-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] ${
                        moved ? "text-rust" : "text-ink-ghost"
                      }`}
                    >
                      {moved ? "● moves" : "○ holds"}
                    </p>
                  )}
                </div>
                <div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={`${premiseId ?? "base"}-${i}`}
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="text-[0.94rem] leading-relaxed text-ink"
                    >
                      {after ?? before}
                    </motion.p>
                  </AnimatePresence>
                  {premise && moved && (
                    <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-ghost line-through decoration-ink-ghost/40">
                      {before}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <AnimatePresence>
          {premise && (
            <motion.div
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduce ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <div className="mt-8 border-l-2 border-indigo bg-indigo/[0.04] px-5 py-5 sm:px-6">
                <p className="eyebrow text-indigo">What this premise cannot do</p>
                <p className="mt-2 text-[0.94rem] leading-relaxed text-ink">{premise.resists}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
