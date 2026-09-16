"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Tag } from "@/components/ui/Tag";

/**
 * The first thing anybody does here.
 *
 * Structure: one word of evidence, a forced reading, three more pieces of
 * evidence, and then two turns.
 *
 * The first turn is that the reader interpreted before any evidence arrived —
 * they chose a reading of a single word, and everything after that was a
 * defence or a revision of a position taken on nothing.
 *
 * The second turn is the one that matters, and it is at this project's own
 * expense: the five readings were not the available readings. They were five
 * readings someone else wrote. The instrument that measured the reader's prior
 * was itself a prior. Which is, as far as I can tell, unfixable, and is most of
 * why the rest of the site exists.
 *
 * No probabilities here. A number would let the reader treat this as a
 * measurement of something, and it is not. It is one word and five options.
 */

const READINGS = [
  { id: "keen", label: "He wants to come." },
  { id: "reluctant", label: "He'll come, but he doesn't want to." },
  { id: "flat", label: "Nothing. It's just a yes." },
  { id: "annoyed", label: "He's irritated and not saying so." },
  { id: "no", label: "It isn't really agreement." },
];

interface Beat {
  evidence: string;
  after: string;
}

const BEATS: Beat[] = [
  {
    evidence: "It took him forty minutes to reply. He usually replies in two.",
    after: "You can keep your reading or change it. Both are answers.",
  },
  {
    evidence: "On Tuesday he'd said he was exhausted and might need a quiet weekend.",
    after: "",
  },
  {
    evidence: "He arrived first. He stayed until the end. He was, by every account, in a good mood.",
    after: "",
  },
];

type Phase = "prior" | "beats" | "turn1" | "turn2" | "done";

export function Entry() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("prior");
  const [beat, setBeat] = useState(0);
  const [path, setPath] = useState<string[]>([]);

  const current = path[path.length - 1] ?? null;
  const labelOf = (id: string | null) => READINGS.find((r) => r.id === id)?.label ?? "";

  /**
   * The path holds one entry per stage: index 0 is the reading taken on the word
   * alone, index i is the reading held after fact i. Choosing the prior therefore
   * pushes twice — the prior itself, which is now frozen, and a working copy for
   * the first fact. An earlier version pushed once and silently lost the last
   * fact's entry, so the summary showed three rows for four decisions.
   */
  const choose = (id: string) => {
    if (phase === "prior") {
      setPath([id, id]);
      setPhase("beats");
      return;
    }
    setPath((p) => [...p.slice(0, -1), id]);
  };

  const next = () => {
    if (beat < BEATS.length - 1) {
      setBeat((b) => b + 1);
      setPath((p) => [...p, p[p.length - 1]]);
    } else {
      setPhase("turn1");
    }
  };

  const changes = path.slice(1).filter((v, i) => v !== path[i]).length;

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="min-h-[68vh]">
      <AnimatePresence mode="wait">
        {(phase === "prior" || phase === "beats") && (
          <motion.div key="run" {...fade}>
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-ghost">
              Someone asks a friend whether he&rsquo;s coming tonight. This is the whole reply.
            </p>

            <p className="mt-7 font-display text-6xl leading-none sm:text-7xl">&ldquo;Sure.&rdquo;</p>

            {/* The slot only takes space once there is something in it; an empty
                reserved box before the first fact reads as a hole in the page. */}
            <div className={phase === "beats" ? "mt-12 min-h-[5rem]" : "mt-2"}>
              <AnimatePresence mode="wait">
                {phase === "beats" && (
                  <motion.div key={beat} {...fade}>
                    <span className="tag tag-observed">later</span>
                    <p className="mt-3 max-w-measure font-display text-display-s text-ink">
                      {BEATS[beat].evidence}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-9 text-[0.9rem] text-ink-faint">
              {phase === "prior" ? "What did he mean?" : "What does he mean now?"}
            </p>

            <ul className="mt-3 max-w-measure">
              {READINGS.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className="pick"
                    aria-pressed={current === r.id && phase === "beats"}
                    onClick={() => choose(r.id)}
                  >
                    {r.label}
                  </button>
                </li>
              ))}
            </ul>

            {phase === "beats" && (
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <button type="button" className="btn" onClick={next}>
                  {beat < BEATS.length - 1 ? "Then" : "That's all the evidence"}
                </button>
                {BEATS[beat].after && (
                  <span className="text-[0.82rem] text-ink-ghost">{BEATS[beat].after}</span>
                )}
              </div>
            )}
          </motion.div>
        )}

        {phase === "turn1" && (
          <motion.div key="turn1" {...fade}>
            <div className="max-w-column">
              <p className="statement">
                You had a reading of him before any evidence arrived.
              </p>
              <div className="say mt-8 max-w-measure">
                <p>
                  The word was &ldquo;sure&rdquo;. Four letters, no tone, no face. You picked{" "}
                  <em>{labelOf(path[0])}</em> from it.
                </p>
                <p>
                  {changes === 0
                    ? "Then three facts arrived and you didn't move. Which might mean the facts were weak. Or that the first reading was doing more work than the facts were."
                    : changes === 1
                      ? "Then you moved once. Worth knowing which fact did it, and whether it was the strongest one or just the most vivid."
                      : `Then you moved ${changes} times. Each time it felt like the evidence pushed you. Some of it did.`}
                </p>
              </div>

              <ol className="mt-10 max-w-measure">
                {path.map((p, i) => (
                  <li key={i} className="hair flex gap-4 py-2.5">
                    <span className="mt-[3px] w-20 shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-ghost">
                      {i === 0 ? "on nothing" : `after ${i}`}
                    </span>
                    <span className={`text-[0.9rem] ${p !== path[i - 1] && i > 0 ? "text-rust" : "text-ink-soft"}`}>
                      {labelOf(p)}
                    </span>
                  </li>
                ))}
              </ol>

              <button type="button" className="btn mt-12" onClick={() => setPhase("turn2")}>
                There&rsquo;s a worse problem
              </button>
            </div>
          </motion.div>
        )}

        {phase === "turn2" && (
          <motion.div key="turn2" {...fade}>
            <div className="max-w-column">
              <p className="statement">I gave you five readings.</p>
              <p className="statement mt-2 text-ink-faint">I chose the five.</p>

              <div className="say mt-10 max-w-measure">
                <p>
                  He might have been being kind. He might have meant something the five don&rsquo;t
                  contain and I didn&rsquo;t think of. You couldn&rsquo;t have picked it — there was
                  no button.
                </p>
                <p>
                  So the instrument that caught your prior had one of its own, and mine is harder to
                  see than yours because it looks like the shape of the question rather than an
                  answer to it.
                </p>
                <p>
                  I don&rsquo;t know how to remove that. Every experiment on this site has the same
                  defect. I&rsquo;ve tried to say so each time.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Tag kind="illustration" />
                <span className="max-w-measure text-[0.8rem] leading-relaxed text-ink-ghost">
                  Nothing here was recorded. He isn&rsquo;t real. The point was the shape of what you
                  just did, not the data.
                </span>
              </div>

              <div className="mt-14">
                <button type="button" className="btn-quiet" onClick={() => { setPhase("prior"); setPath([]); setBeat(0); }}>
                  ↺ Run it again, differently
                </button>
              </div>

              <p className="mt-16 font-mono text-[0.64rem] uppercase tracking-[0.2em] text-ink-ghost">
                Keep going ↓
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "prior" && (
        <p className="mt-16 max-w-measure text-[0.82rem] leading-relaxed text-ink-ghost">
          <Link href="/shape" className="underline decoration-dotted underline-offset-4 hover:text-ink">
            Or skip the demonstration
          </Link>{" "}
          and go straight to the part where I try to work out whether any of this is real.
        </p>
      )}
    </div>
  );
}
