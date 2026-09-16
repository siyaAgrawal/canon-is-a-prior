"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { items, readings, STANCE_LABEL, type Stance } from "@/data/character";
import { recordTrace } from "@/lib/record";
import { Recorded } from "@/components/ui/Recorded";

/**
 * What it costs to keep a reading.
 *
 * Every item asks for two things: whether the reading still holds, and what the
 * reader does with an item that presses on it. The interesting output is not the
 * final reading. It is the count of items the reader marked as complicating a
 * reading they then kept — accommodation, which is how a good model survives
 * awkward evidence and also how a wrong one does.
 *
 * The trajectory is recorded — reading ids, stances and counts, nothing typed —
 * because how often a first reading survives is the thing this instrument exists
 * to find out. The page says so where it happens.
 */

interface Step {
  itemId: string;
  reading: string;
  stance: Stance;
}

export function CharacterLab() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"prior" | "run" | "done">("prior");
  const [reading, setReading] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [stance, setStance] = useState<Stance | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const startedAt = useRef(Date.now());
  const sent = useRef(false);

  const item = items[idx];
  const labelOf = (id: string | null) => readings.find((r) => r.id === id)?.label ?? "—";

  const commit = () => {
    if (!reading || !stance) return;
    const next = [...steps, { itemId: item.id, reading, stance }];
    setSteps(next);
    setStance(null);
    if (idx < items.length - 1) setIdx(idx + 1);
    else setPhase("done");
  };

  const firstReading = steps[0]?.reading ?? reading;
  const finalReading = steps[steps.length - 1]?.reading ?? reading;
  const switches = steps.filter((s, i) => i > 0 && s.reading !== steps[i - 1].reading).length;
  const accommodations = steps.filter(
    (s, i) => s.stance === "complicates" && (i === 0 || s.reading === steps[i - 1].reading),
  ).length;
  const breaksAbsorbed = steps.filter(
    (s, i) => s.stance === "breaks" && i > 0 && s.reading === steps[i - 1].reading,
  ).length;
  const survived = firstReading === finalReading;

  // Recorded once the trajectory is complete. The payload is ids and counts —
  // there is nothing here a participant typed, because there is nowhere to type.
  useEffect(() => {
    if (phase !== "done" || sent.current || steps.length === 0) return;
    sent.current = true;
    void recordTrace(
      "versions",
      {
        steps: steps.map((s) => ({ itemId: s.itemId, reading: s.reading, stance: s.stance })),
        switches,
        accommodations: accommodations + breaksAbsorbed,
        survived,
      },
      Date.now() - startedAt.current,
    );
  }, [phase, steps, switches, accommodations, breaksAbsorbed, survived]);

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  if (phase === "prior") {
    return (
      <div>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
          One fact to begin with
        </p>
        <p className="mt-5 max-w-column font-display text-d4 leading-[1.3]">{items[0].text}</p>

        <p className="mt-10 text-[0.9rem] text-faint">What kind of person is this?</p>
        <ul className="mt-3 max-w-measure">
          {readings.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className="pick"
                aria-pressed={reading === r.id}
                onClick={() => setReading(r.id)}
              >
                <span className="block font-display text-[1.05rem]">{r.label}</span>
                <span className="mt-0.5 block text-[0.82rem] leading-snug text-faint">{r.gloss}</span>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="btn mt-9"
          disabled={!reading}
          onClick={() => {
            setSteps([{ itemId: items[0].id, reading: reading!, stance: "fits" }]);
            setIdx(1);
            setPhase("run");
          }}
        >
          That&rsquo;s my reading
        </button>
        <p className="mt-4 max-w-measure text-[0.8rem] leading-relaxed text-faint">
          Wren is invented. There is no correct answer and none will be revealed, because none
          exists. Six more facts follow.
        </p>
      </div>
    );
  }

  if (phase === "run") {
    return (
      <div>
        <div className="mb-8 flex items-center gap-4">
          <div className="flex flex-1 gap-1" aria-hidden="true">
            {items.map((it, n) => (
              <span
                key={it.id}
                className={`h-[3px] flex-1 ${n < idx ? "bg-accent/60" : n === idx ? "bg-accent" : "bg-fg/10"}`}
              />
            ))}
          </div>
          <span className="font-mono text-[0.62rem] tabular text-faint">
            {idx + 1}/{items.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={item.id} {...fade}>
            <p className="max-w-column font-display text-d4 leading-[1.3]">{item.text}</p>

            <p className="mt-10 text-[0.9rem] text-faint">
              You currently read Wren as <span className="text-accent">{labelOf(reading)}</span>. What is
              this fact doing to that?
            </p>
            <ul className="mt-3 max-w-measure">
              {(Object.keys(STANCE_LABEL) as Stance[]).map((s) => (
                <li key={s}>
                  <button type="button" className="pick" aria-pressed={stance === s} onClick={() => setStance(s)}>
                    {STANCE_LABEL[s]}
                  </button>
                </li>
              ))}
            </ul>

            <div className="hair mt-8 pt-6">
              <p className="text-[0.86rem] text-faint">Keep your reading, or change it.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {readings.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={reading === r.id}
                    onClick={() => setReading(r.id)}
                    className={`border px-3 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.12em] transition-colors ${
                      reading === r.id
                        ? "border-fg bg-fg text-bg"
                        : "border-line/20 text-faint hover:border-fg hover:text-fg"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="btn mt-9" disabled={!stance} onClick={commit}>
              {idx < items.length - 1 ? "Next fact" : "That's all of them"}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-column">
        <p className="statement">
          {survived
            ? `Your first reading survived all seven facts.`
            : `You changed your reading ${switches === 1 ? "once" : `${switches} times`}.`}
        </p>
        <div className="say mt-7 max-w-measure">
          {survived ? (
            <p>
              You read Wren as <em>{labelOf(firstReading)}</em> after one fact and still did after
              seven.{" "}
              {accommodations + breaksAbsorbed > 0
                ? `Along the way you marked ${accommodations + breaksAbsorbed} of them as not fitting comfortably, and kept the reading anyway.`
                : "Nothing you saw pressed on it, which either means the evidence was weak or that you were not looking for the press."}
            </p>
          ) : (
            <p>
              You started at <em>{labelOf(firstReading)}</em> and ended at{" "}
              <em>{labelOf(finalReading)}</em>.
            </p>
          )}
          <p>
            {accommodations + breaksAbsorbed === 0
              ? "You did not accommodate anything — every fact either fit or moved you."
              : `Accommodation is the number that matters here: ${
                  accommodations + breaksAbsorbed
                } ${accommodations + breaksAbsorbed === 1 ? "fact was" : "facts were"} absorbed by a reading you kept. That is how a good model survives awkward evidence. It is also how a wrong one does. Nothing in the act itself tells you which you were doing.`}
          </p>
        </div>
      </div>

      <ol className="mt-14">
        {steps.map((s, i) => {
          const it = items.find((x) => x.id === s.itemId)!;
          const changed = i > 0 && s.reading !== steps[i - 1].reading;
          return (
            <li key={s.itemId} className="hair py-6">
              <div className="grid gap-x-8 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                  <p className="text-[0.94rem] leading-relaxed text-fg">{it.text}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span
                      className={`font-mono text-[0.6rem] uppercase tracking-[0.13em] ${
                        s.stance === "fits"
                          ? "text-faint"
                          : s.stance === "complicates"
                            ? "text-sun"
                            : "text-accent"
                      }`}
                    >
                      {s.stance}
                    </span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.13em] text-faint">
                      {changed ? `→ ${labelOf(s.reading)}` : `kept ${labelOf(s.reading)}`}
                    </span>
                  </div>
                </div>
                <p className="text-[0.85rem] leading-relaxed text-faint">
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-accent">
                    Written to —{" "}
                  </span>
                  {it.cuts}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="hair pt-8">
        <p className="max-w-measure text-[0.8rem] leading-relaxed text-faint">
          Wren does not exist, and the seven facts were written to press in particular directions —
          which I have now told you, and could not have told you before without changing what you
          did.
        </p>
        <div className="mt-4">
          <Recorded what="Which reading you held at each fact, what you did with it, and how many facts a kept reading absorbed." />
        </div>
        <button
          type="button"
          className="btn-quiet mt-5"
          onClick={() => {
            setPhase("prior");
            setSteps([]);
            setIdx(0);
            setReading(null);
            setStance(null);
            sent.current = false;
            startedAt.current = Date.now();
          }}
        >
          ↺ Start over with a different first reading
        </button>
      </div>
    </div>
  );
}
