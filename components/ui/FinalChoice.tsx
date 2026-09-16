"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * The last question, which is not a quiz.
 *
 * Nothing here is scored and nothing is stored. Each option opens onto what that move
 * actually commits you to, including its failure mode — because all four are correct
 * somewhere and disastrous somewhere else, and knowing which situation you are in is
 * the part no rule supplies.
 */

const OPTIONS = [
  {
    id: "keep",
    label: "Keep the model",
    when: "When the evidence is not more surprising under the alternatives than under yours.",
    body: "The most underrated option. A theory that survives an anomaly is not necessarily being defended dishonestly — most anomalies really are unresolved puzzles, and a field that abandoned its framework at the first one would never build anything. Kuhn's normal science is precisely this, and it is where almost all successful science happens.",
    failure: "It becomes dishonest at the moment you could not say what would change your mind.",
  },
  {
    id: "update",
    label: "Update the model",
    when: "When the evidence discriminates — when it is genuinely more expected under one reading than another.",
    body: "The move the whole site has been teaching, and the one that has a formal rule attached. Its virtue is that it is proportionate: the size of the revision is determined by how much the evidence separates the options, not by how strongly you feel about the new fact.",
    failure: "Over-updating on vivid evidence that does not actually discriminate — which is most vivid evidence.",
  },
  {
    id: "question",
    label: "Question the category",
    when: "When the evidence fits none of your options, or when several of them keep surviving no matter what arrives.",
    body: "The de Broglie move. It is not available on demand and it cannot be produced by any updating rule, because the rule can only redistribute weight across options you already have. It usually requires noticing that the question carried a false assumption in its form — wave or particle, curiosity or pride.",
    failure: "Reaching for it whenever the evidence is inconvenient. Dissolving a question is not the same as answering it.",
  },
  {
    id: "write",
    label: "Write a new one",
    when: "When you can say what the new model forbids.",
    body: "Peirce's abduction: the generation of a candidate nobody had. It is the step that formal machinery cannot do for you, and it is also the step with the least quality control — a newly invented explanation arrives with no track record at all.",
    failure: "A new story that explains everything, and therefore forbids nothing, and therefore tells you nothing.",
  },
];

export function FinalChoice() {
  const [id, setId] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const chosen = OPTIONS.find((o) => o.id === id) ?? null;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={o.id === id}
            onClick={() => setId(o.id === id ? null : o.id)}
            className={`border px-5 py-5 text-left transition-colors ${
              o.id === id
                ? "border-ink bg-ink text-paper"
                : "border-ink/25 hover:border-ink hover:bg-paper-raised"
            }`}
          >
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em]">{o.label}</span>
            <span
              className={`mt-2 block text-[0.84rem] leading-snug ${o.id === id ? "text-paper/70" : "text-ink-faint"}`}
            >
              {o.when}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {chosen && (
          <motion.div
            key={chosen.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 border-l-2 border-rust pl-5 sm:pl-6"
          >
            <p className="prose-note">{chosen.body}</p>
            <p className="mt-4 text-[0.88rem] leading-relaxed text-ink-faint">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-rust">
                Where it goes wrong —{" "}
              </span>
              {chosen.failure}
            </p>
            <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-ghost">
              Not scored. Not recorded. All four are right somewhere.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
