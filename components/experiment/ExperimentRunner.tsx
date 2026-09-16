"use client";

import { useState } from "react";
import type { Scenario } from "@/types";
import { BeliefExperiment } from "./BeliefExperiment";

/**
 * Wraps the experiment with a scenario chooser.
 *
 * Remounting on change (via the key) resets all state — a participant who switches
 * scenarios halfway should start clean rather than carry a distribution across.
 */
export function ExperimentRunner({ scenarios }: { scenarios: Scenario[] }) {
  const [id, setId] = useState(scenarios[0].id);
  const scenario = scenarios.find((s) => s.id === id) ?? scenarios[0];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-2">Scenario</span>
        {scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setId(s.id)}
            aria-pressed={s.id === id}
            className={`border px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] transition-colors ${
              s.id === id ? "border-ink bg-ink text-paper" : "border-rule text-ink-faint hover:border-ink hover:text-ink"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <article className="card p-6 sm:p-9">
        <header className="mb-8 border-b border-rule-soft pb-7">
          <h2 className="font-display text-2xl leading-tight">{scenario.title}</h2>
          <p className="prose-note mt-4">{scenario.context}</p>
          <p className="mt-5 border-l-2 border-ink/25 pl-4 font-display text-[1.14rem] leading-[1.5]">
            {scenario.stimulus}
          </p>
          <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-ghost">
            {scenario.source === "public-domain-myth"
              ? "Paraphrased from a public-domain text — see Sources"
              : "Written for this experiment"}
          </p>
        </header>

        <BeliefExperiment key={scenario.id} scenario={scenario} />
      </article>
    </div>
  );
}
