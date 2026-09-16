"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { categoryCase, RESPONSES, type ResponseId } from "@/data/category";
import { recordTrace } from "@/lib/record";
import { Reasoning } from "@/components/ui/Reasoning";
import { Recorded } from "@/components/ui/Recorded";

/**
 * Sort six specimens, then meet the seventh.
 *
 * The first six exist to establish that the scheme works — the anomaly means
 * nothing unless the categories have earned trust first. The seventh is built so
 * that every available response costs something, and the page says what each one
 * costs only after it has been chosen.
 */
export function CategoryFailure() {
  const reduce = useReducedMotion();
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"sort" | "anomaly" | "after">("sort");
  const [response, setResponse] = useState<ResponseId | null>(null);
  const [newName, setNewName] = useState("");
  const [reasoning, setReasoning] = useState("");
  const startedAt = useRef(Date.now());
  const sent = useRef(false);

  const normal = categoryCase.specimens.filter((s) => s.id !== categoryCase.anomalyId);
  const anomaly = categoryCase.specimens.find((s) => s.id === categoryCase.anomalyId)!;
  const sortedAll = normal.every((s) => assignments[s.id]);
  const chosen = RESPONSES.find((r) => r.id === response) ?? null;

  useEffect(() => {
    if (phase !== "after" || sent.current) return;
    sent.current = true;
    void recordTrace(
      "category",
      {
        caseId: categoryCase.id,
        assignments,
        anomalyResponse: response,
        createdCategory: response === "new" ? newName.trim() || null : null,
        reasoning: reasoning.trim() || null,
      },
      Date.now() - startedAt.current,
    );
  }, [phase, assignments, response, newName, reasoning]);

  return (
    <div>
      {/* The scheme. */}
      <div className="grid gap-5 sm:grid-cols-2">
        {categoryCase.categories.map((c) => (
          <div key={c.id} className="panel p-5">
            <p className="font-display text-d5">{c.name}</p>
            <p className="mt-2 font-mono text-[0.74rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
              {c.rule}
            </p>
          </div>
        ))}
      </div>

      {/* Sort. */}
      <div className="mt-12">
        <p className="kicker mb-5">Sort the specimens</p>
        <ul className="space-y-0">
          {normal.map((s) => (
            <li key={s.id} className="hair grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--faint))" }}>
                  {s.label}
                </p>
                <ul className="mt-2 space-y-1">
                  {s.traits.map((t) => (
                    <li key={t} className="text-[0.92rem]" style={{ color: "rgb(var(--muted))" }}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                {categoryCase.categories.map((c) => {
                  const on = assignments[s.id] === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={on}
                      aria-label={`Put ${s.label} in ${c.name}`}
                      onClick={() => setAssignments((a) => ({ ...a, [s.id]: c.id }))}
                      className="border px-3.5 py-2 font-mono text-[0.64rem] uppercase tracking-[0.12em] transition-colors"
                      style={
                        on
                          ? { borderColor: "rgb(var(--accent))", background: "rgb(var(--accent) / 0.16)", color: "rgb(var(--fg))" }
                          : { borderColor: "rgb(var(--line) / 0.25)", color: "rgb(var(--faint))" }
                      }
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>

        {phase === "sort" && (
          <button type="button" className="btn mt-9" disabled={!sortedAll} onClick={() => setPhase("anomaly")}>
            {sortedAll ? "Next specimen" : "Sort all six first"}
          </button>
        )}
      </div>

      {/* The anomaly. */}
      <AnimatePresence>
        {phase !== "sort" && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-14"
          >
            <div className="border-l-2 pl-6" style={{ borderColor: "rgb(var(--accent))" }}>
              <p className="kicker" style={{ color: "rgb(var(--accent))" }}>
                {anomaly.label}
              </p>
              <ul className="mt-3 space-y-1.5">
                {anomaly.traits.map((t) => (
                  <li key={t} className="font-text text-[1.04rem] leading-[1.5]">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-9 max-w-measure font-display text-d4">What do you do?</p>
            <ul className="mt-4 max-w-column">
              {RESPONSES.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className="pick text-[0.98rem] leading-relaxed"
                    aria-pressed={response === r.id}
                    onClick={() => {
                      setResponse(r.id);
                      setPhase("after");
                    }}
                  >
                    {r.label}
                  </button>
                </li>
              ))}
            </ul>

            <AnimatePresence mode="wait">
              {chosen && (
                <motion.div
                  key={chosen.id}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 max-w-measure"
                >
                  <p className="kicker mb-2">What that costs</p>
                  <p className="say">{chosen.note}</p>

                  {response === "new" && (
                    <div className="mt-8">
                      <label htmlFor="new-cat" className="block font-display text-d5">
                        What would you call it?
                      </label>
                      <input
                        id="new-cat"
                        type="text"
                        value={newName}
                        maxLength={60}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="a name for the third kind"
                        className="mt-3 w-full px-3 py-2.5 font-text text-[0.98rem]"
                      />
                    </div>
                  )}

                  <div className="mt-10">
                    <Reasoning
                      id="category-reasoning"
                      value={reasoning}
                      onChange={setReasoning}
                      label="Why that one?"
                      placeholder="What made the other three worse?"
                    />
                  </div>

                  <div className="mt-8">
                    <Recorded what="Where you put each specimen, what you did with the seventh, any category you named, and this reasoning." />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
