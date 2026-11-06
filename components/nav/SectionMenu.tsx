"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { groupLabel, groupLine, groupOrder, placeFor, places, roomColor, type Group } from "@/lib/journey";

/**
 * The four sections, always in the bar on desktop. The one you are in stays lit
 * however far you scroll, and each opens to its pages — so any page is two
 * clicks from any other without knowing a single shortcut.
 *
 * Click to open rather than hover: it behaves the same on a trackpad, a mouse and
 * a touchscreen laptop, and it does not open by accident while you reach for the
 * page underneath.
 */
export function SectionMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState<Group | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const here = placeFor(pathname)?.group;

  useEffect(() => setOpen(null), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden items-center gap-1 md:flex">
      {groupOrder.map((g) => {
        const isHere = here === g;
        const isOpen = open === g;
        return (
          <div key={g} className="relative">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`section-${g}`}
              aria-current={isHere ? "true" : undefined}
              onClick={() => setOpen(isOpen ? null : g)}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.16em] transition-colors ${
                isHere || isOpen ? "" : "text-faint hover:text-fg"
              }`}
              style={isHere ? { color: "rgb(var(--accent))" } : isOpen ? { color: "rgb(var(--fg))" } : undefined}
            >
              {groupLabel[g]}
              <svg
                aria-hidden="true"
                viewBox="0 0 8 5"
                className={`h-[5px] w-[8px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              >
                <path d="M.5.5 4 4 7.5.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
              </svg>
              {isHere && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-[3px] left-2.5 right-2.5 h-px"
                  style={{ background: "rgb(var(--accent))" }}
                />
              )}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`section-${g}`}
                  initial={reduce ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 top-[calc(100%+0.9rem)] z-50 w-[22rem] border p-5 backdrop-blur-lg"
                  style={{ background: "rgb(var(--bg) / 0.97)", borderColor: "rgb(var(--line) / 0.22)" }}
                >
                  <p className="kicker" style={{ color: "rgb(var(--fg))" }}>
                    {groupLabel[g]}
                  </p>
                  <p className="mt-1.5 text-[0.8rem] leading-snug text-faint">{groupLine[g]}</p>
                  <ul className="mt-3">
                    {places
                      .filter((p) => p.group === g)
                      .map((p) => {
                        const active = p.href === pathname;
                        const c = roomColor[p.room];
                        return (
                          <li key={p.href}>
                            <Link
                              href={p.href}
                              aria-current={active ? "page" : undefined}
                              className="group -mx-2 flex items-start gap-3 px-2 py-2 transition-colors hover:bg-fg/[0.04]"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-[0.5em] h-[8px] w-[8px] flex-none rounded-full border"
                                style={{ borderColor: c, background: active ? c : "transparent" }}
                              />
                              <span className="min-w-0">
                                <span className="block font-display text-[1.02rem] leading-tight" style={{ color: active ? c : "rgb(var(--fg))" }}>
                                  {p.title}
                                  {active && (
                                    <span className="ml-2 font-mono text-[0.54rem] uppercase tracking-[0.16em]">you are here</span>
                                  )}
                                </span>
                                <span className="mt-0.5 block text-[0.76rem] leading-snug text-faint">{p.line}</span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
