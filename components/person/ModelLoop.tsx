"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The loop.
 *
 * Drawn rather than described because the closure is the argument: the model
 * determines which evidence you go looking for, and the evidence you find
 * confirms the model. The dashed return path is the part that makes it a trap
 * rather than a process.
 *
 * Deliberately plain. This page should feel like it is speaking quietly.
 */

const NODES = [
  { id: "person", label: "The person", note: "Real, entire, and never available to you in full.", y: 0 },
  { id: "evidence", label: "Fragments", note: "What they said. What they did. What you were told. What you remember, which is not the same as what happened.", y: 1 },
  { id: "prior", label: "What you brought", note: "Expectation, context, the last person who resembled them, what you were hoping for.", y: 2 },
  { id: "model", label: "Your model of them", note: "Compressed, usable, and not them.", y: 3 },
  { id: "action", label: "What you do", note: "You act toward the model, because the model is the only version you have access to.", y: 4 },
  { id: "new", label: "What comes back", note: "Their response — to what you did, which came from the model.", y: 5 },
];

export function ModelLoop() {
  const [open, setOpen] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div>
        <ol>
          {NODES.map((n, i) => {
            const active = open === n.id;
            return (
              <li key={n.id} className="relative">
                {i < NODES.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[5px] top-[22px] h-[calc(100%-10px)] w-px bg-rule"
                  />
                )}
                <button
                  type="button"
                  aria-expanded={active}
                  onClick={() => setOpen(active ? null : n.id)}
                  className="group flex w-full items-start gap-4 py-3 text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-[7px] h-[11px] w-[11px] shrink-0 rounded-full border transition-colors ${
                      active ? "border-accent bg-accent" : "border-fg/40 bg-bg group-hover:border-accent"
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block font-display text-[1.12rem] leading-snug transition-colors ${
                        active ? "text-accent" : "group-hover:text-accent"
                      }`}
                    >
                      {n.label}
                    </span>
                    <motion.span
                      initial={false}
                      animate={{ height: active ? "auto" : 0, opacity: active ? 1 : 0 }}
                      transition={{ duration: reduce ? 0 : 0.3 }}
                      className="block overflow-hidden"
                    >
                      <span className="mt-1.5 block text-[0.86rem] leading-relaxed text-faint">
                        {n.note}
                      </span>
                    </motion.span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="relative mt-1 pl-[26px]">
          <span aria-hidden="true" className="absolute left-[5px] top-0 h-6 w-px bg-accent/50" />
          <p className="pt-5 font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.14em] text-accent">
            ↑ and back into the model
          </p>
          <p className="mt-2 max-w-measure text-[0.85rem] leading-relaxed text-faint">
            Which is where it stops being a process and starts being a loop. The model decided what
            you did. What you did shaped what came back. What came back is now evidence for the
            model.
          </p>
        </div>
      </div>

      <div className="lg:pt-6">
        <div className="max-w-measure">
          <p className="font-display text-d5 leading-snug">
            None of this means the person is fictional.
          </p>
          <div className="say mt-5">
            <p>
              They are entirely real and they are not made of your evidence. The model is yours. The
              person is not.
            </p>
            <p>
              That distinction is the whole thing, and it is easy to lose in both directions. Drop it
              one way and you get the claim that people are constructions, which is false and
              convenient. Drop it the other way and you forget you are running a model at all, which
              is the ordinary condition and much more common.
            </p>
            <p className="text-fg">
              The model is not the problem. Models are how anyone thinks about anyone. Forgetting it
              is a model is the problem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
