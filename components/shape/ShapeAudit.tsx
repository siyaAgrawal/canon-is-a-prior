"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { claims, VERDICT_LABEL, type Claim } from "@/data/claims";
import { recordTrace } from "@/lib/record";
import { Recorded } from "@/components/ui/Recorded";

/**
 * The reader judges this project's own connections before being told which are
 * real, which were given up, and which were written as controls.
 *
 * Scoring is deliberately blunt: three controls are in the set, and the only
 * score the page reports prominently is how many of them the reader accepted.
 * Accepting a control is not a failure — they were written to be accepted — but
 * it is the number that makes the point, and it makes it about the reader rather
 * than at them, because I wrote the controls by doing exactly what I do when I
 * find a real one.
 *
 * Nothing is stored. This is an argument, not a study.
 */

type Judgement = "found" | "imposed";

export function ShapeAudit() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [judgements, setJudgements] = useState<Record<string, Judgement>>({});
  const [revealed, setRevealed] = useState(false);
  const startedAt = useRef(Date.now());
  const sent = useRef(false);

  // Fixed order: controls are interleaved rather than clustered, so a reader
  // cannot infer status from position.
  const order = useMemo(
    () => [
      "canon-prior",
      "grief-compression",
      "fanfic-counterfactual",
      "person-dataset",
      "immune-canon",
      "debroglie-category",
      "narrative-identity",
      "law-interpretation",
      "evolution-revision",
      "llm-prior",
    ],
    [],
  );

  const sequence = useMemo(
    () => order.map((id) => claims.find((c) => c.id === id)!).filter(Boolean),
    [order],
  );

  const done = Object.keys(judgements).length === sequence.length;
  const claim: Claim | undefined = sequence[i];

  const judge = (j: Judgement) => {
    if (!claim) return;
    setJudgements((prev) => ({ ...prev, [claim.id]: j }));
    if (i < sequence.length - 1) setI(i + 1);
  };

  const controls = sequence.filter((c) => c.verdict === "control");
  const controlsAccepted = controls.filter((c) => judgements[c.id] === "found").length;
  const realOnes = sequence.filter((c) => c.verdict === "holds");
  const realRejected = realOnes.filter((c) => judgements[c.id] === "imposed").length;

  // How often the fabrications pass is the single most useful number this project
  // can collect, so unlike the rest of the instruments this one records on reveal.
  useEffect(() => {
    if (!revealed || sent.current) return;
    sent.current = true;
    void recordTrace(
      "shape",
      { judgements, controlsAccepted, realRejected },
      Date.now() - startedAt.current,
    );
  }, [revealed, judgements, controlsAccepted, realRejected]);

  if (revealed) {
    return (
      <div>
        <div className="max-w-column">
          <p className="statement">
            {controlsAccepted === 0
              ? "You caught all three."
              : controlsAccepted === 3
                ? "You accepted all three inventions."
                : `You accepted ${controlsAccepted} of the three inventions.`}
          </p>
          <div className="say mt-7 max-w-measure">
            <p>
              Three of those were written as controls. They are not claims this project holds. I
              wrote them by doing the thing I do when I find a real one — notice two domains, state
              the shared structure at whatever level of abstraction makes it true, stop there.
            </p>
            <p>
              {controlsAccepted >= 2
                ? "They worked on you. They also worked on me while I was writing them, which is the part I find hard to get past."
                : controlsAccepted === 1
                  ? "One got through. That is roughly my own rate when I come back to my notes after a month."
                  : "None got through, which is better than I manage on my own claims after a few weeks away from them."}
              {realRejected > 0 &&
                ` You also rejected ${realRejected} of the ones I think hold — which may mean I am wrong about those, and that is a legitimate outcome of this page.`}
            </p>
          </div>
        </div>

        <ol className="mt-16">
          {sequence.map((c) => {
            const j = judgements[c.id];
            const isControl = c.verdict === "control";
            return (
              <li key={c.id} className="hair py-8">
                <div className="grid gap-x-8 gap-y-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
                      {c.between[0]} <span className="text-accent">/</span> {c.between[1]}
                    </p>
                    <p className="mt-3 font-display text-[1.06rem] leading-[1.45] text-fg">{c.claim}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span
                        className={`tag ${
                          c.verdict === "holds"
                            ? "tag-observed"
                            : c.verdict === "weakened"
                              ? "tag-analogy"
                              : c.verdict === "abandoned"
                                ? "tag-abandoned"
                                : "tag-illustration"
                        }`}
                      >
                        {VERDICT_LABEL[c.verdict]}
                      </span>
                      {j && (
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
                          you said {j}
                          {isControl && j === "found" && <span className="text-accent"> — it was mine</span>}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="say text-[0.94rem]">{c.reasoning}</p>
                    <p className="mt-3 text-[0.85rem] leading-relaxed text-faint">
                      <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-accent">
                        Changes if —{" "}
                      </span>
                      {c.wouldChangeIf}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="hair pt-8">
          <button
            type="button"
            className="btn-quiet"
            onClick={() => {
              setJudgements({});
              setI(0);
              setRevealed(false);
              sent.current = false;
              startedAt.current = Date.now();
            }}
          >
            ↺ Clear and run it again
          </button>
          <div className="mt-6">
            <Recorded what="Your ten judgements and how many controls passed." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {sequence.map((c, n) => (
            <span
              key={c.id}
              className={`h-[3px] flex-1 transition-colors duration-300 ${
                judgements[c.id] ? "bg-accent/60" : n === i ? "bg-accent" : "bg-fg/10"
              }`}
            />
          ))}
        </div>
        <span className="font-mono text-[0.62rem] tabular text-faint">
          {Object.keys(judgements).length}/{sequence.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {claim && (
          <motion.div
            key={claim.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-[19rem]"
          >
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
              {claim.between[0]} <span className="text-accent">/</span> {claim.between[1]}
            </p>
            <p className="mt-6 max-w-column font-display text-d4 leading-[1.3]">{claim.claim}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              <button type="button" className="btn" onClick={() => judge("found")}>
                The structure is there
              </button>
              <button type="button" className="btn" onClick={() => judge("imposed")}>
                Someone put it there
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-5">
              {i > 0 && (
                <button type="button" className="btn-quiet" onClick={() => setI(i - 1)}>
                  ← Back
                </button>
              )}
              {i < sequence.length - 1 && (
                <button type="button" className="btn-quiet" onClick={() => setI(i + 1)}>
                  Skip this one →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hair mt-10 pt-6">
        <button
          type="button"
          className="btn border-fg bg-fg text-bg hover:bg-transparent hover:text-ink disabled:border-fg/25 disabled:bg-transparent disabled:text-fg"
          disabled={!done}
          onClick={() => setRevealed(true)}
        >
          {done ? "Show me what they were" : `Judge all ${sequence.length} first`}
        </button>
        <p className="mt-4 max-w-measure text-[0.8rem] leading-relaxed text-faint">
          Some of these I defend. One I gave up. Some I wrote myself, to see whether they would pass.
        </p>
        <div className="mt-4">
          <Recorded what="Which claims you marked found or imposed, and how many of the three controls got through — the single most useful number this project can collect." />
        </div>
      </div>
    </div>
  );
}
