"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STATUS_LABEL, candidates, type Status } from "@/research/discovery";
import type { Finding } from "@/lib/analysis";

const COLOR: Record<Status, string> = {
  open: "rgb(var(--faint))",
  supported: "#6AAD89",
  weakened: "#E0A244",
  contradicted: "#C2453A",
  abandoned: "rgb(var(--faint))",
};

/**
 * The live state of the experiment, small.
 *
 * Its job is to make the thing you just did feel like it went somewhere. It shows
 * the real counts and the nearest candidate to its threshold — including, most of
 * the time, that nothing has crossed one yet, which is the honest version of
 * "your response matters".
 */
export function Pulse() {
  const [data, setData] = useState<{ totals: any; findings: Finding[] } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    fetch("/api/findings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error())))
      .then((b) => live && setData(b))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);

  if (failed || !data) return null;

  const { totals, findings } = data;
  const concluded = findings.filter((f) => f.ready);
  // Closest to firing: fewest responses still needed.
  const nearest = findings
    .filter((f) => !f.ready && f.minN > 0)
    .sort((a, b) => a.minN - a.n - (b.minN - b.n))[0];
  const nearestClaim = nearest ? candidates.find((c) => c.id === nearest.id) : null;

  return (
    <div className="panel px-6 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <p className="kicker" style={{ color: "rgb(var(--accent))" }}>
          Live · this is a running experiment
        </p>
        <Link href="/discovery" className="btn-quiet">
          All eight candidates →
        </Link>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {[
          ["Sessions", totals.sessions],
          ["Responses", totals.traces + totals.responses],
          ["Model runs", totals.aiRuns],
        ].map(([label, value]) => (
          <div key={String(label)}>
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--faint))" }}>
              {label}
            </p>
            <p className="mt-1 font-display text-3xl tabular">{String(value)}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 border-t pt-5" style={{ borderColor: "rgb(var(--line) / 0.15)" }}>
        {concluded.length > 0 ? (
          <ul className="space-y-2.5">
            {concluded.slice(0, 3).map((f) => {
              const c = candidates.find((x) => x.id === f.id);
              return (
                <li key={f.id} className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em]" style={{ color: COLOR[f.status] }}>
                    {STATUS_LABEL[f.status]}
                  </span>
                  <span className="max-w-measure text-[0.88rem] leading-snug" style={{ color: "rgb(var(--muted))" }}>
                    {f.result ?? c?.claim}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : nearest && nearestClaim ? (
          <p className="max-w-measure text-[0.88rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
            Nothing has crossed its threshold yet. The closest is{" "}
            <Link href="/discovery" className="underline decoration-dotted underline-offset-2">
              &ldquo;{nearestClaim.claim.toLowerCase().replace(/\.$/, "")}&rdquo;
            </Link>
            , which needs {Math.max(0, nearest.minN - nearest.n)} more before anything is concluded
            about it.
          </p>
        ) : (
          <p className="text-[0.88rem]" style={{ color: "rgb(var(--muted))" }}>
            Nothing has been collected yet.
          </p>
        )}
      </div>
    </div>
  );
}
