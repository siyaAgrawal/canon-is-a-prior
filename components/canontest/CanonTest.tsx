"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { steps, statuses, looksGradable, type StatusId } from "@/data/canon-test";
import { REASONING_MAX } from "@/lib/trace-schema";
import { recordTrace } from "@/lib/record";
import { Recorded } from "@/components/ui/Recorded";

/**
 * The protocol, as an instrument rather than a listicle.
 *
 * One step per screen so each distinction has to be made before the next is
 * visible. The observation/interpretation split in step 1 is enforced by the
 * ordering: you cannot see the "what does it mean" field until you have written
 * the "what happened" one.
 *
 * Step 5 is the only step with a check attached, and the check prompts rather
 * than grades — it asks whether what you wrote contrasts two conditions, because
 * "look at more of them" is the commonest non-answer and it feels like an answer.
 */
export function CanonTest({ seed }: { seed?: { claimId: string; pattern: string } }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [values, setValues] = useState<Record<string, string>>(
    seed ? { pattern: seed.pattern } : {},
  );
  const [status, setStatus] = useState<StatusId | null>(null);
  const [done, setDone] = useState(false);
  const [nudged, setNudged] = useState(false);
  const startedAt = useRef(Date.now());
  const sent = useRef(false);

  const step = steps[i];
  const value = values[step?.id] ?? "";
  const atEnd = i >= steps.length;

  const set = (v: string) => setValues((prev) => ({ ...prev, [step.id]: v }));

  const next = () => {
    if (step.id === "discriminator" && !nudged && !looksGradable(value)) {
      setNudged(true);
      return;
    }
    setNudged(false);
    setI((n) => n + 1);
  };

  useEffect(() => {
    if (!done || sent.current || !status) return;
    sent.current = true;
    void recordTrace(
      "canontest",
      {
        claimId: seed?.claimId ?? null,
        observation: values.observation ?? null,
        prior: values.prior ?? null,
        pattern: values.pattern ?? null,
        alternatives: (values.alternatives ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 6),
        discriminator: values.discriminator ?? null,
        discriminatorIsGradable: looksGradable(values.discriminator ?? ""),
        counterexample: values.counterexample ?? null,
        prediction: values.prediction ?? null,
        status,
        reasoning: null,
      },
      Date.now() - startedAt.current,
    );
  }, [done, status, values, seed]);

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      };

  // ── The trajectory, after ────────────────────────────────────────────────
  if (done && status) {
    const chosen = statuses.find((s) => s.id === status)!;
    const gradable = looksGradable(values.discriminator ?? "");
    return (
      <div>
        <p className="kicker" style={{ color: "rgb(var(--accent))" }}>
          Your reasoning, laid out
        </p>
        <p className="mt-4 max-w-column font-display text-d3">{chosen.label}</p>
        <p className="mt-3 max-w-measure text-[0.94rem]" style={{ color: "rgb(var(--muted))" }}>
          {chosen.note}
        </p>

        <ol className="mt-14">
          {steps.map((s) => {
            const v = values[s.id]?.trim();
            return (
              <li key={s.id} className="hair grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[8.5rem_1fr]">
                <div>
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--faint))" }}>
                    {s.n} · {s.id}
                  </p>
                  {s.id === "discriminator" && v && (
                    <p
                      className="mt-2 font-mono text-[0.56rem] uppercase tracking-[0.13em]"
                      style={{ color: gradable ? "#6AAD89" : "#E0A244" }}
                    >
                      {gradable ? "contrastive" : "not contrastive"}
                    </p>
                  )}
                </div>
                <div>
                  {v ? (
                    <p className="font-text text-[1.02rem] leading-[1.55]">{v}</p>
                  ) : (
                    <p className="text-[0.88rem] italic" style={{ color: "rgb(var(--faint))" }}>
                      left blank
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 border-l-2 pl-5" style={{ borderColor: gradable ? "#6AAD89" : "#E0A244" }}>
          <p className="kicker mb-2" style={{ color: gradable ? "#6AAD89" : "#E0A244" }}>
            On step five
          </p>
          <p className="max-w-measure text-[0.92rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
            {gradable
              ? "What you wrote contrasts conditions, which is the shape a discriminating observation has. Whether it actually separates your particular rivals is not something this page can check — only you know what they predict."
              : "What you wrote does not obviously contrast two conditions. That often means it would confirm whichever model is right without telling you which — the most common way a plan to 'look into it further' produces no information. Worth another look."}
          </p>
        </div>

        <div className="mt-12">
          <Recorded what="Everything you wrote above, the status you chose, and whether step five was contrastive." />
        </div>

        <button
          type="button"
          className="btn-quiet mt-8"
          onClick={() => {
            setI(0);
            setValues(seed ? { pattern: seed.pattern } : {});
            setStatus(null);
            setDone(false);
            sent.current = false;
            startedAt.current = Date.now();
          }}
        >
          ↺ Run it on something else
        </button>
      </div>
    );
  }

  // ── Status ──────────────────────────────────────────────────────────────
  if (atEnd) {
    return (
      <motion.div {...fade}>
        <p className="kicker">08 · status</p>
        <p className="mt-4 max-w-column font-display text-d3">Where does it stand?</p>
        <p className="mt-4 max-w-measure text-[0.94rem]" style={{ color: "rgb(var(--muted))" }}>
          Not true or false. There is no option here that means you were right, because a protocol
          that can conclude that is not this protocol.
        </p>
        <ul className="mt-8 max-w-column">
          {statuses.map((s) => (
            <li key={s.id}>
              <button type="button" className="pick" aria-pressed={status === s.id} onClick={() => setStatus(s.id)}>
                <span className="block font-display text-[1.06rem]">{s.label}</span>
                <span className="mt-0.5 block text-[0.84rem] leading-snug" style={{ color: "rgb(var(--faint))" }}>
                  {s.note}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-wrap gap-4">
          <button type="button" className="btn btn-solid" disabled={!status} onClick={() => setDone(true)}>
            Finish
          </button>
          <button type="button" className="btn-quiet" onClick={() => setI(steps.length - 1)}>
            ← Back
          </button>
        </div>
      </motion.div>
    );
  }

  // ── A step ──────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="mb-10 flex items-center gap-4">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {steps.map((s, n) => (
            <span
              key={s.id}
              className="h-[3px] flex-1 transition-colors duration-300"
              style={{
                background:
                  n < i ? "rgb(var(--accent) / 0.6)" : n === i ? "rgb(var(--accent))" : "rgb(var(--line) / 0.18)",
              }}
            />
          ))}
        </div>
        <span className="font-mono text-[0.62rem] tabular" style={{ color: "rgb(var(--faint))" }}>
          {i + 1}/{steps.length + 1}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step.id} {...fade}>
          <p className="kicker">
            {step.n} · {step.id}
          </p>
          <h2 className="mt-4 max-w-column font-display text-d3">{step.question}</h2>
          <p className="mt-4 max-w-measure text-[0.96rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
            {step.why}
          </p>

          <label htmlFor={`ct-${step.id}`} className="sr-only">
            {step.question}
          </label>
          <textarea
            id={`ct-${step.id}`}
            value={value}
            onChange={(e) => set(e.target.value)}
            rows={step.id === "alternatives" ? 4 : 3}
            maxLength={REASONING_MAX}
            placeholder={step.placeholder}
            className="mt-8 w-full max-w-column resize-y px-4 py-3 font-text text-[1.02rem] leading-relaxed"
          />

          <div className="mt-2 flex max-w-column items-center justify-between">
            <span className="font-mono text-[0.56rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--accent))" }}>
              Stored verbatim
            </span>
            <span className="font-mono text-[0.62rem] tabular" style={{ color: "rgb(var(--faint))" }}>
              {value.length}/{REASONING_MAX}
            </span>
          </div>

          <AnimatePresence>
            {nudged && (
              <motion.div
                initial={reduce ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 overflow-hidden border-l-2 pl-5"
                style={{ borderColor: "#E0A244" }}
              >
                <p className="max-w-measure text-[0.92rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                  That reads like more of the same evidence rather than an observation the rivals
                  disagree about. Try again, or go on — it is recorded either way, and being wrong
                  here is more informative than being nudged into the right shape.
                </p>
                <button type="button" className="btn-quiet mt-3" onClick={() => setI((n) => n + 1)}>
                  Go on anyway →
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <details className="mt-8 max-w-column">
            <summary className="cursor-pointer font-mono text-[0.62rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--faint))" }}>
              An example of each
            </summary>
            <div className="mt-4 space-y-3">
              <p className="text-[0.9rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                <span className="font-mono text-[0.56rem] uppercase tracking-[0.14em]">Weak — </span>
                {step.example.bad}
              </p>
              <p className="text-[0.9rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                <span className="font-mono text-[0.56rem] uppercase tracking-[0.14em]" style={{ color: "#6AAD89" }}>
                  Better —{" "}
                </span>
                {step.example.good}
              </p>
            </div>
          </details>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button type="button" className="btn" disabled={!step.optional && value.trim().length < 3} onClick={next}>
              {i === steps.length - 1 ? "Give it a status" : "Next"}
            </button>
            {i > 0 && (
              <button type="button" className="btn-quiet" onClick={() => { setNudged(false); setI((n) => n - 1); }}>
                ← Back
              </button>
            )}
            {step.optional && value.trim().length < 3 && (
              <span className="text-[0.82rem]" style={{ color: "rgb(var(--faint))" }}>
                Optional — leaving it blank is an answer.
              </span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
