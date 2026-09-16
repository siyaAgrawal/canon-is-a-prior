"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EmptyState } from "./EmptyState";

interface ScenarioRow {
  scenarioId: string;
  title: string;
  track: string;
  n: number;
  ready: boolean;
  disagreement: number[] | null;
  updateMagnitude: { evidenceId: string; mean: number; median: number }[] | null;
  aiRuns: number;
}

interface Stats {
  storage: string;
  threshold: number;
  totals: {
    responses: number;
    traces: number;
    allResponses: number;
    sessions: number;
    scenariosAttempted: number;
    scenariosTotal: number;
    aiResponses: number;
    aiModels: string[];
    firstResponseAt: string | null;
    lastResponseAt: string | null;
  };
  perScenario: ScenarioRow[];
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="border-t border-line/20 pt-4">
      <p className="kicker">{label}</p>
      <p className="mt-2 font-display text-3xl leading-none tabular">{value}</p>
      {note && <p className="mt-2 text-[0.76rem] leading-snug text-faint">{note}</p>}
    </div>
  );
}

/** Disagreement across stages, as a small inline line. Only drawn with real values. */
function Spark({ values }: { values: number[] }) {
  const w = 72;
  const h = 20;
  const pts = values
    .map((v, i) => `${(i / Math.max(1, values.length - 1)) * w},${h - v * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" className="overflow-visible">
      <polyline points={pts} fill="none" stroke="#A33B2C" strokeWidth={1.3} />
      {values.map((v, i) => (
        <circle key={i} cx={(i / Math.max(1, values.length - 1)) * w} cy={h - v * h} r={1.6} fill="#A33B2C" />
      ))}
    </svg>
  );
}

/**
 * The dashboard.
 *
 * Reads /api/stats and renders whatever is there. When the dataset is empty the
 * numbers are zeros and the charts are replaced by empty states — never by
 * illustrative data, and never by a percentage that hides a denominator of three.
 */
interface TraceCounts {
  total: number;
  sessions: number;
  byInstrument: Record<string, number>;
}

const INSTRUMENT_LABEL: Record<string, string> = {
  entry: "Homepage — which assumptions were tried",
  shape: "Claims — judgements, and how many controls passed",
  versions: "Character lab — trajectory and accommodations",
  criteria: "Criteria — which property decided it",
  rewrite: "Icarus — which premises were opened",
  map: "Map — which nodes were opened",
};

export function Dashboard() {
  const [state, setState] = useState<"loading" | "error" | "ok">("loading");
  const [stats, setStats] = useState<Stats | null>(null);
  const [traces, setTraces] = useState<TraceCounts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/trace")
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => live && b && setTraces(b))
      .catch(() => undefined);
    fetch("/api/stats")
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body?.error ?? `Request failed (${r.status})`);
        return body as Stats;
      })
      .then((body) => {
        if (!live) return;
        setStats(body);
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
  }, []);

  if (state === "loading") {
    return (
      <div className="border border-dashed border-line/20 px-6 py-16 text-center">
        <p className="kicker animate-pulse-soft">Reading the dataset…</p>
      </div>
    );
  }

  if (state === "error" || !stats) {
    return (
      <div className="border border-dashed border-accent/40 bg-accent/[0.03] px-6 py-10 text-center">
        <p className="kicker text-accent">The dataset could not be read</p>
        <p className="mt-2 text-[0.85rem] text-faint">{error}</p>
        <p className="mx-auto mt-4 max-w-measure text-[0.8rem] text-faint">
          This message is shown rather than an empty chart, because a failed read and an empty
          dataset are different things and should not look the same.
        </p>
      </div>
    );
  }

  const { totals, perScenario, threshold } = stats;
  const withData = perScenario.filter((s) => s.n > 0);
  const ready = perScenario.filter((s) => s.ready);

  return (
    <div className="space-y-16">
      <section>
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Responses"
            value={String(totals.allResponses ?? totals.responses)}
            note="Every completed instrument, across the whole site."
          />
          <Metric
            label="Participants"
            value={String(totals.sessions)}
            note="Distinct anonymous session identifiers. One person using two browsers counts twice."
          />
          <Metric
            label="Scenario distributions"
            value={`${totals.responses}`}
            note={`Across ${totals.scenariosAttempted} of ${totals.scenariosTotal} scenarios. These are the only rows the per-scenario charts below can use.`}
          />
          <Metric
            label="Model runs"
            value={String(totals.aiResponses)}
            note={
              totals.aiModels.length > 0
                ? `Models: ${totals.aiModels.join(", ")}`
                : "No model has been run against this dataset yet."
            }
          />
        </div>
        <p className="mt-8 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-faint">
          Storage: {stats.storage} ·{" "}
          {totals.firstResponseAt
            ? `first response ${new Date(totals.firstResponseAt).toISOString().slice(0, 10)}`
            : "no responses recorded"}
        </p>
      </section>

      <section>
        <h3 className="font-display text-d4">Everything else that is recorded</h3>
        <p className="mt-3 max-w-reading text-[0.86rem] leading-relaxed text-faint">
          Every instrument writes one row when you finish with it: ids, counts, and — where a box
          invited you to write — your reasoning, verbatim and optional. These are the totals.
        </p>
        <ul className="mt-6">
          {Object.keys(INSTRUMENT_LABEL).map((k) => (
            <li key={k} className="hair flex items-baseline justify-between gap-4 py-3">
              <span className="text-[0.9rem]">{INSTRUMENT_LABEL[k]}</span>
              <span className="font-mono text-[0.86rem] tabular" style={{ color: "rgb(var(--fg))" }}>
                {traces ? (traces.byInstrument?.[k] ?? 0) : "—"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {totals.responses === 0 ? (
        <EmptyState
          title={
            (totals.allResponses ?? 0) > 0
              ? "Responses exist, but none of them are scenario distributions yet."
              : "Nothing has been collected yet."
          }
          n={totals.allResponses ?? 0}
        >
          {(totals.allResponses ?? 0) > 0 ? (
            <>
              <p>
                The charts below need the hundred-point distributions from the scenario experiment.
                Everything recorded so far came from the other instruments, and it is counted on the{" "}
                <Link href="/discovery" className="underline decoration-dotted underline-offset-2">
                  findings page
                </Link>
                .
              </p>
              <p className="mt-3">
                <Link href="/sure" className="underline decoration-dotted underline-offset-2">
                  A distribution takes about two minutes.
                </Link>
              </p>
            </>
          ) : (
            <>
              <p>
                Every chart on this page appears the moment there is something real to put in it, and
                not before.
              </p>
              <p className="mt-3">
                <Link href="/sure" className="underline decoration-dotted underline-offset-2">
                  The first response can be yours.
                </Link>
              </p>
            </>
          )}
        </EmptyState>
      ) : (
        <>
          <section>
            <h3 className="font-display text-2xl">Per scenario</h3>
            <p className="mt-2 max-w-reading text-[0.86rem] leading-relaxed text-faint">
              Disagreement is the average distance between any two participants&rsquo;
              distributions, shown across stages from prior to final. A line that falls means
              evidence brought people together; a line that rises means it pushed them apart.
              Scenarios below n = {threshold} show a count only.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <caption className="sr-only">Response counts and disagreement by scenario</caption>
                <thead>
                  <tr className="border-b border-line/20">
                    <th scope="col" className="py-2 pr-4 kicker font-normal">Scenario</th>
                    <th scope="col" className="py-2 pr-4 kicker font-normal">Track</th>
                    <th scope="col" className="py-2 pr-4 kicker font-normal text-right">n</th>
                    <th scope="col" className="py-2 pr-4 kicker font-normal">Disagreement</th>
                    <th scope="col" className="py-2 kicker font-normal text-right">Model runs</th>
                  </tr>
                </thead>
                <tbody>
                  {withData.map((s) => (
                    <tr key={s.scenarioId} className="border-b border-line/12">
                      <td className="py-3 pr-4 text-[0.88rem]">{s.title}</td>
                      <td className="py-3 pr-4 font-mono text-[0.68rem] uppercase tracking-wider text-faint">
                        {s.track}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono text-[0.8rem] tabular">{s.n}</td>
                      <td className="py-3 pr-4">
                        {s.disagreement ? (
                          <span className="flex items-center gap-3">
                            <Spark values={s.disagreement} />
                            <span className="font-mono text-[0.72rem] tabular text-faint">
                              {Math.round(s.disagreement[0] * 100)}% →{" "}
                              {Math.round(s.disagreement[s.disagreement.length - 1] * 100)}%
                            </span>
                          </span>
                        ) : (
                          <span className="font-mono text-[0.7rem] text-faint">
                            below n = {threshold}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right font-mono text-[0.8rem] tabular text-faint">
                        {s.aiRuns}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="font-display text-2xl">Which evidence moved people most</h3>
            <p className="mt-2 max-w-reading text-[0.86rem] leading-relaxed text-faint">
              Mean movement caused by each evidence item, as a share of the maximum possible move.
              Only scenarios at or above n = {threshold} appear.
            </p>
            <div className="mt-6">
              {ready.length === 0 ? (
                <EmptyState title={`No scenario has reached ${threshold} responses yet.`} n={totals.responses}>
                  <p>Update magnitudes appear per scenario once enough people have completed it.</p>
                </EmptyState>
              ) : (
                <ul className="space-y-7">
                  {ready.map((s) => (
                    <li key={s.scenarioId}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[0.9rem]">{s.title}</p>
                        <p className="font-mono text-[0.7rem] tabular text-faint">n = {s.n}</p>
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {s.updateMagnitude?.map((m, i) => (
                          <li key={m.evidenceId} className="flex items-center gap-3">
                            <span className="w-20 shrink-0 font-mono text-[0.66rem] text-faint">
                              evidence {i + 1}
                            </span>
                            <span className="h-[7px] flex-1 bg-fg/[0.06]">
                              <span
                                className="block h-full bg-accent"
                                style={{ width: `${Math.min(100, m.mean * 100)}%` }}
                              />
                            </span>
                            <span className="w-12 shrink-0 text-right font-mono text-[0.72rem] tabular text-faint">
                              {Math.round(m.mean * 100)}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section>
            <h3 className="font-display text-2xl">The ambiguity map</h3>
            <p className="mt-2 max-w-reading text-[0.86rem] leading-relaxed text-faint">
              Each scenario placed by how much evidence it supplies against how much participants
              still disagree at the end. The interesting region is the bottom right: plenty of
              evidence, and people still divided.
            </p>
            <div className="mt-6">
              {ready.length < 2 ? (
                <EmptyState title="The map needs at least two scenarios above the threshold." n={totals.responses}>
                  <p>
                    A scatter plot of one point is not a map. It appears when there are at least two
                    scenarios with enough responses to place honestly.
                  </p>
                </EmptyState>
              ) : (
                <AmbiguityMap rows={ready} />
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function AmbiguityMap({ rows }: { rows: ScenarioRow[] }) {
  const w = 680;
  const h = 300;
  const m = { top: 20, right: 24, bottom: 42, left: 52 };
  const maxEvidence = Math.max(...rows.map((r) => r.updateMagnitude?.length ?? 0), 1);

  const x = (n: number) => m.left + (n / maxEvidence) * (w - m.left - m.right);
  const y = (d: number) => h - m.bottom - d * (h - m.top - m.bottom);

  return (
    <figure>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Scatter plot of evidence count against final disagreement, one point per scenario.">
        <line x1={m.left} y1={h - m.bottom} x2={w - m.right} y2={h - m.bottom} stroke="rgba(23,24,26,0.25)" />
        <line x1={m.left} y1={m.top} x2={m.left} y2={h - m.bottom} stroke="rgba(23,24,26,0.25)" />
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={m.left} x2={w - m.right} y1={y(t)} y2={y(t)} stroke="rgba(23,24,26,0.07)" strokeDasharray="2 4" />
            <text x={m.left - 8} y={y(t) + 4} textAnchor="end" fontSize={9} className="fill-ink-ghost font-mono">
              {Math.round(t * 100)}%
            </text>
          </g>
        ))}
        {rows.map((r) => {
          const ev = r.updateMagnitude?.length ?? 0;
          const d = r.disagreement?.[r.disagreement.length - 1] ?? 0;
          return (
            <g key={r.scenarioId}>
              <circle cx={x(ev)} cy={y(d)} r={Math.min(11, 3 + Math.sqrt(r.n))} fill="rgba(163,59,44,0.3)" stroke="#A33B2C" />
              <text x={x(ev) + 13} y={y(d) + 3.5} fontSize={9.5} className="fill-ink-soft">
                {r.title.length > 26 ? `${r.title.slice(0, 25)}…` : r.title}
              </text>
            </g>
          );
        })}
        <text x={(w + m.left) / 2} y={h - 8} textAnchor="middle" fontSize={9.5} className="fill-ink-faint font-mono">
          EVIDENCE ITEMS SUPPLIED →
        </text>
        <text transform={`translate(13 ${(h - m.bottom + m.top) / 2}) rotate(-90)`} textAnchor="middle" fontSize={9.5} className="fill-ink-faint font-mono">
          FINAL DISAGREEMENT →
        </text>
      </svg>
      <figcaption className="mt-3 text-[0.76rem] text-faint">
        Point size reflects the number of responses. Disagreement is mean pairwise total variation
        distance after all evidence.
      </figcaption>
    </figure>
  );
}
