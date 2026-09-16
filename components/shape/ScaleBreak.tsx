"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Six cases, one operation, deliberately unlabelled.
 *
 * The reader opens them in any order and is not told what they have in common.
 * The sequence runs from a character to a physical measurement to a person,
 * because the discomfort is supposed to increase as it approaches things the
 * reader would not describe as interpretation at all.
 *
 * The closing line does not say "these are all the same". They are not, and the
 * page after this one is where that gets argued properly.
 */

interface Case {
  id: string;
  domain: string;
  same: string;
  changed: string;
  then: string;
  href?: string;
  hrefLabel?: string;
}

const CASES: Case[] = [
  {
    id: "character",
    domain: "A character",
    same: "Every scene he appears in. Every line he says. The whole recorded history.",
    changed: "He was frightened, not cruel.",
    then: "The cruelty becomes a performance, the loyalty becomes coercion, and the person who forgives him at the end stops being naive. Nothing he did has changed. He is still, unmistakably, the same character — which is the part I could not stop thinking about.",
    href: "/versions",
    hrefLabel: "The character lab",
  },
  {
    id: "myth",
    domain: "A myth",
    same: "The wings, the warning, the climb, the wax, the sea.",
    changed: "He wanted to know what was up there, rather than to defy anyone.",
    then: "The fall stops being a punishment and becomes a price. Daedalus stops being wronged and becomes an engineer who under-specified a safety-critical instruction. Three thousand years of the story meaning pride was carried by an assumption the text does not state.",
    href: "/rewrite",
    hrefLabel: "Change one assumption",
  },
  {
    id: "law",
    domain: "A text with authority",
    same: "The words, fixed, in front of everyone in the room.",
    changed: "What the words were for.",
    then: "Two readings, both careful, both citing the same line. The text did not move. Something else in the room did — and legal systems build elaborate machinery for deciding whose something else wins, which is an admission that the text alone was never going to settle it.",
  },
  {
    id: "particle",
    domain: "A measurement",
    same: "The apparatus, the electrons, the pattern on the screen.",
    changed: "Whether the available description has to be one of two things.",
    then: "It doesn't, and the arithmetic says so precisely. But notice what happened: the anomaly was not in the electron. It was in a pair of words that had been treated as exhausting the options.",
    href: "/categories",
    hrefLabel: "When the category breaks",
  },
  {
    id: "data",
    domain: "A dataset",
    same: "Every row. Nothing added, nothing dropped.",
    changed: "What the labels mean.",
    then: "A model trained on the relabelled data learns a different world and predicts confidently in it. The rows were never the model. The rows plus somebody's categories were the model, and only one of those was collected.",
  },
  {
    id: "person",
    domain: "A person",
    same: "What they said. What they did. What you remember. What you were told.",
    changed: "What you assumed they wanted.",
    then: "This is where it stopped being an interesting observation about stories.",
    href: "/person",
    hrefLabel: "The model of a person",
  },
];

export function ScaleBreak() {
  const [open, setOpen] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <div>
      <ul>
        {CASES.map((c, i) => {
          const isOpen = open === c.id;
          return (
            <li key={c.id} className="hair">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : c.id)}
                  className="group flex w-full items-baseline gap-5 py-5 text-left sm:gap-8"
                >
                  <span className="w-6 shrink-0 font-mono text-[0.6rem] tracking-[0.16em] text-ink-ghost tabular">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-display-m transition-colors group-hover:text-rust">
                    {c.domain}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`shrink-0 font-mono text-sm text-ink-ghost transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
              </h3>

              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="grid gap-x-8 gap-y-6 pb-10 sm:grid-cols-[6.5rem_1fr] sm:pl-[3.4rem]">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-ghost">
                    unchanged
                  </p>
                  <p className="text-[0.92rem] leading-relaxed text-ink-faint">{c.same}</p>

                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-rust">changed</p>
                  <p className="font-display text-[1.1rem] leading-snug text-ink">{c.changed}</p>

                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-ghost">then</p>
                  <div>
                    <p className="say">{c.then}</p>
                    {c.href && (
                      <Link href={c.href} className="btn-quiet mt-4">
                        {c.hrefLabel} →
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </li>
          );
        })}
      </ul>
      <div className="hair" />
    </div>
  );
}
