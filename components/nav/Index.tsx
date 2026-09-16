"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { groupLabel, places, type Place } from "@/lib/journey";

/**
 * The index: everywhere, at once, from anywhere.
 *
 * A constellation rather than a dropdown — each place is a point with a line back
 * to its group, because the project's own claim is that things look connected and
 * the connections have to earn it. Nothing is ranked. Order within a group is not
 * significance.
 *
 * Focus is trapped while open and returned on close, since this is the site's
 * primary navigation and it must be operable without a mouse.
 */
const ROOM_COLOR: Record<Place["room"], string> = {
  origin: "#E0A244",
  myth: "#E0A244",
  physics: "#7AB2CC",
  doubt: "#C84E42",
  inference: "#6AAD89",
  spatial: "#7AB2CC",
  human: "#96443A",
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
      const f = Array.from(
        ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null);
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
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

  const groups: Place["group"][] = ["explore", "thread", "record"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="project-index"
          role="dialog"
          aria-modal="true"
          aria-label="Project index"
          ref={ref}
          initial={reduce ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-bg/97 backdrop-blur-lg"
        >
          <div className="shell flex min-h-screen flex-col py-6">
            <div className="flex items-center justify-between">
              <p className="kicker">Everywhere, from anywhere</p>
              <button type="button" onClick={onClose} className="btn-quiet">
                Close
                <kbd className="ml-1 border px-1 text-[0.58rem] opacity-60" style={{ borderColor: "rgb(var(--line) / 0.3)" }}>
                  esc
                </kbd>
              </button>
            </div>

            <div className="my-auto grid gap-x-12 gap-y-14 py-12 lg:grid-cols-3">
              {groups.map((g, gi) => (
                <section key={g}>
                  <div className="mb-7 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-px flex-none"
                      style={{ width: 28, background: "rgb(var(--accent))" }}
                    />
                    <h2 className="kicker" style={{ color: "rgb(var(--fg))" }}>
                      {groupLabel[g]}
                    </h2>
                  </div>

                  <ul className="relative">
                    {/* The thread each point hangs from. */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-3 left-[5px] top-3 w-px"
                      style={{ background: "rgb(var(--line) / 0.2)" }}
                    />
                    {places
                      .filter((p) => p.group === g)
                      .map((p, i) => {
                        const active = p.href === pathname;
                        return (
                          <motion.li
                            key={p.href}
                            initial={reduce ? false : { opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: reduce ? 0 : 0.05 + gi * 0.06 + i * 0.045, duration: 0.4 }}
                          >
                            <Link
                              href={p.href}
                              aria-current={active ? "page" : undefined}
                              className="group flex items-start gap-4 py-3"
                            >
                              <span
                                aria-hidden="true"
                                className="relative mt-[7px] h-[11px] w-[11px] flex-none rounded-full border transition-all duration-200 group-hover:scale-125"
                                style={{
                                  borderColor: ROOM_COLOR[p.room],
                                  background: active ? ROOM_COLOR[p.room] : "rgb(var(--bg))",
                                  boxShadow: active ? `0 0 14px ${ROOM_COLOR[p.room]}66` : undefined,
                                }}
                              />
                              <span className="min-w-0">
                                <span
                                  className="block font-display text-[1.28rem] leading-tight transition-colors"
                                  style={{ color: active ? ROOM_COLOR[p.room] : "rgb(var(--fg))" }}
                                >
                                  {p.title}
                                </span>
                                <span
                                  className="mt-1 block text-[0.84rem] leading-snug"
                                  style={{ color: "rgb(var(--faint))" }}
                                >
                                  {p.line}
                                </span>
                              </span>
                            </Link>
                          </motion.li>
                        );
                      })}
                  </ul>
                </section>
              ))}
            </div>

            <p className="text-[0.76rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
              These groupings are mine. They are a model of the project, not the project — nothing
              here has to be visited in this order, or at all.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
