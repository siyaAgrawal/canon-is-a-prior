"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { candidates, STATUS_LABEL, STATUS_NOTE, type Status } from "@/research/discovery";

/**
 * The research state, live.
 *
 * Each candidate shows its status, what would move it, and the rival that would
 * explain the same data. The evidence counter beside each one is read from the
 * dataset — so a candidate sitting at OPEN with n = 0 says so, rather than
 * looking like a finding in waiting.
 */

const STATUS_COLOR: Record<Status, string> = {
  open: "rgb(var(--faint))",
  supported: "#6AAD89",
  weakened: "#E0A244",
  contradicted: "#C2453A",
  abandoned: "rgb(var(--faint))",
};

const INSTRUMENT_KEY: Record<string, string[]> = {
  "/sure": ["entry"],
  "/versions": ["versions"],
  "/discriminate": ["discriminate"],
  "/criteria, /discriminate": ["criteria", "discriminate"],
  "/categories": ["category"],
  "/machines": [],
  "/shape": ["shape"],
};

export function DiscoveryBoard() {
  const reduce = useReducedMotion();
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/trace")
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => live && b && setCounts(b.byInstrument ?? {}))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);

  const evidenceFor = (instrument: string): number | null => {
    if (!counts) return null;
    const keys = INSTRUMENT_KEY[instrument];
    if (!keys) return null;
    if (keys.length === 0) return 0;
    return keys.reduce((n, k) => n + (counts[k] ?? 0), 0);
  };

  return (
    <div>
      <ul>
        {candidates.map((c, i) => {
          const isOpen = open === c.id;
          const n = evidenceFor(c.instrument);
          return (
            <li key={c.id} className="hair">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : c.id)}
                className="group w-full py-7 text-left"
              >
                <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
                  <div className="min-w-0 flex-1">
                    <span
                      className="font-mono text-[0.56rem] uppercase tracking-[0.16em]"
                      style={{ color: "rgb(var(--faint))" }}
                    >
                      Level {c.level === "construction" ? "I" : c.level === "revision" ? "II" : "III"} · {c.level}
                    </span>
                    <p
                      className="mt-2 max-w-measure font-display text-d5 leading-snug transition-opacity group-hover:opacity-80"
                      style={c.status === "abandoned" ? { textDecoration: "line-through", textDecorationColor: "#C2453A", opacity: 0.7 } : undefined}
                    >
                      {c.claim}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <span className="text-right">
                      <span
                        className="block font-mono text-[0.6rem] uppercase tracking-[0.14em]"
                        style={{ color: STATUS_COLOR[c.status] }}
                      >
                        {STATUS_LABEL[c.status]}
                      </span>
                      <span className="mt-1 block font-mono text-[0.58rem] tabular" style={{ color: "rgb(var(--faint))" }}>
                        {n === null ? "…" : `n = ${n}`}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`font-mono text-sm transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      style={{ color: "rgb(var(--faint))" }}
                    >
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
                <div className="grid gap-x-10 gap-y-6 pb-9 lg:grid-cols-2">
                  <div>
                    <p className="kicker mb-2">Where it stands</p>
                    <p className="text-[0.92rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                      {c.standing}
                    </p>
                    <p className="mt-4 text-[0.82rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                      {STATUS_NOTE[c.status]}
                    </p>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <p className="kicker mb-2" style={{ color: "rgb(var(--accent))" }}>
                        What would move it
                      </p>
                      <p className="text-[0.92rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                        {c.needs}
                      </p>
                    </div>
                    <div>
                      <p className="kicker mb-2">The rival</p>
                      <p className="text-[0.92rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                        {c.rival}
                      </p>
                    </div>
                    {c.instrument !== "—" && (
                      <p className="font-mono text-[0.62rem]" style={{ color: "rgb(var(--faint))" }}>
                        Instrument:{" "}
                        {c.instrument.split(", ").map((href, j) => (
                          <span key={href}>
                            {j > 0 && ", "}
                            <Link href={href} className="underline decoration-dotted underline-offset-2">
                              {href}
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
