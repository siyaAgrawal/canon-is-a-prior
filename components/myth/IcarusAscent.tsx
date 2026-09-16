"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { recordTrace } from "@/lib/record";

/**
 * The ascent.
 *
 * You scroll and he climbs. The sky lightens because he is going up, not because
 * a designer wanted a gradient — at the top the light is strong enough to be
 * indistinguishable from glare, which is the only honest way to draw a sun you are
 * flying at.
 *
 * The premise selector at the top changes what the four fixed events mean. The
 * events do not move. They are drawn from Ovid, Metamorphoses VIII, in paraphrase.
 *
 * The figure is an original drawing. No painting is reproduced.
 */

interface Premise {
  id: string;
  label: string;
  tint: string;
  /** One reading per fixed event, in order. */
  readings: string[];
  /** What this premise cannot absorb. */
  resists: string;
}

const PREMISES: Premise[] = [
  {
    id: "pride",
    label: "He climbs to exceed a limit.",
    tint: "#C2453A",
    readings: [
      "A constraint issued by someone with the standing to issue it.",
      "The instruction is heard, and the hearing is what makes exceeding it mean anything.",
      "The climb is the point. Altitude is a position taken against the person who set the limit.",
      "A punishment fitted to the offence. The story closes cleanly, which is part of why it lasted.",
    ],
    resists:
      "Ovid gives Icarus no grievance, no speech and no defiance. The pride is supplied by later readers and is not in the account you were handed.",
  },
  {
    id: "curiosity",
    label: "He climbs to find out what is up there.",
    tint: "#E0A244",
    readings: [
      "A specification about wax. Specifications constrain; they do not motivate.",
      "Heard as an engineering fact rather than a rule, which is a different kind of hearing.",
      "An experiment with insufficient instruments. He has no altimeter and no second attempt.",
      "Not a punishment. A price — which is what we call the same outcome when we approve of the reason.",
    ],
    resists:
      "He was still told the limit, and he still exceeded it. Curiosity explains the motive. It does not remove the fact that the constraint was known.",
  },
  {
    id: "freedom",
    label: "He climbs because he has been confined.",
    tint: "#8B6FA8",
    readings: [
      "A smaller cage, reasonably built, issued by the person who built the first one.",
      "The middle course is itself a version of the labyrinth. Compliance would be continuity.",
      "The first unconstrained act of his life, and the only one available.",
      "The centre of the story moves off the fall and onto the climb.",
    ],
    resists:
      "This is doing interpretive work the text permits and does not supply. Ovid's Icarus is drawn upward by the sky, not driven upward by a grievance.",
  },
  {
    id: "accident",
    label: "He does not mean to climb at all.",
    tint: "#5B8FA8",
    readings: [
      "Under-specified, delivered once, in the air, over water, to someone who had never flown.",
      "Received, and not understood as load-bearing.",
      "A misjudgement. Anyone without an instrument would make it.",
      "No moral content whatsoever, which is the most disruptive thing any of these four can do to the story.",
    ],
    resists:
      "The text describes a boy reaching after the open sky. To hold this you have to treat the ascent as unnoticed, which strains the account.",
  },
];

const EVENTS = [
  { at: 0.06, label: "The warning", text: "Daedalus tells him to hold a middle course. Too low and the sea weighs the feathers. Too high and the sun loosens the wax." },
  { at: 0.3, label: "The launch", text: "They go up together. Ovid says the boy's hands shook, and the father's did too." },
  { at: 0.58, label: "The climb", text: "He leaves the middle course and goes higher." },
  { at: 0.84, label: "The fall", text: "The wax gives. He goes into the sea, and the sea takes his name." },
];

export function IcarusAscent() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [premiseId, setPremiseId] = useState("pride");
  const opened = useRef<string[]>(["pride"]);
  const startedAt = useRef(Date.now());

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const skyTop = useTransform(scrollYProgress, [0, 0.45, 1], ["#12141E", "#2A2436", "#A87F4A"]);
  const skyBottom = useTransform(scrollYProgress, [0, 0.45, 1], ["#0B0C14", "#141726", "#5E4630"]);
  const sunOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 0.72]);
  const sunScale = useTransform(scrollYProgress, [0.3, 1], [0.45, 1.25]);
  const figureY = useTransform(scrollYProgress, [0, 0.86, 1], ["82%", "14%", "46%"]);
  const figureRotate = useTransform(scrollYProgress, [0, 0.84, 0.92, 1], [0, -4, 120, 168]);
  // Composed here rather than in the style prop: a hook cannot be called behind a
  // ternary, and the reduced-motion branch has to be a value, not a skipped hook.
  const skyGradient = useTransform(
    [skyTop, skyBottom],
    ([a, b]: string[]) => `linear-gradient(180deg, ${a} 0%, ${b} 100%)`,
  );

  const premise = PREMISES.find((p) => p.id === premiseId)!;

  const choose = (id: string) => {
    setPremiseId(id);
    if (!opened.current.includes(id)) opened.current.push(id);
  };

  useEffect(() => {
    const send = () =>
      void recordTrace(
        "rewrite",
        { module: "icarus", premisesOpened: opened.current, dwellMs: Date.now() - startedAt.current },
        Date.now() - startedAt.current,
      );
    window.addEventListener("pagehide", send);
    return () => {
      window.removeEventListener("pagehide", send);
      send();
    };
  }, []);

  return (
    <div ref={wrap} className="relative" style={{ minHeight: "440vh" }}>
      {/* The sky. Fixed, so it changes under you while the events scroll past. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none sticky top-0 -mb-[100vh] h-screen w-full overflow-hidden"
        style={{ backgroundImage: reduce ? "linear-gradient(180deg, #2A2436, #0B0C14)" : skyGradient }}
      >
        <motion.div
          className="absolute left-[64%] top-[10%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full"
          style={{
            opacity: reduce ? 0.6 : sunOpacity,
            scale: reduce ? 1 : sunScale,
            background: "radial-gradient(circle, #FFF0C8 0%, #F2C368 34%, rgba(224,162,68,0) 70%)",
          }}
        />
        <motion.div
          className="absolute left-[8%] w-32 sm:w-40"
          style={{ top: reduce ? "40%" : figureY, rotate: reduce ? 0 : figureRotate }}
        >
          <Figure tint={premise.tint} />
        </motion.div>
      </motion.div>

      {/* The premise selector rides along. */}
      <div className="sticky top-[3.4rem] z-20">
        <div className="shell">
          {/* Below lg the rail is a full-width bar and the prose is pushed clear of
              it. Above lg it sits in a right rail and the prose is narrowed instead.
              It must never overlay the text — a control that covers the thing it
              controls is worse than no control. */}
          <div
            className="w-full border p-3.5 backdrop-blur-md sm:p-4 lg:ml-auto lg:max-w-[20rem]"
            style={{ background: "rgb(var(--bg) / 0.92)", borderColor: "rgb(var(--line) / 0.22)" }}
          >
            <p className="kicker mb-2.5">He climbs because —</p>
            <ul className="space-y-0.5">
              {PREMISES.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={p.id === premiseId}
                    onClick={() => choose(p.id)}
                    className="pick py-1.5 text-[0.88rem]"
                    style={p.id === premiseId ? { borderColor: p.tint, background: `${p.tint}1e` } : undefined}
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* The four fixed events. */}
      <div className="relative z-10">
        {EVENTS.map((e, i) => (
          <section key={e.label} className="flex min-h-[100vh] items-center">
            <div className="shell">
              <div
                className="max-w-[30rem] pb-8 pt-[14rem] sm:max-w-[32rem] lg:pr-8 lg:pt-8"
                style={{
                  background:
                    "radial-gradient(120% 100% at 0% 50%, rgb(var(--bg) / 0.82), rgb(var(--bg) / 0) 78%)",
                }}
              >
                <p className="kicker" style={{ color: premise.tint }}>
                  {e.label} — unchanged
                </p>
                <p className="mt-4 font-text text-[1.22rem] leading-[1.55]" style={{ color: "rgb(var(--fg))" }}>
                  {e.text}
                </p>
                <motion.p
                  key={`${premiseId}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.5 }}
                  className="mt-7 border-l-2 pl-5 text-[1rem] leading-[1.65]"
                  style={{ borderColor: premise.tint, color: "rgb(var(--muted))" }}
                >
                  {premise.readings[i]}
                </motion.p>
              </div>
            </div>
          </section>
        ))}

        <section className="flex min-h-[70vh] items-center pb-24">
          <div className="shell">
            <div
              className="max-w-column pb-10 pt-[14rem] lg:pt-10"
              style={{
                background:
                  "radial-gradient(110% 100% at 0% 50%, rgb(var(--bg) / 0.86), rgb(var(--bg) / 0) 80%)",
              }}
            >
              <p className="font-display text-d3">Same fall. Different story.</p>
              <motion.div
                key={premiseId}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 border-l-2 pl-5"
                style={{ borderColor: premise.tint }}
              >
                <p className="kicker mb-2" style={{ color: premise.tint }}>
                  What this premise cannot absorb
                </p>
                <p className="max-w-measure text-[0.98rem] leading-[1.65]" style={{ color: "rgb(var(--muted))" }}>
                  {premise.resists}
                </p>
              </motion.div>
              <p className="mt-10 max-w-measure text-[0.84rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                Every premise pays something. A reading that pays nothing anywhere is usually the one
                that has stopped touching the text.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/** Original figure. Deliberately spare — a body and two wings, nothing classical. */
function Figure({ tint }: { tint: string }) {
  return (
    <svg viewBox="0 0 120 90" className="w-full" aria-hidden="true">
      <g fill="none" stroke={tint} strokeWidth="1.6" strokeLinecap="round">
        <path d="M60 34 L60 58" />
        <path d="M60 58 L53 76 M60 58 L68 74" />
        <path d="M58 38 L16 20 M58 38 L22 34 M58 38 L30 44" opacity="0.92" />
        <path d="M62 38 L104 20 M62 38 L98 34 M62 38 L90 44" opacity="0.92" />
      </g>
      <circle cx="60" cy="28" r="5" fill={tint} />
    </svg>
  );
}
