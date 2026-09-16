"use client";

import { useId } from "react";
import type { Distribution, Interpretation } from "@/types";
import { colorAt } from "@/lib/palette";
import { setAndRebalance, sum } from "@/lib/simplex";

/**
 * The instrument.
 *
 * Every slider is a real <input type="range"> so that keyboard and screen-reader
 * behaviour is the platform's rather than something reimplemented badly. Arrow keys
 * step by one point, Page Up/Down by ten, Home/End to the extremes — all free.
 *
 * Moving one slider redistributes the remainder across the others in proportion, so
 * the total is always exactly 100. The constraint is announced in a live region for
 * anyone who cannot see the bars move.
 */
export function SimplexSliders({
  interpretations,
  value,
  onChange,
  previous,
  disabled = false,
}: {
  interpretations: Interpretation[];
  value: Distribution;
  onChange: (next: Distribution) => void;
  /** The previous stage's distribution, drawn as a ghost so movement is visible. */
  previous?: Distribution | null;
  disabled?: boolean;
}) {
  const groupId = useId();
  const total = Math.round(sum(value));

  return (
    <div role="group" aria-labelledby={`${groupId}-label`} className="space-y-6">
      <p id={`${groupId}-label`} className="sr-only">
        Assign probabilities to each interpretation. The values always total one hundred percent:
        raising one lowers the others.
      </p>

      {interpretations.map((interp, i) => {
        const c = colorAt(i);
        const v = value[interp.id] ?? 0;
        const prev = previous?.[interp.id];
        const delta = prev === undefined ? null : v - prev;

        return (
          <div key={interp.id} className="group">
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${groupId}-${interp.id}`} className="min-w-0 flex-1">
                <span className="font-display text-[1.06rem] leading-tight" style={{ color: c.stroke }}>
                  {interp.label}
                </span>
                <span className="mt-0.5 block text-[0.82rem] leading-snug text-ink-faint">{interp.gloss}</span>
              </label>
              <span className="flex shrink-0 items-baseline gap-2">
                {delta !== null && delta !== 0 && (
                  <span
                    className={`font-mono text-[0.66rem] tabular ${delta > 0 ? "text-moss" : "text-ink-ghost"}`}
                    aria-hidden="true"
                  >
                    {delta > 0 ? "+" : ""}
                    {Math.round(delta)}
                  </span>
                )}
                <span className="font-mono text-[0.95rem] tabular" style={{ color: c.stroke }}>
                  {Math.round(v)}%
                </span>
              </span>
            </div>

            <div className="relative mt-2">
              {prev !== undefined && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-[13px] h-[3px] bg-ink/15"
                  style={{ width: `${prev}%` }}
                />
              )}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-[13px] h-[3px] transition-[width] duration-200"
                style={{ width: `${v}%`, background: c.stroke, opacity: 0.85 }}
              />
              <input
                id={`${groupId}-${interp.id}`}
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(v)}
                disabled={disabled}
                style={{ color: c.stroke }}
                onChange={(e) => onChange(setAndRebalance(value, interp.id, Number(e.target.value)))}
                aria-valuetext={`${Math.round(v)} percent on ${interp.label}`}
                className="relative z-10"
              />
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between border-t border-rule-soft pt-3">
        <span className="eyebrow">Total</span>
        <span className="font-mono text-[0.9rem] tabular text-ink-faint">{total}%</span>
      </div>
      <p aria-live="polite" className="sr-only">
        Total {total} percent.{" "}
        {interpretations.map((i) => `${i.label} ${Math.round(value[i.id] ?? 0)}`).join(", ")}.
      </p>
    </div>
  );
}
