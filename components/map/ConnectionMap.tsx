"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { clusterLabels, mapEdges, mapNodes, type EdgeStrength, type MapNode } from "@/data/connections";

/**
 * The sheet, made interactive.
 *
 * The design constraint that makes this more than a mind map: every line declares its
 * own strength, and analogical lines have to state their disanalogy. Drawing a
 * connection is cheap; saying what kind it is costs something, and several lines on
 * the original handwritten version turned out to be weaker than they looked once that
 * cost was imposed.
 */

const STROKE: Record<EdgeStrength, { dash?: string; width: number; label: string; color?: string }> = {
  structural: { width: 1.3, label: "Structural — a form both share, statable precisely" },
  analogical: { dash: "5 4", width: 1.1, label: "Analogical — suggestive, with a named disanalogy" },
  historical: { dash: "1.5 3.5", width: 1.2, label: "Historical — one actually influenced the other" },
  // Drawn as a line with a gap cut out of its middle: a connection that was made
  // and then severed. Keeping them visible is the point of the map.
  break: { dash: "16 13", width: 1.6, label: "Break — drawn, then cut. Where the resemblance stops", color: "#A33B2C" },
  open: { dash: "2 6", width: 1, label: "Open — suspected, not established" },
};

export function ConnectionMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<"map" | "list">("map");
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setView("list");
    }
  }, []);

  const node = useMemo(() => mapNodes.find((n) => n.id === selected) ?? null, [selected]);
  const connected = useMemo(
    () =>
      selected
        ? mapEdges
            .filter((e) => e.from === selected || e.to === selected)
            .map((e) => ({
              edge: e,
              other: mapNodes.find((n) => n.id === (e.from === selected ? e.to : e.from))!,
            }))
            .filter((x) => x.other)
        : [],
    [selected],
  );

  const isDim = (id: string) =>
    Boolean(selected) && id !== selected && !connected.some((c) => c.other.id === id);

  const select = (id: string | null) => {
    setSelected(id);
    if (id) requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
  };

  const W = 1000;
  const H = 760;
  const px = (n: MapNode) => (n.x / 100) * W;
  const py = (n: MapNode) => (n.y / 100) * H;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {(Object.keys(clusterLabels) as (keyof typeof clusterLabels)[]).map((k) => (
            <span key={k} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: clusterLabels[k].color }} aria-hidden="true" />
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint">
                {clusterLabels[k].label}
              </span>
            </span>
          ))}
        </div>
        <div className="flex gap-2" role="group" aria-label="Map display mode">
          {(["map", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`border px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] transition-colors ${
                view === v ? "border-ink bg-ink text-paper" : "border-rule text-ink-faint hover:border-ink hover:text-ink"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "map" && (
        <div className="relative overflow-x-auto border border-rule-soft bg-paper-raised no-scrollbar">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full min-w-[720px]"
            role="group"
            aria-label="Concept map. Use the list view for a linear, fully keyboard-navigable version."
          >
            <defs>
              <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(23,24,26,0.045)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#map-grid)" />

            {mapEdges.map((e, i) => {
              const a = mapNodes.find((n) => n.id === e.from);
              const b = mapNodes.find((n) => n.id === e.to);
              if (!a || !b) return null;
              const active = selected === e.from || selected === e.to;
              const dim = Boolean(selected) && !active;
              const s = STROKE[e.strength];
              const mx = (px(a) + px(b)) / 2;
              const my = (py(a) + py(b)) / 2 - 26;
              return (
                <path
                  key={`${e.from}-${e.to}-${i}`}
                  d={`M ${px(a)} ${py(a)} Q ${mx} ${my} ${px(b)} ${py(b)}`}
                  fill="none"
                  stroke={
                    s.color ?? (active ? clusterLabels[a.cluster].color : "rgba(23,24,26,0.34)")
                  }
                  strokeWidth={active ? s.width + 0.8 : s.width}
                  strokeDasharray={s.dash}
                  opacity={dim ? 0.1 : active ? 0.95 : e.strength === "break" ? 0.66 : 0.5}
                  style={{ transition: reduce ? undefined : "opacity 0.35s, stroke 0.35s" }}
                />
              );
            })}

            {mapNodes.map((n) => {
              const dim = isDim(n.id);
              const active = n.id === selected;
              const color = clusterLabels[n.cluster].color;
              return (
                <g
                  key={n.id}
                  transform={`translate(${px(n)} ${py(n)})`}
                  opacity={dim ? 0.24 : 1}
                  style={{ transition: reduce ? undefined : "opacity 0.35s", cursor: "pointer" }}
                  onClick={() => select(active ? null : n.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      select(active ? null : n.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  aria-label={`${n.label} — ${n.note}`}
                >
                  {/* Generous invisible hit area: the visible dot is 9px across, which is
                      nowhere near a comfortable target for a finger or an approximate click. */}
                  <circle r={26} fill="transparent" />
                  <circle r={active ? 7 : 4.5} fill={active ? color : "#FCFAF5"} stroke={color} strokeWidth={1.6} />
                  <text
                    x={0}
                    y={-13}
                    textAnchor="middle"
                    fontSize={active ? 14 : 12.5}
                    fill={active ? color : "#17181A"}
                    className="font-display"
                  >
                    {n.label}
                  </text>
                  <text x={0} y={18} textAnchor="middle" fontSize={9} fill="rgba(23,24,26,0.5)" className="font-sans">
                    {n.note}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="border-t border-rule-soft px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-ghost">
            Tap a node. Scroll sideways if it is cut off — or switch to list view.
          </p>
        </div>
      )}

      {(view === "list" || !mounted) && (
        <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {(Object.keys(clusterLabels) as (keyof typeof clusterLabels)[]).map((cluster) => (
            <section key={cluster} className="break-inside-avoid">
              <h3 className="mb-2 mt-4 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em]">
                <span className="h-2 w-2 rounded-full" style={{ background: clusterLabels[cluster].color }} aria-hidden="true" />
                {clusterLabels[cluster].label}
              </h3>
              <ul>
                {mapNodes
                  .filter((n) => n.cluster === cluster)
                  .map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        aria-pressed={n.id === selected}
                        onClick={() => select(n.id === selected ? null : n.id)}
                        className={`block w-full border-b border-rule-soft py-2.5 text-left transition-colors ${
                          n.id === selected ? "text-rust" : "hover:text-rust"
                        }`}
                      >
                        <span className="block font-display text-[1.04rem] leading-snug">{n.label}</span>
                        <span className="block text-[0.8rem] leading-snug text-ink-faint">{n.note}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <div className="mt-8" ref={panelRef} tabIndex={-1} aria-live="polite">
        <AnimatePresence mode="wait">
          {node ? (
            <motion.article
              key={node.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="card p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl" style={{ color: clusterLabels[node.cluster].color }}>
                  {node.label}
                </h3>
                <button type="button" className="btn-quiet" onClick={() => select(null)}>
                  Close
                </button>
              </div>
              <p className="prose-note mt-4">{node.detail}</p>

              {node.href && (
                <Link href={node.href} className="btn mt-5">
                  {node.hrefLabel ?? "Where this is used"} →
                </Link>
              )}

              <div className="mt-8 border-t border-rule-soft pt-6">
                <p className="eyebrow mb-4">
                  What connects these — {connected.length} link{connected.length === 1 ? "" : "s"}
                </p>
                <ul className="space-y-5">
                  {connected.map(({ edge, other }) => (
                    <li key={`${edge.from}-${edge.to}`}>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <button
                          type="button"
                          onClick={() => select(other.id)}
                          className="font-display text-[1.05rem] text-ink hover:text-rust"
                        >
                          {other.label}
                        </button>
                        <span
                          className={`border px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] ${
                            edge.strength === "structural"
                              ? "border-moss/40 text-moss"
                              : edge.strength === "historical"
                                ? "border-indigo/40 text-indigo"
                                : edge.strength === "break"
                                  ? "border-rust text-rust"
                                  : edge.strength === "open"
                                    ? "border-dashed border-ink/35 text-ink-faint"
                                    : "border-gold/50 text-gold"
                          }`}
                        >
                          {edge.strength}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-soft">{edge.claim}</p>
                      {edge.caveat && (
                        <p className="mt-1.5 border-l-2 border-gold/40 pl-3 text-[0.84rem] leading-relaxed text-ink-faint">
                          <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-gold">
                            Not claiming —{" "}
                          </span>
                          {edge.caveat}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ) : (
            <motion.div
              key="idle"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-dashed border-rule px-6 py-8"
            >
              <p className="eyebrow">Nothing selected</p>
              <p className="mt-3 max-w-reading text-[0.92rem] leading-relaxed text-ink-soft">
                Choose any node to see what it is doing here and which connections it actually
                supports. Each link declares its own strength, and the weaker kind has to say what it
                is not claiming.
              </p>
              <ul className="mt-5 space-y-1.5">
                {(Object.keys(STROKE) as EdgeStrength[]).map((k) => (
                  <li key={k} className="flex items-center gap-3">
                    <svg width="44" height="8" aria-hidden="true">
                      <line
                        x1="0"
                        y1="4"
                        x2="44"
                        y2="4"
                        stroke="rgba(23,24,26,0.55)"
                        strokeWidth={STROKE[k].width + 0.3}
                        strokeDasharray={STROKE[k].dash}
                      />
                    </svg>
                    <span className="text-[0.82rem] text-ink-faint">{STROKE[k].label}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
