"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cases, criteria, type DiscriminateCase } from "@/data/discriminate";
import { recordTrace } from "@/lib/record";
import { Reasoning } from "@/components/ui/Reasoning";
import { Recorded } from "@/components/ui/Recorded";
import { Tag } from "@/components/ui/Tag";

/**
 * The justification instrument.
 *
 * Two models that both fit everything. The participant is deliberately *not*
 * asked which is right — that question has no answer yet and asking it measures
 * taste. They are asked which they prefer and on what grounds, then to design an
 * observation that would tell the two apart, then to predict its result.
 *
 * The proposed test is the gradable part: a candidate either separates the models
 * or it does not, and that is a fact about the test rather than about the person.
 * Several of the non-discriminating options are written to be vivid and specific,
 * because that is what makes more-evidence feel like better-evidence.
 */

type Phase = "read" | "prefer" | "design" | "predict" | "outcome";

export function Discriminate() {
  const reduce = useReducedMotion();
  const [caseIdx, setCaseIdx] = useState(0);
  const c: DiscriminateCase = cases[caseIdx];

  const [phase, setPhase] = useState<Phase>("read");
  const [preferred, setPreferred] = useState<string | null>(null);
  const [criterion, setCriterion] = useState<string | null>(null);
  const [testId, setTestId] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [predConfidence, setPredConfidence] = useState<number | null>(null);
  const [revised, setRevised] = useState<boolean | null>(null);
  const [reasoning, setReasoning] = useState("");
  const startedAt = useRef(Date.now());
  const sent = useRef(false);

  const chosenTest = c.candidates.find((t) => t.id === testId) ?? null;
  const resolutionTest = c.candidates.find((t) => t.id === c.resolution.testId)!;
  const modelOf = (id: string | null) => c.models.find((m) => m.id === id) ?? null;

  const reset = (nextIdx = caseIdx) => {
    setCaseIdx(nextIdx);
    setPhase("read");
    setPreferred(null);
    setCriterion(null);
    setTestId(null);
    setPrediction(null);
    setPredConfidence(null);
    setRevised(null);
    setReasoning("");
    sent.current = false;
    startedAt.current = Date.now();
  };

  useEffect(() => {
    if (phase !== "outcome" || revised === null || sent.current) return;
    sent.current = true;
    void recordTrace(
      "discriminate",
      {
        caseId: c.id,
        preferred,
        preferenceCriterion: criterion,
        prediction,
        predictionConfidence: predConfidence,
        proposedTestId: testId,
        proposedTestIsDiscriminating: chosenTest ? chosenTest.discriminates : null,
        afterOutcome: c.resolution.favours,
        revised,
        reasoning: reasoning.trim() || null,
      },
      Date.now() - startedAt.current,
    );
  }, [phase, revised, c, preferred, criterion, prediction, predConfidence, testId, chosenTest, reasoning]);

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      };

  const steps: { key: Phase; label: string }[] = [
    { key: "read", label: "Two models" },
    { key: "prefer", label: "Prefer" },
    { key: "design", label: "Design a test" },
    { key: "predict", label: "Predict" },
    { key: "outcome", label: "Outcome" },
  ];
  const stepIdx = steps.findIndex((s) => s.key === phase);

  return (
    <div>
      {/* Progress, and a case switcher that is always available. */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {steps.map((s, i) => (
            <li key={s.key} className="flex items-center gap-3">
              <span
                className="font-mono text-[0.58rem] uppercase tracking-[0.14em]"
                style={{ color: i <= stepIdx ? "rgb(var(--accent))" : "rgb(var(--faint))" }}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="h-px w-5" style={{ background: "rgb(var(--line) / 0.25)" }} />
              )}
            </li>
          ))}
        </ol>
        <div className="flex gap-2">
          {cases.map((cc, i) => (
            <button
              key={cc.id}
              type="button"
              aria-pressed={i === caseIdx}
              onClick={() => reset(i)}
              className="border px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] transition-colors"
              style={
                i === caseIdx
                  ? { borderColor: "rgb(var(--fg))", background: "rgb(var(--fg))", color: "rgb(var(--bg))" }
                  : { borderColor: "rgb(var(--line) / 0.25)", color: "rgb(var(--faint))" }
              }
            >
              {cc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence stays visible for the whole exercise. It is what both models fit. */}
      <div className="hair pb-8 pt-8">
        <p className="say max-w-measure">{c.situation}</p>
        <ul className="mt-6 max-w-measure space-y-2">
          {c.evidence.map((e, i) => (
            <li key={i} className="flex gap-3 text-[0.92rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
              <span aria-hidden="true" className="mt-[11px] h-px w-3 flex-none" style={{ background: "rgb(var(--accent))" }} />
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Both models, side by side, all the way through. */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {c.models.map((m) => {
          const isPreferred = preferred === m.id;
          const favoured = phase === "outcome" && c.resolution.favours === m.id;
          const disfavoured = phase === "outcome" && c.resolution.favours !== null && !favoured;
          return (
            <motion.div
              key={m.id}
              animate={{ opacity: disfavoured ? 0.5 : 1 }}
              className="panel p-6"
              style={{
                borderColor: favoured
                  ? "rgb(var(--accent))"
                  : isPreferred
                    ? "rgb(var(--fg) / 0.4)"
                    : "rgb(var(--line) / var(--line-a))",
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-d5">{m.name}</h3>
                {isPreferred && (
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--faint))" }}>
                    yours
                  </span>
                )}
              </div>
              <p className="mt-3 text-[0.94rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                {m.claim}
              </p>
              {phase !== "read" && (
                <p className="mt-4 border-t pt-3 text-[0.84rem] leading-relaxed" style={{ borderColor: "rgb(var(--line) / 0.15)", color: "rgb(var(--faint))" }}>
                  {m.expects}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Read ───────────────────────────────────────────────────────── */}
        {phase === "read" && (
          <motion.div key="read" {...fade} className="mt-10">
            <p className="max-w-measure font-display text-d4">
              Both of these account for every line of evidence above.
            </p>
            <p className="mt-4 max-w-measure text-[0.92rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
              Neither is wrong yet. Nothing you have been given separates them.
            </p>
            <button type="button" className="btn mt-8" onClick={() => setPhase("prefer")}>
              I&rsquo;ve read both
            </button>
          </motion.div>
        )}

        {/* ── Prefer ─────────────────────────────────────────────────────── */}
        {phase === "prefer" && (
          <motion.div key="prefer" {...fade} className="mt-12 max-w-measure">
            <p className="font-display text-d4">Which do you lean toward?</p>
            <ul className="mt-4">
              {c.models.map((m) => (
                <li key={m.id}>
                  <button type="button" className="pick font-text text-[1.04rem]" aria-pressed={preferred === m.id} onClick={() => setPreferred(m.id)}>
                    {m.name}
                  </button>
                </li>
              ))}
            </ul>

            {preferred && (
              <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
                <p className="font-display text-d5">On what grounds?</p>
                <ul className="mt-3">
                  {criteria.map((cr) => (
                    <li key={cr.id}>
                      <button type="button" className="pick py-2 text-[0.94rem]" aria-pressed={criterion === cr.id} onClick={() => setCriterion(cr.id)}>
                        {cr.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <button type="button" className="btn mt-8" disabled={!criterion} onClick={() => setPhase("design")}>
                  Next
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Design ─────────────────────────────────────────────────────── */}
        {phase === "design" && (
          <motion.div key="design" {...fade} className="mt-12">
            <p className="max-w-column font-display text-d4">
              What single observation would tell the two apart?
            </p>
            <p className="mt-4 max-w-measure text-[0.92rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
              Not the one that would tell you most about the situation. The one whose result
              would come out differently depending on which model is right.
            </p>

            <ul className="mt-7 max-w-column">
              {c.candidates.map((t) => (
                <li key={t.id}>
                  <button type="button" className="pick text-[0.98rem] leading-relaxed" aria-pressed={testId === t.id} onClick={() => setTestId(t.id)}>
                    {t.text}
                  </button>
                </li>
              ))}
            </ul>

            <button type="button" className="btn mt-8" disabled={!testId} onClick={() => setPhase("predict")}>
              That one
            </button>
          </motion.div>
        )}

        {/* ── Predict ────────────────────────────────────────────────────── */}
        {phase === "predict" && (
          <motion.div key="predict" {...fade} className="mt-12 max-w-column">
            {chosenTest && (
              <div className="mb-10 border-l-2 pl-5" style={{ borderColor: chosenTest.discriminates ? "rgb(var(--accent))" : "rgb(var(--line) / 0.3)" }}>
                <p className="kicker mb-2" style={{ color: chosenTest.discriminates ? "rgb(var(--accent))" : "rgb(var(--faint))" }}>
                  {chosenTest.discriminates ? "That one discriminates" : "That one does not discriminate"}
                </p>
                <p className="max-w-measure text-[0.94rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                  {chosenTest.note}
                </p>
              </div>
            )}

            <p className="font-display text-d4">
              Someone runs this one instead:
            </p>
            <p className="mt-3 max-w-measure font-text text-[1.06rem] leading-[1.5]">{resolutionTest.text}</p>

            <p className="mt-9 font-display text-d5">What will it show?</p>
            <ul className="mt-3 max-w-measure">
              {c.models.map((m) => (
                <li key={m.id}>
                  <button type="button" className="pick text-[0.96rem]" aria-pressed={prediction === m.id} onClick={() => setPrediction(m.id)}>
                    What you&rsquo;d expect if <strong>{m.name.toLowerCase()}</strong>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className="pick text-[0.96rem]" aria-pressed={prediction === "neither"} onClick={() => setPrediction("neither")}>
                  Something consistent with both
                </button>
              </li>
            </ul>

            {prediction && (
              <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="mt-9 max-w-measure">
                <label htmlFor="pred-conf" className="block font-display text-d5">
                  How confident?
                </label>
                <div className="mt-4 flex items-center gap-4">
                  <input
                    id="pred-conf"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={predConfidence ?? 50}
                    onChange={(e) => setPredConfidence(Number(e.target.value))}
                    style={{ color: "rgb(var(--accent))" }}
                  />
                  <span className="w-14 shrink-0 text-right font-mono text-[0.9rem] tabular" style={{ color: "rgb(var(--accent))" }}>
                    {predConfidence === null ? "—" : `${predConfidence}%`}
                  </span>
                </div>
                <button type="button" className="btn mt-8" onClick={() => setPhase("outcome")}>
                  Run it
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Outcome ────────────────────────────────────────────────────── */}
        {phase === "outcome" && (
          <motion.div key="outcome" {...fade} className="mt-12 max-w-column">
            <p className="kicker" style={{ color: "rgb(var(--accent))" }}>
              What happened
            </p>
            <p className="mt-3 max-w-measure font-display text-d4 leading-[1.3]">{c.resolution.outcome}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Tag kind="illustration" />
              <span className="max-w-measure text-[0.8rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                Stipulated by the case, not observed anywhere. It exists so a prediction can fail.
              </span>
            </div>

            <p className="say mt-9 max-w-measure">{c.resolution.reading}</p>

            {prediction && (
              <p className="mt-7 max-w-measure text-[0.94rem] leading-relaxed" style={{ color: "rgb(var(--fg))" }}>
                {prediction === c.resolution.favours
                  ? `Your prediction held${predConfidence !== null ? `, at ${predConfidence}% confidence` : ""}.`
                  : prediction === "neither"
                    ? "You predicted the observation would not separate them. It did."
                    : `Your prediction did not hold${predConfidence !== null ? `, and you were ${predConfidence}% confident` : ""}.`}
              </p>
            )}

            <div className="mt-10">
              <p className="font-display text-d5">Do you change your model?</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" className="btn" aria-pressed={revised === true} onClick={() => setRevised(true)} style={revised === true ? { background: "rgb(var(--fg))", color: "rgb(var(--bg))" } : undefined}>
                  Yes
                </button>
                <button type="button" className="btn" aria-pressed={revised === false} onClick={() => setRevised(false)} style={revised === false ? { background: "rgb(var(--fg))", color: "rgb(var(--bg))" } : undefined}>
                  No
                </button>
              </div>
            </div>

            {revised !== null && (
              <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 max-w-measure">
                <Reasoning
                  id="discriminate-reasoning"
                  value={reasoning}
                  onChange={setReasoning}
                  label="Why?"
                  placeholder={
                    revised
                      ? "What did the outcome do that the earlier evidence didn't?"
                      : "What would the outcome have had to be?"
                  }
                />

                <div className="mt-8">
                  <Recorded what="Which model you preferred and on what grounds, which test you proposed and whether it discriminates, your prediction and confidence, whether you revised, and this reasoning." />
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  {caseIdx < cases.length - 1 ? (
                    <button type="button" className="btn btn-solid" onClick={() => reset(caseIdx + 1)}>
                      The other case →
                    </button>
                  ) : (
                    <button type="button" className="btn-quiet" onClick={() => reset(0)}>
                      ↺ Start again
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
