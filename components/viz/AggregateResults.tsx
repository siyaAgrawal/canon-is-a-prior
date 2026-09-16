"use client";

import { useEffect, useState } from "react";
import type { Scenario } from "@/types";
import { DistributionBars } from "./DistributionBars";
import { EmptyState } from "./EmptyState";

interface AggregatePayload {
  n: number;
  threshold: number;
  ready: boolean;
  aggregate: {
    stages: { evidenceId: string | null; cells: { interpretationId: string; mean: number; median: number }[] }[];
    disagreement: number[];
    updateMagnitude: { evidenceId: string; mean: number; median: number }[];
  } | null;
}

/**
 * Group results for one scenario.
 *
 * Three states, and all three are real: loading, not-enough-data, and data. There is
 * no fourth state in which representative-looking numbers appear. The threshold also
 * protects participants — below it, a group mean is close to an individual response.
 */
export function AggregateResults({ scenario }: { scenario: Scenario }) {
  const [state, setState] = useState<"loading" | "error" | "ok">("loading");
  const [data, setData] = useState<AggregatePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch(`/api/responses?scenario=${encodeURIComponent(scenario.id)}`)
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body?.error ?? `Request failed (${r.status})`);
        return body as AggregatePayload;
      })
      .then((body) => {
        if (!live) return;
        setData(body);
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
        <p className="kicker animate-pulse-soft">Reading the dataset…</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="border border-dashed border-accent/40 bg-accent/[0.03] px-6 py-8 text-center">
        <p className="kicker text-accent">Could not read the dataset</p>
        <p className="mt-2 text-[0.85rem] text-faint">{error}</p>
      </div>
    );
  }

  if (!data?.ready || !data.aggregate) {
    return (
      <EmptyState
        title={`Results appear once ${data?.threshold ?? 5} people have completed this scenario.`}
        n={data?.n ?? 0}
      >
        <p>
          Below that threshold a group average is barely distinguishable from one person&rsquo;s
          answer, which would be both uninformative and a weak form of exposure. Nothing is displayed
          in the meantime, and nothing is estimated.
        </p>
      </EmptyState>
    );
  }

  const first = Object.fromEntries(data.aggregate.stages[0].cells.map((c) => [c.interpretationId, c.mean]));
  const lastStage = data.aggregate.stages[data.aggregate.stages.length - 1];
  const last = Object.fromEntries(lastStage.cells.map((c) => [c.interpretationId, c.mean]));
  const disagreementStart = data.aggregate.disagreement[0];
  const disagreementEnd = data.aggregate.disagreement[data.aggregate.disagreement.length - 1];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="kicker">Group results</p>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint tabular">
          n = {data.n}
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <DistributionBars
          interpretations={scenario.interpretations}
          distribution={first}
          label="Mean prior, before evidence"
        />
        <DistributionBars
          interpretations={scenario.interpretations}
          distribution={last}
          compareTo={first}
          compareLabel="prior"
          label="Mean after all evidence"
        />
      </div>

      <div className="border-t border-line/12 pt-6">
        <p className="kicker mb-3">Did people converge?</p>
        <p className="text-[0.9rem] leading-relaxed text-muted">
          Average disagreement between any two participants went from{" "}
          <span className="font-mono tabular text-accent">{Math.round(disagreementStart * 100)}%</span> before
          any evidence to{" "}
          <span className="font-mono tabular text-accent">{Math.round(disagreementEnd * 100)}%</span> after all
          of it.{" "}
          {disagreementEnd < disagreementStart
            ? "Evidence narrowed the gap between readers."
            : disagreementEnd > disagreementStart
              ? "Evidence widened the gap — people moved in different directions from the same facts."
              : "Evidence left the gap where it was."}
        </p>
        <p className="mt-2 text-[0.78rem] leading-relaxed text-faint">
          Measured as mean pairwise total variation distance. 0% would mean everyone submitted the
          same distribution; 100% would mean no two people put weight on the same reading.
        </p>
      </div>
    </div>
  );
}
