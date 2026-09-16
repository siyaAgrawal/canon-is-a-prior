"use client";

import { useEffect, useState } from "react";
import type { AIResponse, Scenario } from "@/types";
import { normalizedEntropy, totalVariation } from "@/lib/stats";
import { BeliefTrajectory } from "./BeliefTrajectory";
import { EmptyState } from "./EmptyState";

/**
 * What a model did with the same scenario.
 *
 * If no run exists, this says so and explains why, rather than showing a plausible
 * trajectory. A fabricated model run would be the single most damaging thing this
 * site could contain, since the model comparison is its central empirical claim.
 */
export function ModelComparison({ scenario }: { scenario: Scenario }) {
  const [state, setState] = useState<"loading" | "error" | "ok">("loading");
  const [runs, setRuns] = useState<AIResponse[]>([]);
  const [configured, setConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch(`/api/ai?scenario=${encodeURIComponent(scenario.id)}`)
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body?.error ?? `Request failed (${r.status})`);
        return body;
      })
      .then((body) => {
        if (!live) return;
        setRuns(body.runs ?? []);
        setConfigured(Boolean(body.configured));
        setState("ok");
      })
      .catch((err) => {
        if (!live) return;
        setError(err instanceof Error ? err.message : "unknown error");
        setState("error");
      });
    return () => {
      live = false;
    };
  }, [scenario.id]);

  if (state === "loading") {
    return (
      <div className="border border-dashed border-line/20 px-6 py-10 text-center">
        <p className="kicker animate-pulse-soft">Checking for model runs…</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="border border-dashed border-accent/40 bg-accent/[0.03] px-6 py-8 text-center">
        <p className="kicker text-accent">Could not read model runs</p>
        <p className="mt-2 text-[0.85rem] text-faint">{error}</p>
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <EmptyState title="No model has been run on this scenario yet." n={0}>
        <p>
          {configured
            ? "A model API key is configured on this deployment, so runs can be performed from the evaluation console — but none has been recorded for this scenario."
            : "No model API key is configured on this deployment, so no run can be performed here. Nothing is simulated in its place."}
        </p>
      </EmptyState>
    );
  }

  const stageLabels = ["prior", ...scenario.evidence.map((_, i) => `evidence ${i + 1}`)];

  return (
    <div className="space-y-10">
      {runs.map((run) => {
        const stages = run.steps.map((s) => s.distribution);
        const h0 = normalizedEntropy(stages[0]);
        const hEnd = normalizedEntropy(stages[stages.length - 1]);
        const movement = totalVariation(stages[0], stages[stages.length - 1]);
        return (
          <article key={run.id} className="panel p-5 sm:p-7">
            <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line/12 pb-4">
              <p className="font-mono text-[0.72rem] tracking-[0.1em] text-fg">{run.model}</p>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">
                prompt {run.promptVersion} · {run.origin} · {new Date(run.createdAt).toISOString().slice(0, 10)}
              </p>
            </header>

            <div className="mt-6">
              <BeliefTrajectory
                interpretations={scenario.interpretations}
                stages={stages}
                stageLabels={stageLabels}
                height={210}
              />
            </div>

            <dl className="mt-6 grid gap-4 border-t border-line/12 pt-5 sm:grid-cols-3">
              <div>
                <dt className="kicker">Total movement</dt>
                <dd className="mt-1 font-mono text-lg tabular text-accent">{Math.round(movement * 100)}%</dd>
              </div>
              <div>
                <dt className="kicker">Spread at start</dt>
                <dd className="mt-1 font-mono text-lg tabular text-cold">
                  {h0 === null ? "—" : `${Math.round(h0 * 100)}%`}
                </dd>
              </div>
              <div>
                <dt className="kicker">Spread at end</dt>
                <dd className="mt-1 font-mono text-lg tabular text-cold">
                  {hEnd === null ? "—" : `${Math.round(hEnd * 100)}%`}
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-line/12 pt-5">
              <p className="kicker mb-3">What the model said, stage by stage</p>
              <ol className="space-y-3">
                {run.rationales.map((r, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-[3px] font-mono text-[0.6rem] tracking-widest text-faint tabular">
                      {stageLabels[i]}
                    </span>
                    <span className="flex-1 text-[0.86rem] leading-relaxed text-muted">
                      {r || <span className="italic text-faint">no rationale returned</span>}
                      {run.steps[i].confidence !== null && (
                        <span className="ml-2 font-mono text-[0.7rem] text-faint">
                          [stated confidence {run.steps[i].confidence}%]
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        );
      })}
    </div>
  );
}
