"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Distribution, Interpretation } from "@/types";
import { colorAt } from "@/lib/palette";

/**
 * Horizontal probability bars. Used for a single distribution, and paired for
 * prior-versus-posterior comparisons.
 *
 * The bars carry a text label and a number as well as a length, so the chart is
 * readable without colour and legible to a screen reader through the table fallback.
 */
export function DistributionBars({
  interpretations,
  distribution,
  compareTo,
  compareLabel = "before",
  label,
  compact = false,
}: {
  interpretations: Interpretation[];
  distribution: Distribution;
  compareTo?: Distribution | null;
  compareLabel?: string;
  label?: string;
  compact?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <figure className="w-full">
      {label && <figcaption className="eyebrow mb-3">{label}</figcaption>}
      <ul className={compact ? "space-y-2" : "space-y-3.5"}>
        {interpretations.map((interp, i) => {
          const c = colorAt(i);
          const v = distribution[interp.id] ?? 0;
          const before = compareTo?.[interp.id];
          return (
            <li key={interp.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className={`min-w-0 truncate ${compact ? "text-[0.82rem]" : "text-[0.9rem]"}`} style={{ color: c.stroke }}>
                  {interp.label}
                </span>
                <span className="shrink-0 font-mono text-[0.78rem] tabular" style={{ color: c.stroke }}>
                  {Math.round(v)}%
                  {before !== undefined && (
                    <span className="ml-1.5 text-ink-ghost">
                      ({Math.round(before)} {compareLabel})
                    </span>
                  )}
                </span>
              </div>
              <div className="relative mt-1 h-[7px] w-full bg-ink/[0.06]">
                {before !== undefined && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 border-r border-ink/35"
                    style={{ width: `${before}%` }}
                  />
                )}
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0"
                  style={{ background: c.stroke }}
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${v}%` }}
                  transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
