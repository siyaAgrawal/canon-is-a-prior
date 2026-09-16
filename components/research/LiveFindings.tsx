"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { candidates, STATUS_LABEL, STATUS_NOTE, type Status } from "@/research/discovery";
import type { Finding } from "@/lib/analysis";

/**
 * What the dataset currently says.
 *
 * Every row shows the decision rule beside the result, because a threshold that
 * appears only after the number is indistinguishable from one chosen to fit it.
 * Rows below their minimum show the shortfall rather than a provisional answer.
 */

const STATUS_COLOR: Record<Status, string> = {
  open: "rgb(var(--faint))",
  supported: "#6AAD89",
  weakened: "#E0A244",
  contradicted: "#C2453A",
  abandoned: "rgb(var(--faint))",
};

interface Payload {
  totals: { traces: number; responses: number; aiRuns: number; sessions: number };
  findings: Finding[];
  computedAt: string;
}

export function LiveFindings() {
  const reduce = useReducedMotion();
  const [data, setData] = useState<Payload | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/findings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((b) => live && setData(b))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);

  if (failed) {
    return (
      <p className="border border-dashed px-5 py-6 text-[0.9rem]" style={{ borderColor: "rgb(var(--accent) / 0.4)", color: "rgb(var(--muted))" }}>
        The dataset could not be read just now, so nothing is shown rather than something guessed.
      </p>
    );
  }
  if (!data) return <p className="kicker animate-flicker">Computing from the dataset…</p>;

  const rows = candidates.map((c) => ({ c, f: data.findings.find((f) => f.id === c.id) ?? null }));
  const tally = (s: Status) => rows.filter(({ c, f }) => (f?.status ?? c.status) === s).length;

  return (
    <div>
      {/* Counted from the same computed statuses as the rows, so the summary can
          never drift from the detail — which it did when these were separate. */}
      <div className="mb-14 grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {(["open", "supported", "weakened", "contradicted", "abandoned"] as Status[]).map((s) => (
          <div key={s} className="hair pt-4">
            <p className="kicker" style={{ color: tally(s) > 0 ? STATUS_COLOR[s] : "rgb(var(--faint))" }}>
              {STATUS_LABEL[s]}
            </p>
            <p className="mt-1.5 font-display text-2xl tabular">{tally(s)}</p>
          </div>
        ))}
      </div>

      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <p className="text-[0.86rem]" style={{ color: "rgb(var(--muted))" }}>
          {data.totals.sessions === 0
            ? "Nothing has been collected. Every row below says so."
            : `${data.totals.sessions} session${data.totals.sessions === 1 ? "" : "s"} · ${data.totals.traces} responses · ${data.totals.aiRuns} model runs`}
        </p>
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--faint))" }}>
          Recomputed {new Date(data.computedAt).toISOString().slice(11, 19)} UTC
        </p>
      </div>

      <ul>
        {rows.map(({ c, f }) => {
          const status = f?.status ?? c.status;
          const isOpen = open === c.id;
          const short = f && !f.ready && f.minN > 0 ? Math.max(0, f.minN - f.n) : 0;
          return (
            <li key={c.id} className="hair">
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c.id)} className="group w-full py-7 text-left">
                <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[0.56rem] uppercase tracking-[0.16em]" style={{ color: "rgb(var(--faint))" }}>
                      Level {c.level === "construction" ? "I" : c.level === "revision" ? "II" : "III"}
                    </span>
                    <p
                      className="mt-2 max-w-measure font-display text-d5 leading-snug transition-opacity group-hover:opacity-80"
                      style={status === "abandoned" ? { textDecoration: "line-through", textDecorationColor: "#C2453A", opacity: 0.7 } : undefined}
                    >
                      {c.claim}
                    </p>
                    {f?.result && (
                      <p className="mt-3 max-w-measure text-[0.92rem] leading-relaxed" style={{ color: STATUS_COLOR[status] }}>
                        {f.result}
                      </p>
                    )}
                    {f && !f.ready && f.minN > 0 && (
                      <p className="mt-3 font-mono text-[0.68rem]" style={{ color: "rgb(var(--faint))" }}>
                        n = {f.n} · {short} more before anything is concluded
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em]" style={{ color: STATUS_COLOR[status] }}>
                      {STATUS_LABEL[status]}
                    </span>
                    <span aria-hidden="true" className={`font-mono text-sm transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} style={{ color: "rgb(var(--faint))" }}>
                      +
                    </span>
                  </div>
                </div>
              </button>

              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="grid gap-x-10 gap-y-7 pb-9 lg:grid-cols-2">
                  <div className="space-y-5">
                    {f && f.rule && (
                      <div>
                        <p className="kicker mb-2" style={{ color: "rgb(var(--accent))" }}>
                          Decision rule, fixed before the data
                        </p>
                        <p className="text-[0.9rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                          {f.rule}
                        </p>
                      </div>
                    )}
                    {f && f.numbers.length > 0 && (
                      <dl className="space-y-1.5">
                        {f.numbers.map((n) => (
                          <div key={n.label} className="flex items-baseline justify-between gap-4 border-b py-1.5" style={{ borderColor: "rgb(var(--line) / 0.12)" }}>
                            <dt className="text-[0.82rem]" style={{ color: "rgb(var(--faint))" }}>{n.label}</dt>
                            <dd className="font-mono text-[0.82rem] tabular">{n.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <p className="text-[0.8rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                      {STATUS_NOTE[status]}
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="kicker mb-2">The rival</p>
                      <p className="text-[0.9rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>{c.rival}</p>
                    </div>
                    {f && !f.discriminating && f.caveat && (
                      <div className="border-l-2 pl-4" style={{ borderColor: "#E0A244" }}>
                        <p className="kicker mb-1.5" style={{ color: "#E0A244" }}>
                          This number cannot separate them
                        </p>
                        <p className="text-[0.88rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>{f.caveat}</p>
                      </div>
                    )}
                    {f?.discriminating && f.caveat && (
                      <p className="text-[0.88rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>{f.caveat}</p>
                    )}
                    {c.instrument !== "—" && (
                      <p className="font-mono text-[0.62rem]" style={{ color: "rgb(var(--faint))" }}>
                        {c.instrument.split(", ").map((href, j) => (
                          <span key={href}>
                            {j > 0 && "  "}
                            <Link href={href} className="underline decoration-dotted underline-offset-2">
                              contribute at {href}
                            </Link>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </li>
          );
        })}
      </ul>
      <div className="hair" />
    </div>
  );
}
