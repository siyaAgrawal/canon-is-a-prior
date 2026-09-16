"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { groupLabel, groupOrder, places, type Place } from "@/lib/journey";

/**
 * Explore: everywhere, from anywhere.
 *
 * Grouped by what the thing is, not by a reading order — there isn't one. The
 * dot beside each entry carries its room's colour, so the index doubles as a
 * legend for the rest of the site.
 *
 * Focus is trapped while open and returned on close. This is the site's primary
 * navigation and has to be fully operable without a mouse.
 */
const ROOM_COLOR: Record<Place["room"], string> = {
  origin: "#E0A244",
  myth: "#E0A244",
  physics: "#7AB2CC",
  doubt: "#C84E42",
  inference: "#6AAD89",
  spatial: "#7AB2CC",
  human: "#C88A7E",
  record: "#A89478",
};

export function Index({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      restoreTo.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>("a,button")?.focus());
    } else {
      restoreTo.current?.focus?.();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !ref.current) return;
      const f = Array.from(ref.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])")).filter(
        (el) => el.offsetParent !== null,
      );
      if (f.length === 0) return;
      const [first, last] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="project-index"
          role="dialog"
          aria-modal="true"
          aria-label="Explore the project"
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-bg/97 backdrop-blur-lg"
        >
          <div className="shell flex min-h-screen flex-col py-5">
            <div className="flex items-center justify-between">
              <p className="kicker">Explore — every page, from any page</p>
              <button type="button" onClick={onClose} className="btn-quiet">
                Close
                <kbd className="ml-1 border px-1 text-[0.58rem] opacity-60" style={{ borderColor: "rgb(var(--line) / 0.3)" }}>
                  esc
                </kbd>
              </button>
            </div>

            <div className="my-auto grid gap-x-10 gap-y-12 py-10 sm:grid-cols-2 lg:grid-cols-3">
              {groupOrder.map((g, gi) => {
                const inGroup = places.filter((p) => p.group === g);
                if (inGroup.length === 0) return null;
                return (
                  <section key={g} className={g === "experiments" ? "lg:row-span-2" : undefined}>
                    <div className="mb-5 flex items-center gap-3">
                      <span aria-hidden="true" className="h-px w-6 flex-none" style={{ background: "rgb(var(--accent))" }} />
                      <h2 className="kicker" style={{ color: "rgb(var(--fg))" }}>
                        {groupLabel[g]}
                      </h2>
                    </div>

                    <ul className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute bottom-4 left-[5px] top-4 w-px"
                        style={{ background: "rgb(var(--line) / 0.18)" }}
                      />
                      {inGroup.map((p, i) => {
                        const active = p.href === pathname;
                        return (
                          <motion.li
                            key={p.href}
                            initial={reduce ? false : { opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: reduce ? 0 : 0.04 + gi * 0.04 + i * 0.035, duration: 0.35 }}
                          >
                            <Link
                              href={p.href}
                              aria-current={active ? "page" : undefined}
                              className="group flex items-start gap-4 py-2.5"
                            >
                              <span
                                aria-hidden="true"
                                className="relative mt-[8px] h-[10px] w-[10px] flex-none rounded-full border transition-transform duration-200 group-hover:scale-125"
                                style={{
                                  borderColor: ROOM_COLOR[p.room],
                                  background: active ? ROOM_COLOR[p.room] : "rgb(var(--bg))",
                                  boxShadow: active ? `0 0 12px ${ROOM_COLOR[p.room]}66` : undefined,
                                }}
                              />
                              <span className="min-w-0">
                                <span
                                  className="block font-display text-[1.2rem] leading-tight transition-colors"
                                  style={{ color: active ? ROOM_COLOR[p.room] : "rgb(var(--fg))" }}
                                >
                                  {p.title}
                                </span>
                                <span className="mt-0.5 block text-[0.82rem] leading-snug" style={{ color: "rgb(var(--faint))" }}>
                                  {p.line}
                                </span>
                              </span>
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>

            <p className="text-[0.76rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
              These groupings are mine — a model of the project, not the project. Nothing here has to
              be visited in this order, or at all.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
