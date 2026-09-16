"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import type { BeliefStep, Distribution, Scenario } from "@/types";
import { evenDistribution } from "@/lib/simplex";
import { entropy, normalizedEntropy, totalVariation } from "@/lib/stats";
import { getSessionId } from "@/lib/session";
import { colorAt } from "@/lib/palette";
import { SimplexSliders } from "./SimplexSliders";
import { BeliefTrajectory } from "@/components/viz/BeliefTrajectory";
import { DistributionBars } from "@/components/viz/DistributionBars";
import { Aside, Boundary } from "@/components/ui/primitives";

type Phase = "prior" | "evidence" | "review";

/**
 * The core experiment.
 *
 * Structure: prior → evidence → update → evidence → update → review. The previous
 * distribution stays on screen during every update, because the measurement of
 * interest is revision, not recall.
 *
 * Nothing on the review screen tells the participant what the right answer was.
 * There isn't one, and saying so is the honest end of the exercise.
 */
export function BeliefExperiment({
  scenario,
  onSubmitted,
  autoSubmit = true,
}: {
  scenario: Scenario;
  onSubmitted?: (steps: BeliefStep[]) => void;
  autoSubmit?: boolean;
}) {
  const ids = useMemo(() => scenario.interpretations.map((i) => i.id), [scenario]);
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("prior");
  const [distributions, setDistributions] = useState<Distribution[]>([evenDistribution(ids)]);
  const [confidences, setConfidences] = useState<(number | null)[]>([null]);
  const [touched, setTouched] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** True when the deployment cannot store anything, so a retry would be theatre. */
  const [retryPointless, setRetryPointless] = useState(false);
  const startedAt = useRef(Date.now());
  /**
   * Synchronous guard against duplicate submissions. React state updates are async, so
   * a double-click on "See how you moved" fired submit() twice before submitState had
   * changed, and put the same trajectory into the dataset twice. A ref settles it in
   * the same tick. Only an explicit retry after a failure clears it.
   */
  const submitting = useRef(false);

  /**
   * The stage is derived from the number of distributions rather than tracked
   * separately. Two pieces of state that must agree will eventually disagree — an
   * early version kept an index alongside the array, and fast repeated clicks read a
   * stale index and appended past the last evidence item.
   */
  const stageIndex = distributions.length - 1;
  const current = distributions[stageIndex];
  const previous = stageIndex > 0 ? distributions[stageIndex - 1] : null;
  const evidenceShown = stageIndex > 0 ? scenario.evidence[stageIndex - 1] : null;
  const isLastEvidence = stageIndex >= scenario.evidence.length;

  const setCurrent = (next: Distribution) => {
    setTouched(true);
    setDistributions((prev) => {
      const copy = [...prev];
      copy[stageIndex] = next;
      return copy;
    });
  };

  const setConfidence = (v: number) => {
    setConfidences((prev) => {
      const copy = [...prev];
      copy[stageIndex] = v;
      return copy;
    });
  };

  const advance = () => {
    if (phase === "review") return;
    if (isLastEvidence) {
      setPhase("review");
      if (autoSubmit) void submit();
      return;
    }
    // Functional updates with a hard cap, so repeated or racing clicks cannot produce
    // more stages than the scenario has evidence items.
    setDistributions((prev) =>
      prev.length - 1 >= scenario.evidence.length ? prev : [...prev, { ...prev[prev.length - 1] }],
    );
    setConfidences((prev) =>
      prev.length - 1 >= scenario.evidence.length ? prev : [...prev, prev[prev.length - 1]],
    );
    setTouched(false);
    setPhase("evidence");
  };

  const steps: BeliefStep[] = useMemo(
    () =>
      distributions.map((d, i) => ({
        evidenceId: i === 0 ? null : scenario.evidence[i - 1]?.id ?? null,
        distribution: d,
        confidence: confidences[i] ?? null,
      })),
    [distributions, confidences, scenario.evidence],
  );

  async function submit() {
    if (submitting.current) return;
    submitting.current = true;
    setSubmitState("sending");
    setSubmitError(null);
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          scenarioId: scenario.id,
          track: scenario.track,
          steps,
          durationMs: Date.now() - startedAt.current,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 503) setRetryPointless(true);
        throw new Error(body?.error ?? `Request failed (${res.status})`);
      }
      setSubmitState("done");
      onSubmitted?.(steps);
    } catch (err) {
      // A failed request left nothing stored, so retrying is safe and is re-enabled.
      submitting.current = false;
      setSubmitState("error");
      setSubmitError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  const stageLabels = ["prior", ...scenario.evidence.map((_, i) => `evidence ${i + 1}`)];

  const movements = distributions
    .slice(1)
    .map((d, i) => ({ evidence: scenario.evidence[i], magnitude: totalVariation(distributions[i], d) }))
    .filter((m): m is { evidence: (typeof scenario.evidence)[number]; magnitude: number } =>
      Boolean(m.evidence),
    );
  const biggest = movements.length
    ? movements.reduce((a, b) => (b.magnitude > a.magnitude ? b : a))
    : null;
  const overall = distributions.length > 1 ? totalVariation(distributions[0], distributions[distributions.length - 1]) : 0;

  if (phase === "review") {
    const first = distributions[0];
    const last = distributions[distributions.length - 1];
    const h0 = normalizedEntropy(first);
    const h1 = normalizedEntropy(last);

    return (
      <div className="space-y-10">
        <div>
          <p className="kicker">Result</p>
          <h3 className="mt-2 text-d4">
            {overall < 0.06 ? "Your interpretation held." : "Your interpretation changed."}
          </h3>
          <p className="say mt-4 max-w-reading">
            {overall < 0.06
              ? "Across all the evidence, your distribution moved very little. That is a legitimate outcome — evidence that does not discriminate should not move you — and it is also the outcome that is hardest to tell apart from not engaging. Both look the same in the data."
              : `Between your first distribution and your last, belief moved ${Math.round(overall * 100)}% of the maximum possible distance. That number is a total variation distance: 0% would mean you did not move at all, 100% would mean you ended up with no weight on anything you started with.`}
          </p>
        </div>

        <div className="panel p-5 sm:p-7">
          <BeliefTrajectory
            interpretations={scenario.interpretations}
            stages={distributions}
            stageLabels={stageLabels}
          />
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <DistributionBars
            interpretations={scenario.interpretations}
            distribution={last}
            compareTo={first}
            compareLabel="at the start"
            label="Where you started, and where you ended"
          />
          <div>
            <p className="kicker mb-3">What moved you</p>
            <ul className="space-y-3">
              {movements.map((m, i) => (
                <li key={m.evidence.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[0.86rem] text-muted">Evidence {i + 1}</span>
                    <span className="font-mono text-[0.78rem] tabular text-faint">
                      {Math.round(m.magnitude * 100)}%
                    </span>
                  </div>
                  <div className="mt-1 h-[7px] w-full bg-fg/[0.06]">
                    <span
                      className="block h-full bg-accent"
                      style={{ width: `${Math.min(100, m.magnitude * 100)}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </li>
              ))}
            </ul>
            {biggest && biggest.magnitude > 0.02 && (
              <div className="mt-4"><Aside>
                The largest single shift came from evidence{" "}
                {movements.findIndex((m) => m.evidence.id === biggest.evidence.id) + 1}.
              </Aside></div>
            )}
            {h0 !== null && h1 !== null && (
              <div className="mt-5"><Boundary title="How committed you became">
                <p>
                  Your spread went from {Math.round(h0 * 100)}% to {Math.round(h1 * 100)}% of maximum. A
                  high number means you kept several readings alive; a low one means you concentrated on
                  fewer. {h1 < h0 ? "You narrowed." : h1 > h0 ? "You widened — the evidence made you less sure, not more." : "It did not change."}{" "}
                  Neither direction is the correct one. Whether narrowing was warranted depends on how much
                  the evidence actually discriminated, which is exactly what is unsettled here.
                </p>
              </Boundary></div>
            )}
          </div>
        </div>

        <div>
          <p className="kicker mb-4">Why each piece of evidence was written</p>
          <p className="say mb-5 max-w-reading">
            These notes were hidden until now on purpose. Telling you what an item was designed to do
            would have measured whether you follow instructions rather than how you read.
          </p>
          <ol className="space-y-4">
            {scenario.evidence.map((e, i) => (
              <li key={e.id} className="border-l-2 border-line/20 pl-5">
                <p className="text-[0.9rem] leading-relaxed text-fg">
                  <span className="font-mono text-[0.68rem] tracking-widest text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  {e.text}
                </p>
                <p className="mt-2 text-[0.84rem] leading-relaxed text-faint">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent">Design note — </span>
                  {e.designNote}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-line/12 pt-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {submitState === "done" && (
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-evidence">
                Response recorded anonymously
              </p>
            )}
            {submitState === "sending" && (
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint">Saving…</p>
            )}
            {submitState === "error" && (
              <div className="w-full">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-accent">
                  Not saved
                </p>
                <p className="mt-2 max-w-reading text-[0.88rem] leading-relaxed text-muted">{submitError}</p>
                {!retryPointless && (
                  <button type="button" className="btn mt-3" onClick={() => void submit()}>
                    Try again
                  </button>
                )}
              </div>
            )}
            {submitState === "idle" && !autoSubmit && (
              <button type="button" className="btn" onClick={() => void submit()}>
                Contribute this response
              </button>
            )}
            <Link href="/shape" className="btn">
              Was any of that real? →
            </Link>
          </div>
          <p className="mt-4 max-w-reading text-[0.8rem] leading-relaxed text-faint">
            What was stored: a random session identifier, this scenario&rsquo;s id, your four
            distributions and the elapsed time. No name, no account, no IP address, no tracking cookie.{" "}
            <Link href="/ethics" className="underline decoration-dotted underline-offset-2">
              Full statement
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2" aria-hidden="true">
        {stageLabels.map((l, i) => (
          <span
            key={l}
            className={`h-[3px] flex-1 transition-colors duration-500 ${
              i < stageIndex ? "bg-accent/60" : i === stageIndex ? "bg-accent" : "bg-fg/10"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {evidenceShown && (
          <motion.div
            key={evidenceShown.id}
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="border-l-2 border-accent bg-accent/[0.04] px-5 py-4 sm:px-6 sm:py-5"
            role="status"
          >
            <p className="kicker text-accent">New evidence — {stageIndex} of {scenario.evidence.length}</p>
            <p className="mt-2 font-display text-[1.12rem] leading-[1.5]">{evidenceShown.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <p className="font-display text-[1.15rem] leading-snug">{scenario.question}</p>
        <p className="mt-1 text-[0.84rem] text-faint">
          {stageIndex === 0
            ? "Spread one hundred points across the readings. Raising one necessarily lowers the others — that constraint is the point."
            : "Adjust if this changes anything. Leaving it unchanged is a real answer."}
        </p>
      </div>

      <SimplexSliders
        interpretations={scenario.interpretations}
        value={current}
        onChange={setCurrent}
        previous={previous}
      />

      <div className="border-t border-line/12 pt-5">
        <label className="flex flex-wrap items-center gap-3 text-[0.84rem] text-faint">
          <span>How confident are you in this distribution?</span>
          <span className="flex min-w-[180px] flex-1 items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={confidences[stageIndex] ?? 50}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="text-faint"
              aria-label="Confidence in this distribution, 0 to 100"
            />
            <span className="w-12 shrink-0 font-mono text-[0.8rem] tabular">
              {confidences[stageIndex] === null ? "—" : `${confidences[stageIndex]}%`}
            </span>
          </span>
        </label>
        <p className="mt-1.5 text-[0.76rem] text-faint">Optional. Confidence in the spread itself, not in any one reading.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" className="btn" onClick={advance}>
          {isLastEvidence ? "See how you moved" : stageIndex === 0 ? "Submit this prior" : "Update"}
        </button>
        {stageIndex === 0 && !touched && (
          <span className="text-[0.8rem] text-faint">
            It starts flat. Leaving it flat means every reading is equally plausible to you.
          </span>
        )}
      </div>
    </div>
  );
}
