"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { recordTrace } from "@/lib/record";
import { Recorded } from "@/components/ui/Recorded";

/**
 * "Sure."
 *
 * One word, five readings, three facts. The signature interaction, and the whole
 * project in ninety seconds: you commit to a reading of four letters, you say how
 * sure you are, and then the evidence arrives — after the commitment, which is
 * the order it usually arrives in.
 *
 * There is no correct answer and none is revealed, because none exists. What the
 * turn at the end shows you is your own path: the reading you took on nothing,
 * and what the facts did or did not do to it.
 */

const READINGS = [
  { id: "keen", label: "He wants to come.", tone: "#6AAD89" },
  { id: "reluctant", label: "He'll come, but he doesn't want to.", tone: "#E0A244" },
  { id: "flat", label: "Nothing. It's a yes.", tone: "#A89478" },
  { id: "annoyed", label: "He's irritated and not saying so.", tone: "#C84E42" },
  { id: "no", label: "It isn't really agreement.", tone: "#8B6FA8" },
];

const FACTS = [
  "It took him forty minutes to reply. He usually replies in two.",
  "On Tuesday he'd said he was exhausted and might need a quiet weekend.",
  "He arrived first. He stayed until the end. By every account he was in a good mood.",
];

type Phase = "choose" | "confidence" | "facts" | "turn";

export function Sure({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("choose");
  const [path, setPath] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [fact, setFact] = useState(0);
  const startedAt = useRef(Date.now());
  const sent = useRef(false);

  const current = path[path.length - 1] ?? null;
  const readingOf = (id: string | null) => READINGS.find((r) => r.id === id) ?? null;
  const changes = path.slice(1).filter((v, i) => v !== path[i]).length;

  const commitPrior = (id: string) => {
    setPath([id, id]);
    setPhase("confidence");
  };

  const revise = (id: string) => setPath((p) => [...p.slice(0, -1), id]);

  const advance = () => {
    if (fact < FACTS.length - 1) {
      setFact((f) => f + 1);
      setPath((p) => [...p, p[p.length - 1]]);
    } else {
      setPhase("turn");
      onDone?.();
    }
  };

  useEffect(() => {
    if (phase !== "turn" || sent.current) return;
    sent.current = true;
    void recordTrace(
      "entry",
      { path, changes, confidence, completed: true },
      Date.now() - startedAt.current,
    );
  }, [phase, path, changes, confidence]);

  const tone = readingOf(current)?.tone ?? "#E0A244";

  return (
    <div className="relative">
      {/* Light follows the committed reading. Before you choose, nothing is lit. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-32 -top-32 h-[34rem]"
        animate={{
          opacity: current ? 1 : 0.35,
          background: `radial-gradient(52% 46% at 34% 26%, ${tone}22, transparent 68%)`,
        }}
        transition={{ duration: reduce ? 0 : 1 }}
      />

      <div className="relative">
        <p className="kicker">Someone asks a friend whether he&rsquo;s coming tonight</p>

        {/* The word. */}
        <div className="relative mt-7 inline-flex items-start">
          <motion.span
            aria-hidden="true"
            className="font-display text-d1 leading-none"
            style={{ color: tone }}
            animate={{ opacity: [0.45, 0.85, 0.45] }}
            transition={reduce ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            &ldquo;
          </motion.span>
          <span className="font-display text-d1 leading-none">Sure.</span>
          <motion.span
            aria-hidden="true"
            className="font-display text-d1 leading-none"
            style={{ color: tone }}
            animate={{ opacity: [0.45, 0.85, 0.45] }}
            transition={reduce ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            &rdquo;
          </motion.span>
        </div>
        <p className="mt-2 text-[0.82rem]" style={{ color: "rgb(var(--faint))" }}>
          That is the entire reply.
        </p>

        <AnimatePresence mode="wait">
          {/* ── Choose ─────────────────────────────────────────────────────── */}
          {(phase === "choose" || phase === "confidence" || phase === "facts") && (
            <motion.div
              key="pick"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              className="mt-12"
            >
              <p className="font-display text-d4">
                {phase === "facts" ? "What does he mean now?" : "What did he mean?"}
              </p>

              <ul className="mt-5 max-w-measure">
                {READINGS.map((r) => {
                  const selected = current === r.id;
                  const dimmed = Boolean(current) && !selected;
                  return (
                    <motion.li
                      key={r.id}
                      animate={{ opacity: dimmed ? 0.35 : 1 }}
                      transition={{ duration: reduce ? 0 : 0.45 }}
                    >
                      <button
                        type="button"
                        className="pick font-text text-[1.08rem]"
                        aria-pressed={selected}
                        onClick={() => (phase === "choose" ? commitPrior(r.id) : revise(r.id))}
                        style={selected ? { borderColor: r.tone, background: `${r.tone}17` } : undefined}
                      >
                        {r.label}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>

              {/* ── Confidence ───────────────────────────────────────────── */}
              {phase === "confidence" && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 max-w-measure"
                >
                  <label htmlFor="sure-confidence" className="block font-display text-d5">
                    How certain are you?
                  </label>
                  <div className="mt-4 flex items-center gap-4">
                    <input
                      id="sure-confidence"
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={confidence ?? 50}
                      onChange={(e) => setConfidence(Number(e.target.value))}
                      style={{ color: tone }}
                      aria-valuetext={`${confidence ?? 50} percent certain`}
                    />
                    <span className="w-14 shrink-0 text-right font-mono text-[0.92rem] tabular" style={{ color: tone }}>
                      {confidence === null ? "—" : `${confidence}%`}
                    </span>
                  </div>
                  <p className="mt-3 text-[0.8rem]" style={{ color: "rgb(var(--faint))" }}>
                    About four letters, with no tone and no face. Optional.
                  </p>
                  <button type="button" className="btn mt-7" onClick={() => setPhase("facts")}>
                    Then he does some things
                  </button>
                </motion.div>
              )}

              {/* ── Facts ────────────────────────────────────────────────── */}
              {phase === "facts" && (
                <div className="mt-10">
                  <div className="min-h-[5.5rem] max-w-measure">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={fact}
                        initial={reduce ? false : { opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: 8 }}
                        transition={{ duration: 0.4 }}
                      >
                        <p className="kicker" style={{ color: "rgb(var(--accent))" }}>
                          Then — {fact + 1} of {FACTS.length}
                        </p>
                        <p className="mt-2 font-text text-[1.12rem] leading-[1.5]">{FACTS[fact]}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <button type="button" className="btn" onClick={advance}>
                      {fact < FACTS.length - 1 ? "And then" : "That's everything I have"}
                    </button>
                    <span className="text-[0.8rem]" style={{ color: "rgb(var(--faint))" }}>
                      Change your reading, or leave it. Both are answers.
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── The turn ───────────────────────────────────────────────────── */}
          {phase === "turn" && (
            <motion.div
              key="turn"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-14 max-w-column"
            >
              <p className="font-display text-d3">
                You interpreted him before you knew why he said it.
              </p>

              <ol className="mt-10 max-w-measure">
                {path.map((p, i) => {
                  const r = readingOf(p);
                  const moved = i > 0 && p !== path[i - 1];
                  return (
                    <li key={i} className="hair flex items-baseline gap-4 py-3">
                      <span className="w-[5.5rem] flex-none font-mono text-[0.58rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--faint))" }}>
                        {i === 0 ? "on the word" : `after ${i}`}
                      </span>
                      <span className="text-[0.94rem]" style={{ color: moved ? r?.tone : "rgb(var(--muted))" }}>
                        {r?.label}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <p className="say mt-9 max-w-measure">
                {changes === 0
                  ? "Three facts arrived and nothing moved. Which might mean the facts were weak — or that the first reading was doing more work than the facts were."
                  : `You moved ${changes === 1 ? "once" : `${changes} times`}. Each time it felt like the evidence pushed you. Some of it did.`}
                {confidence !== null && confidence >= 70 && changes > 0 && (
                  <> You were {confidence}% sure before any of it arrived.</>
                )}
              </p>

              <p className="mt-6 max-w-measure text-[0.86rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                There is no answer. He is invented, and nothing here is scored. Also: I wrote the five
                readings. He might have meant a sixth.
              </p>

              <div className="mt-8">
                <Recorded what="The reading you held at each stage, how many times you moved, and your confidence before any evidence arrived." />
              </div>

              <button
                type="button"
                className="btn-quiet mt-8"
                onClick={() => {
                  setPhase("choose");
                  setPath([]);
                  setFact(0);
                  setConfidence(null);
                  sent.current = false;
                  startedAt.current = Date.now();
                }}
              >
                ↺ Run it again, differently
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
