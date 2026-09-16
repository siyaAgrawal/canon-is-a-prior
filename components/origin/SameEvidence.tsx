"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { recordTrace } from "@/lib/record";
import { Recorded } from "@/components/ui/Recorded";

/**
 * The hook.
 *
 * A name, some words people have used for him, and three things he does. Choose
 * what the cruelty is evidence of, and all three readings rewrite themselves while
 * the facts stay exactly where they are.
 *
 * On copyright: the character is named, which is a reference and not a
 * reproduction. Nothing here quotes or paraphrases any published text. The three
 * facts are written to be archetypal rather than specific — true of the shape of
 * the character across a great many retellings, which is the point, since the
 * argument is about what a retelling can hold fixed.
 */

const ASSUMPTIONS = [
  {
    id: "character",
    word: "cruel",
    label: "It is who he is.",
    tint: "#C84E42",
    readings: [
      "Cruelty, expressed. The pattern is the person, and it repeats because nothing underneath is pushing the other way.",
      "Obedience is easy for him. He wants what they want, so nothing is being paid.",
      "A failure of nerve at the last moment. He was capable of it, something small stopped him, and that does not undo what came before.",
    ],
  },
  {
    id: "fear",
    word: "frightened",
    label: "It is fear, performing.",
    tint: "#E0A244",
    readings: [
      "A display for an audience that would punish its absence. The target is chosen for being safe to choose.",
      "Compliance under threat. Each act costs him something, and the cost is why none of it is ever done well.",
      "The first moment the audience is gone. Without them there is no performance, and what is left does not do it.",
    ],
  },
  {
    id: "inherited",
    word: "taught",
    label: "It is inherited, and unexamined.",
    tint: "#8B6FA8",
    readings: [
      "Not a decision. A reflex assembled before he could evaluate it, aimed where he was taught to aim.",
      "The path of least resistance through a world he did not build and has not yet looked at.",
      "The first thing he has had to decide rather than perform — and the machinery he was given has no instruction for it.",
    ],
  },
];

const FACTS = [
  "He is cruel to someone smaller than him, in public, more than once.",
  "He does what his family expects, at every point where it would cost something not to.",
  "At the moment it matters most, he does not do the thing he was sent to do.",
];

const SCATTER = ["cruel", "frightened", "arrogant", "lonely", "coward", "loyal", "spoiled", "afraid", "taught"];

export function SameEvidence() {
  const reduce = useReducedMotion();
  const [chosen, setChosen] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const startedAt = useRef(Date.now());
  const sent = useRef(false);
  const historyRef = useRef<string[]>([]);
  historyRef.current = history;

  const active = ASSUMPTIONS.find((a) => a.id === chosen) ?? null;

  const choose = (id: string) => {
    setChosen(id);
    setHistory((h) => (h[h.length - 1] === id ? h : [...h, id]));
  };

  // Recorded once, on leaving, so the trace reflects what was actually explored
  // rather than the first click.
  useEffect(() => {
    const send = () => {
      const h = historyRef.current;
      if (sent.current || h.length === 0) return;
      sent.current = true;
      void recordTrace(
        "entry",
        { assumptions: h, switches: Math.max(0, h.length - 1) },
        Date.now() - startedAt.current,
      );
    };
    window.addEventListener("pagehide", send);
    return () => {
      window.removeEventListener("pagehide", send);
      send();
    };
  }, []);

  return (
    <div className="relative">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-40 -top-52 h-[46rem]"
        animate={{
          opacity: active ? 1 : 0.5,
          background: `radial-gradient(58% 48% at 28% 22%, ${active?.tint ?? "#E0A244"}26, transparent 70%)`,
        }}
        transition={{ duration: reduce ? 0 : 1.2 }}
      />

      <div className="relative">
        <p className="kicker">Somebody who has been written several thousand times</p>

        <h1 className="mt-6 font-display text-d1 leading-[0.84]">
          <span className="sr-only">Draco — same evidence, different person</span>
          <span aria-hidden="true">Draco</span>
        </h1>

        <ul className="mt-7 flex max-w-column flex-wrap gap-x-5 gap-y-2" aria-hidden="true">
          {SCATTER.map((w, i) => {
            const isActiveWord = active?.word === w;
            return (
              <motion.li
                key={w}
                className="font-text text-[1.05rem] italic"
                animate={{
                  opacity: !active ? 0.5 : isActiveWord ? 1 : 0.16,
                  color: isActiveWord ? active!.tint : "rgb(var(--muted))",
                }}
                transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : i * 0.02 }}
              >
                {w}
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
          <div>
            <p className="kicker mb-4">The cruelty is evidence of —</p>
            <ul>
              {ASSUMPTIONS.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    className="pick font-text text-[1.06rem]"
                    aria-pressed={chosen === a.id}
                    onClick={() => choose(a.id)}
                    style={chosen === a.id ? { borderColor: a.tint, background: `${a.tint}18` } : undefined}
                  >
                    {a.label}
                  </button>
                </li>
              ))}
            </ul>
            {history.length > 1 && (
              <p className="mt-6 max-w-measure text-[0.8rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                You have now read him {history.length} ways. Nothing he did changed.
              </p>
            )}
          </div>

          <div>
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <p className="kicker">What he does — unchanged</p>
              {active && (
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em]" style={{ color: active.tint }}>
                  read as {active.word}
                </p>
              )}
            </div>

            <ol>
              {FACTS.map((fact, i) => (
                <li key={i} className="hair py-6">
                  <p className="font-text text-[1.08rem] leading-[1.5]">{fact}</p>

                  <div className="mt-3 min-h-[3.4rem]">
                    <AnimatePresence mode="wait">
                      {active ? (
                        <motion.p
                          key={active.id}
                          initial={reduce ? false : { opacity: 0, y: 8, filter: "blur(3px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={reduce ? undefined : { opacity: 0, y: -6, filter: "blur(3px)" }}
                          transition={{ duration: reduce ? 0 : 0.42, delay: reduce ? 0 : i * 0.07 }}
                          className="border-l-2 pl-4 text-[0.95rem] leading-relaxed"
                          style={{ borderColor: active.tint, color: "rgb(var(--muted))" }}
                        >
                          {active.readings[i]}
                        </motion.p>
                      ) : (
                        <p key="empty" className="pl-4 text-[0.9rem] italic" style={{ color: "rgb(var(--faint))" }}>
                          Means nothing yet.
                        </p>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <AnimatePresence>
          {history.length >= 2 && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.7 }}
              className="mt-16"
            >
              <p className="font-display text-d3">Same evidence. Different person.</p>
              <p
                className="mt-4 max-w-measure font-text text-[1.04rem] leading-[1.6]"
                style={{ color: "rgb(var(--muted))" }}
              >
                He stays recognisably himself across all three. So the person was never only the
                evidence — and something you brought was doing part of the work.
              </p>
              <div className="mt-8">
                <Recorded what="Which assumptions you tried, in order." />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
