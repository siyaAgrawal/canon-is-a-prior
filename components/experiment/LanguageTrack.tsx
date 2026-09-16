"use client";

import { useState } from "react";
import type { Scenario } from "@/types";
import { BeliefExperiment } from "./BeliefExperiment";
import { AggregateResults } from "@/components/viz/AggregateResults";
import { ModelComparison } from "@/components/viz/ModelComparison";
import { StorageNotice } from "./StorageNotice";

/**
 * The language track runner: pick a scenario, do it, then see the group and the model
 * on the same scenario. The comparison is only offered after the participant has
 * committed to their own distribution — seeing either first would contaminate it.
 */
export function LanguageTrack({ scenarios }: { scenarios: Scenario[] }) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const scenario = scenarios[index];

  const pickRandom = () => {
    let next = index;
    while (scenarios.length > 1 && next === index) next = Math.floor(Math.random() * scenarios.length);
    setIndex(next);
    setDone(false);
  };

  return (
    <div>
      <StorageNotice />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
        <div className="flex items-baseline gap-3">
          <span className="eyebrow">Scenario</span>
          <span className="font-mono text-[0.72rem] tabular text-ink-faint">
            {index + 1} of {scenarios.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-4">
          <button type="button" className="btn-quiet" onClick={pickRandom}>
            Give me a random one
          </button>
          <label className="flex items-center gap-2">
            <span className="sr-only">Choose scenario</span>
            <select
              value={index}
              onChange={(e) => {
                setIndex(Number(e.target.value));
                setDone(false);
              }}
              className="max-w-[16rem] border border-rule bg-transparent px-2 py-1.5 font-mono text-[0.7rem] text-ink"
            >
              {scenarios.map((s, i) => (
                <option key={s.id} value={i}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <article className="card p-6 sm:p-9">
        <header className="mb-8 border-b border-rule-soft pb-7">
          <h2 className="font-display text-2xl leading-tight">{scenario.title}</h2>
          <p className="prose-note mt-4">{scenario.context}</p>
          <p className="mt-5 border-l-2 border-ink/25 pl-4 font-display text-[1.14rem] leading-[1.5]">
            {scenario.stimulus}
          </p>
          <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-ghost">
            Written for this experiment · no real message was used
          </p>
        </header>

        <BeliefExperiment key={scenario.id} scenario={scenario} onSubmitted={() => setDone(true)} />
      </article>

      {done && (
        <div className="mt-14 space-y-14">
          <section>
            <h3 className="mb-6 font-display text-2xl">What other people did</h3>
            <AggregateResults key={`agg-${scenario.id}`} scenario={scenario} />
          </section>
          <section>
            <h3 className="mb-2 font-display text-2xl">What a model did</h3>
            <p className="mb-6 max-w-reading text-[0.88rem] leading-relaxed text-ink-faint">
              Same context, same stimulus, same readings, same evidence in the same order, and the
              same requirement that the numbers total one hundred. The model never sees the design
              notes, and each stage is a separate request carrying the evidence so far.
            </p>
            <ModelComparison key={`ai-${scenario.id}`} scenario={scenario} />
          </section>
        </div>
      )}
    </div>
  );
}
