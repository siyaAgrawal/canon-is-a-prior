"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { colorAt } from "@/lib/palette";

/**
 * The first fifteen seconds.
 *
 * A worked illustration, not data. The numbers below are stipulated to show what an
 * update looks like — the label says so plainly, because a chart of invented numbers
 * presented as findings is the exact failure this project is organised against.
 * The real version, where your own numbers are yours, is one click away.
 */

const READINGS = [
  { id: "keen", label: "Enthusiastic" },
  { id: "reluctant", label: "Reluctant" },
  { id: "neutral", label: "Neutral" },
  { id: "sarcasm", label: "Not really agreement" },
];

const FRAMES = [
  {
    caption: "Someone asks a friend: “Are you coming tonight?” The reply is one word.",
    evidence: null,
    values: { keen: 25, reluctant: 25, neutral: 25, sarcasm: 25 },
    note: "With nothing else to go on, every reading is as good as every other.",
  },
  {
    caption: null,
    evidence: "They normally reply within two minutes, in several lines. This took forty.",
    values: { keen: 12, reluctant: 42, neutral: 24, sarcasm: 22 },
    note: "Nothing about the word changed. What changed is what the word is being compared against.",
  },
  {
    caption: null,
    evidence: "Earlier in the week they said they were exhausted and might need a quiet weekend.",
    values: { keen: 9, reluctant: 61, neutral: 21, sarcasm: 9 },
    note: "The same forty minutes now has an explanation that costs the friendship nothing.",
  },
];

export function OpeningDemo() {
  const [frame, setFrame] = useState(0);
  const reduce = useReducedMotion();
  const f = FRAMES[frame];
  const atEnd = frame === FRAMES.length - 1;

  return (
    <div className="card relative px-5 py-6 sm:px-8 sm:py-7">
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">Illustration</p>
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-ghost tabular">
          {frame + 1} / {FRAMES.length}
        </p>
      </div>

      <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-soft">{FRAMES[0].caption}</p>

      <p className="mt-5 text-center font-display text-4xl sm:text-5xl">“Sure.”</p>

      <div className="mt-6 min-h-[3.2rem]">
        {f.evidence ? (
          <motion.p
            key={frame}
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-l-2 border-rust pl-4 text-[0.9rem] leading-relaxed text-ink"
          >
            <span className="eyebrow mr-2 text-rust">New evidence</span>
            {f.evidence}
          </motion.p>
        ) : (
          <p className="pl-4 text-[0.88rem] italic leading-relaxed text-ink-ghost">
            No evidence yet. Only the word.
          </p>
        )}
      </div>

      <ul className="mt-6 space-y-2.5">
        {READINGS.map((r, i) => {
          const c = colorAt(i);
          const v = (f.values as Record<string, number>)[r.id];
          return (
            <li key={r.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[0.84rem]" style={{ color: c.stroke }}>
                  {r.label}
                </span>
                <span className="font-mono text-[0.76rem] tabular" style={{ color: c.stroke }}>
                  {v}%
                </span>
              </div>
              <div className="mt-1 h-[6px] w-full bg-ink/[0.06]">
                <motion.span
                  className="block h-full"
                  style={{ background: c.stroke }}
                  animate={{ width: `${v}%` }}
                  transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 min-h-[2.6rem] text-[0.86rem] leading-relaxed text-ink-faint">{f.note}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-rule-soft pt-5">
        <button
          type="button"
          className="btn"
          onClick={() => setFrame((i) => (atEnd ? 0 : i + 1))}
        >
          {atEnd ? "Start again" : frame === 0 ? "Reveal a fact" : "Reveal another"}
        </button>
        <p className="text-[0.74rem] leading-snug text-ink-ghost">
          These numbers are stipulated to show the mechanism.
          <br className="hidden sm:block" /> They are not measurements of anybody.
        </p>
      </div>
    </div>
  );
}
