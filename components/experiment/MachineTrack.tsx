"use client";

import { useState } from "react";
import type { Scenario } from "@/types";
import { BeliefExperiment } from "./BeliefExperiment";
import { StorageNotice } from "./StorageNotice";
import { AggregateResults } from "@/components/viz/AggregateResults";
import { ModelComparison } from "@/components/viz/ModelComparison";

/**
 * The only experiment on the site that collects anything.
 *
 * Order matters and is enforced: you commit to your own distribution before you
 * are shown either the group or the model. Seeing either first would make the
 * measurement worthless, and it is the kind of worthless that would not be
 * visible in the data afterwards.
 */
export function MachineTrack({ scenarios }: { scenarios: Scenario[] }) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const scenario = scenarios[index];

  const shuffle = () => {
    let n = index;
    while (scenarios.length > 1 && n === index) n = Math.floor(Math.random() * scenarios.length);
    setIndex(n);
    setDone(false);
  };

  return (
    <div>
      <StorageNotice />

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-ghost tabular">
          {index + 1} of {scenarios.length}
        </span>
        <div className="flex flex-wrap items-center gap-5">
          <button type="button" className="btn-quiet" onClick={shuffle}>
            Give me another
          </button>
          <label>
            <span className="sr-only">Choose scenario</span>
            <select
              value={index}
              onChange={(e) => {
                setIndex(Number(e.target.value));
                setDone(false);
              }}
              className="max-w-[15rem] border border-rule bg-transparent px-2 py-1.5 font-mono text-[0.7rem]"
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

      <article>
        <header className="hair pb-8 pt-8">
          <p className="say max-w-measure">{scenario.context}</p>
          <p className="mt-6 max-w-column font-display text-display-s leading-[1.4]">
            {scenario.stimulus}
          </p>
          <p className="mt-5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-ghost">
            {scenario.source === "public-domain-myth"
              ? "Paraphrased from a public-domain text"
              : "Written for this experiment — no real message was used"}
          </p>
        </header>

        <div className="pt-10">
          <BeliefExperiment key={scenario.id} scenario={scenario} onSubmitted={() => setDone(true)} />
        </div>
      </article>

      {done && (
        <div className="mt-20 space-y-16">
          <section>
            <h3 className="font-display text-display-s">Everyone else</h3>
            <div className="mt-6">
              <AggregateResults key={`agg-${scenario.id}`} scenario={scenario} />
            </div>
          </section>
          <section>
            <h3 className="font-display text-display-s">The model</h3>
            <p className="mt-3 max-w-measure text-[0.86rem] leading-relaxed text-ink-faint">
              Same context, same stimulus, same readings, same evidence in the same order, same
              constraint that the numbers total one hundred. It never sees the design notes, and each
              stage is a separate request.
            </p>
            <div className="mt-6">
              <ModelComparison key={`ai-${scenario.id}`} scenario={scenario} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
