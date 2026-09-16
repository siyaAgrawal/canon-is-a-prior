"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EmptyState } from "./EmptyState";

/**
 * The RESULTS section of the lab.
 *
 * It exists in two states and only two: "nothing to report yet" and a pointer to the
 * live dashboard. It will never contain a written-up finding that the dataset does
 * not support, and the hypotheses above it will not be quietly edited to match
 * whatever arrives.
 */
export function ResultsStatus() {
  const [n, setN] = useState<number | null>(null);
  const [ready, setReady] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((body) => {
        if (!live) return;
        setN(body.totals.responses);
        setReady(body.perScenario.filter((s: { ready: boolean }) => s.ready).length);
      })
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);

  if (failed) {
    return (
      <p className="border border-dashed border-rust/40 bg-rust/[0.03] px-5 py-4 text-[0.88rem] text-ink-faint">
        The dataset could not be read just now, so this section is showing nothing rather than
        guessing.
      </p>
    );
  }

  if (n === null) {
    return <p className="eyebrow animate-pulse-soft">Reading the dataset…</p>;
  }

  if (n === 0) {
    return (
      <EmptyState title="No results. The dataset contains zero responses." n={0}>
        <p>
          This section stays empty until there is something to report. When there is, the hypotheses
          above will be marked supported, contradicted or untestable — including the ones that turn
          out to be wrong, which will not be deleted.
        </p>
      </EmptyState>
    );
  }

  return (
    <div className="border-l-2 border-moss bg-moss/[0.04] px-5 py-5">
      <p className="eyebrow text-moss">Collection in progress</p>
      <p className="mt-2 text-[0.94rem] leading-relaxed text-ink">
        {n} response{n === 1 ? "" : "s"} recorded so far, across{" "}
        {ready === 0 ? "no scenario" : `${ready} scenario${ready === 1 ? "" : "s"}`} that has reached
        the reporting threshold.
      </p>
      <p className="mt-3 text-[0.86rem] leading-relaxed text-ink-faint">
        No conclusion is drawn here yet. The numbers as they stand are on the{" "}
        <Link href="/data" className="underline decoration-dotted underline-offset-2">
          data page
        </Link>
        , where they can be read without a narrative wrapped around them.
      </p>
    </div>
  );
}
