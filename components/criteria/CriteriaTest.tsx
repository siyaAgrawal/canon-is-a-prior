"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cases, PROPERTY_LABEL, type Property } from "@/data/criteria";
import { recordTrace } from "@/lib/record";
import { Recorded } from "@/components/ui/Recorded";

/**
 * Which criterion are you actually using?
 *
 * Two cases, three explanations each, none best on everything. The reader picks
 * what they would act on. Afterwards the profiles are shown and the instrument
 * reports whether the same property was maximised both times.
 *
 * Consistency is not the virtue here and the page says so. Someone who switches
 * criteria between a colleague and a deployment may be reading the two
 * situations correctly. The point is to be able to name what you did.
 */

const DOTS: Record<"high" | "mid" | "low", string> = { high: "●●●", mid: "●●○", low: "●○○" };

export function CriteriaTest() {
  const reduce = useReducedMotion();
  const [round, setRound] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);
  const startedAt = useRef(Date.now());
  const sent = useRef(false);

  const c = cases[round];
  const picked = picks[c.id];
  const bothDone = Object.keys(picks).length === cases.length;

  const topProperty = (explanationId: string, caseId: string): Property => {
    const ex = cases.find((x) => x.id === caseId)!.explanations.find((e) => e.id === explanationId)!;
    const order: Property[] = ["support", "falsifiable", "useful", "beauty"];
    const highs = order.filter((p) => ex.profile[p] === "high");
    return highs[0] ?? order.find((p) => ex.profile[p] === "mid") ?? "beauty";
  };

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  if (revealed) {
    const props = cases.map((cc) => topProperty(picks[cc.id], cc.id));
    const consistent = props[0] === props[1];

    if (!sent.current) {
      sent.current = true;
      void recordTrace(
        "criteria",
        { picks, properties: props, consistent },
        Date.now() - startedAt.current,
      );
    }

    return (
      <div>
        <div className="max-w-column">
          <p className="statement">
            {consistent
              ? `Both times you took the explanation that was strongest on: ${PROPERTY_LABEL[props[0]].toLowerCase()}.`
              : "You used a different criterion each time."}
          </p>
          <div className="say mt-7 max-w-measure">
            {consistent ? (
              <p>
                Which is worth knowing, because it is a standing disposition rather than a response
                to either case. It will apply next time too, including when it shouldn&rsquo;t.
              </p>
            ) : (
              <p>
                First <em>{PROPERTY_LABEL[props[0]].toLowerCase()}</em>, then{" "}
                <em>{PROPERTY_LABEL[props[1]].toLowerCase()}</em>. That is not a failure — a person
                and a deployed system may genuinely warrant different standards. But the switch was
                almost certainly not deliberate, and the interesting question is what triggered it.
              </p>
            )}
            <p className="text-fg">
              The properties below are not scores. I wrote the explanations to have those profiles.
              What the instrument caught is which column you reached for.
            </p>
          </div>
        </div>

        <div className="mt-16 space-y-16">
          {cases.map((cc) => (
            <section key={cc.id}>
              <h3 className="font-display text-d5">{cc.situation}</h3>
              <ul className="mt-6">
                {cc.explanations.map((e) => {
                  const chosen = picks[cc.id] === e.id;
                  return (
                    <li key={e.id} className={`hair py-6 ${chosen ? "" : "opacity-70"}`}>
                      <div className="grid gap-x-8 gap-y-4 lg:grid-cols-[minmax(0,1fr)_13rem]">
                        <div>
                          <p className={`text-[0.96rem] leading-relaxed ${chosen ? "text-fg" : "text-muted"}`}>
                            {e.text}
                          </p>
                          {chosen && (
                            <span className="mt-3 inline-block font-mono text-[0.6rem] uppercase tracking-[0.14em] text-accent">
                              you chose this
                            </span>
                          )}
                          <p className="mt-3 max-w-measure text-[0.86rem] leading-relaxed text-faint">
                            {e.note}
                          </p>
                        </div>
                        <dl className="space-y-1.5">
                          {(Object.keys(PROPERTY_LABEL) as Property[]).map((p) => (
                            <div key={p} className="flex items-baseline justify-between gap-3">
                              <dt className="text-[0.76rem] text-faint">{PROPERTY_LABEL[p]}</dt>
                              <dd
                                className={`font-mono text-[0.7rem] tracking-[0.1em] ${
                                  e.profile[p] === "high"
                                    ? "text-evidence"
                                    : e.profile[p] === "mid"
                                      ? "text-sun"
                                      : "text-faint"
                                }`}
                              >
                                {DOTS[e.profile[p]]}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="hair mt-10 pt-8">
          <p className="max-w-measure text-[0.8rem] leading-relaxed text-faint">
            There is no correct choice here — only explanations strong in different places, and a
            question about which strength you treat as decisive when you cannot have all of them.
          </p>
          <div className="mt-4">
            <Recorded what="Which explanation you picked in each case, and whether the same property decided both." />
          </div>
          <button
            type="button"
            className="btn-quiet mt-5"
            onClick={() => {
              setPicks({});
              setRound(0);
              setRevealed(false);
              sent.current = false;
              startedAt.current = Date.now();
            }}
          >
            ↺ Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {cases.map((cc, n) => (
            <span
              key={cc.id}
              className={`h-[3px] flex-1 ${picks[cc.id] ? "bg-accent/60" : n === round ? "bg-accent" : "bg-fg/10"}`}
            />
          ))}
        </div>
        <span className="font-mono text-[0.62rem] tabular text-faint">
          {round + 1}/{cases.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={c.id} {...fade}>
          <p className="max-w-column font-display text-d4 leading-[1.3]">{c.situation}</p>

          <ul className="mt-8 max-w-measure space-y-1.5">
            {c.evidence.map((e, i) => (
              <li key={i} className="flex gap-3 text-[0.9rem] leading-relaxed text-muted">
                <span aria-hidden="true" className="mt-[10px] h-px w-3 shrink-0 bg-accent/60" />
                <span>{e}</span>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-[0.9rem] text-faint">
            Three explanations. Which would you act on?
          </p>
          <ul className="mt-3 max-w-column">
            {c.explanations.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  className="pick"
                  aria-pressed={picked === e.id}
                  onClick={() => setPicks((p) => ({ ...p, [c.id]: e.id }))}
                >
                  <span className="block text-[0.95rem] leading-relaxed">{e.text}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            {round < cases.length - 1 ? (
              <button type="button" className="btn" disabled={!picked} onClick={() => setRound(round + 1)}>
                Next case
              </button>
            ) : (
              <button
                type="button"
                className="btn border-fg bg-fg text-bg hover:bg-transparent hover:text-ink disabled:border-fg/25 disabled:bg-transparent disabled:text-fg"
                disabled={!bothDone}
                onClick={() => setRevealed(true)}
              >
                Show me what I used
              </button>
            )}
            {round > 0 && (
              <button type="button" className="btn-quiet" onClick={() => setRound(round - 1)}>
                ← Back
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
