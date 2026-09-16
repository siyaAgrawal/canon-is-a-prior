"use client";

import { useState } from "react";
import type { Scenario } from "@/types";
import { BeliefExperiment } from "./BeliefExperiment";
import { AggregateResults } from "@/components/viz/AggregateResults";

/**
 * Pick a scenario, do it, then — only then — see what everyone else did.
 *
 * The order is enforced. Seeing the group first would make the measurement
 * worthless in a way that would not be visible in the data afterwards.
 */
export function ScenarioRunner({ scenarios }: { scenarios: Scenario[] }) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const scenario = scenarios[index];

  const shuffle = () => {
    let n = index;
    while (scenarios.length > 1 && n === index) n = Math.floor(Math.random() * scenarios.length);
    setIndex(n);
    setDone(false);
  };

  const myth = scenarios.filter((s) => s.track === "myth");
  const language = scenarios.filter((s) => s.track === "language");

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] tabular" style={{ color: "rgb(var(--faint))" }}>
          {index + 1} of {scenarios.length}
        </span>
        <div className="flex flex-wrap items-center gap-5">
          <button type="button" className="btn-quiet" onClick={shuffle}>
            ↻ Give me another
          </button>
          <label>
            <span className="sr-only">Choose scenario</span>
            <select
              value={index}
              onChange={(e) => {
                setIndex(Number(e.target.value));
                setDone(false);
              }}
              className="max-w-[16rem] px-2 py-1.5 font-mono text-[0.7rem]"
            >
              <optgroup label="Myth">
                {myth.map((s) => (
                  <option key={s.id} value={scenarios.indexOf(s)}>
                    {s.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Language">
                {language.map((s) => (
                  <option key={s.id} value={scenarios.indexOf(s)}>
                    {s.title}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
        </div>
      </div>

      <article>
        <header className="hair pb-8 pt-8">
          <p className="say max-w-measure">{scenario.context}</p>
          <p className="mt-6 max-w-column font-display text-d5 leading-[1.4]">{scenario.stimulus}</p>
          <p className="mt-5 font-mono text-[0.56rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--faint))" }}>
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
        <section className="mt-20">
          <h2 className="font-display text-d4">Everyone else</h2>
          <div className="mt-6">
            <AggregateResults key={`agg-${scenario.id}`} scenario={scenario} />
          </div>
        </section>
      )}
    </div>
  );
}
