"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CanonModule } from "@/types";

/**
 * Change one premise; watch which readings move.
 *
 * The layout is the argument. An earlier version stacked the premise buttons
 * above the consequences, roughly 450px apart — so clicking a premise changed
 * five things, four of which were off screen, and scrolling down to read them
 * took the control (and any sign of which premise was active) out of view.
 * Cause and effect were never visible together, which is the one thing this
 * instrument exists to show.
 *
 * Now the control is pinned: a rail on wide screens, a compact bar under the
 * header on narrow ones, matching the Icarus ascent above it so the page has one
 * grammar rather than two.
 */
export function CounterfactualEngine({ module: mod }: { module: CanonModule }) {
  const [premiseId, setPremiseId] = useState<string | null>(null);
  const [frameOpen, setFrameOpen] = useState(false);
  const reduce = useReducedMotion();
  const premise = mod.premises.find((p) => p.id === premiseId) ?? null;

  const baselineFor = (dimension: string) =>
    mod.baseline.find((b) => b.dimension === dimension)?.reading ?? "";
  const changedFor = (dimension: string) =>
    premise?.consequences.find((c) => c.dimension === dimension)?.reading ?? null;

  const moved = mod.dimensions.filter((d) => {
    const after = changedFor(d);
    return Boolean(after && after !== baselineFor(d));
  }).length;

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14">
      {/* ── The control. Pinned, so it is never off screen while you read. ── */}
      <div className="sticky top-[3.4rem] z-20 -mx-5 mb-8 px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:mb-0 lg:self-start lg:px-0 lg:pt-2">
        <div
          className="border p-3.5 backdrop-blur-md sm:p-5"
          style={{ background: "rgb(var(--bg) / 0.92)", borderColor: "rgb(var(--line) / 0.22)" }}
        >
          <p className="kicker mb-2 sm:mb-3">Change one assumption</p>
          <ul className="space-y-0.5">
            {mod.premises.map((p) => {
              const active = p.id === premiseId;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPremiseId(active ? null : p.id)}
                    className="pick py-1.5 text-[0.88rem] leading-snug sm:py-2 sm:text-[0.92rem]"
                    style={
                      active
                        ? { borderColor: "rgb(var(--accent))", background: "rgb(var(--accent) / 0.12)" }
                        : undefined
                    }
                  >
                    {p.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-baseline justify-between gap-3 border-t pt-3" style={{ borderColor: "rgb(var(--line) / 0.15)" }}>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--faint))" }}>
              {premise ? "readings that move" : "inherited reading"}
            </span>
            <span
              className="font-mono text-[0.86rem] tabular"
              style={{ color: premise ? "rgb(var(--accent))" : "rgb(var(--faint))" }}
            >
              {premise ? `${moved} / ${mod.dimensions.length}` : "—"}
            </span>
          </div>

          {/* The statement restates the button on a small screen, where the rail is
              already taking half the viewport. Kept where there is room for it. */}
          {premise && (
            <p className="mt-3 hidden text-[0.82rem] leading-snug sm:block" style={{ color: "rgb(var(--muted))" }}>
              {premise.statement}
            </p>
          )}
        </div>
      </div>

      {/* ── The effect. ──────────────────────────────────────────────────── */}
      <div className="min-w-0">
        {/* The fixed events, collapsed by default — they are the thing that does
            not change, and leaving them open pushed the consequences off screen. */}
        <div className="hair">
          <button
            type="button"
            aria-expanded={frameOpen}
            onClick={() => setFrameOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-4 py-4 text-left"
          >
            <span className="kicker">What happens — unchanged, whichever you pick</span>
            <span
              aria-hidden="true"
              className={`font-mono text-sm transition-transform duration-300 ${frameOpen ? "rotate-45" : ""}`}
              style={{ color: "rgb(var(--faint))" }}
            >
              +
            </span>
          </button>
          <motion.div
            initial={false}
            animate={{ height: frameOpen ? "auto" : 0, opacity: frameOpen ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ol className="space-y-3 pb-6">
              {mod.canonicalFrame.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-[5px] font-mono text-[0.58rem] tabular" style={{ color: "rgb(var(--faint))" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.92rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                    {line}
                  </span>
                </li>
              ))}
            </ol>
            <p className="pb-6 text-[0.74rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
              {mod.attribution}
            </p>
          </motion.div>
        </div>

        <ul>
          {mod.dimensions.map((dim, i) => {
            const before = baselineFor(dim);
            const after = changedFor(dim);
            const didMove = Boolean(after && after !== before);
            return (
              <li key={dim} className="hair py-6">
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.13em]"
                    style={{ color: premise && didMove ? "rgb(var(--accent))" : "rgb(var(--faint))" }}
                  >
                    {dim}
                  </span>
                  {premise && (
                    <span
                      className="font-mono text-[0.56rem] uppercase tracking-[0.13em]"
                      style={{ color: didMove ? "rgb(var(--accent))" : "rgb(var(--faint))" }}
                    >
                      {didMove ? "moves" : "holds"}
                    </span>
                  )}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={`${premiseId ?? "base"}-${i}`}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, delay: reduce ? 0 : i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-2.5 text-[0.98rem] leading-[1.6]"
                  >
                    {after ?? before}
                  </motion.p>
                </AnimatePresence>

                {premise && didMove && (
                  <p
                    className="mt-2 text-[0.84rem] leading-relaxed line-through"
                    style={{ color: "rgb(var(--faint))", textDecorationColor: "rgb(var(--accent) / 0.5)" }}
                  >
                    {before}
                  </p>
                )}
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
              <div className="mt-8 border-l-2 pl-5" style={{ borderColor: "rgb(var(--accent))" }}>
                <p className="kicker mb-2" style={{ color: "rgb(var(--accent))" }}>
                  What this premise cannot absorb
                </p>
                <p className="max-w-measure text-[0.94rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                  {premise.resists}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
