"use client";

import Link from "next/link";
import { groupLabel, placeFor, roomColor, stepFor } from "@/lib/journey";

/**
 * You are here. One line at the top of every page except the homepage, which
 * has to stay unexplained until the visitor has done it.
 *
 * Deliberately not sticky: the header is exactly 3.4rem tall and the Icarus
 * premise rail and the counterfactual engine both pin themselves to that line.
 * A second sticky bar would sit on top of the controls it is meant to help find.
 * The header carries the persistent part (the current section is lit there).
 */
export function WhereBar({ pathname, onOpenIndex }: { pathname: string; onOpenIndex: () => void }) {
  if (pathname === "/") return null;
  const place = placeFor(pathname);
  if (!place) return null;
  const step = stepFor(pathname);
  const color = roomColor[place.room];

  return (
    <nav aria-label="You are here" className="shell">
      <div
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b py-3"
        style={{ borderColor: "rgb(var(--line) / var(--line-a))" }}
      >
        <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.6rem] uppercase tracking-[0.16em]">
          <li>
            <Link href="/" className="text-faint transition-colors hover:text-fg">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-faint">/</li>
          <li>
            <button
              type="button"
              onClick={onOpenIndex}
              className="uppercase tracking-[0.16em] text-faint transition-colors hover:text-fg"
            >
              {groupLabel[place.group]}
            </button>
          </li>
          <li aria-hidden="true" className="text-faint">/</li>
          <li aria-current="page" className="flex items-center gap-2" style={{ color }}>
            <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: color }} />
            {place.title}
          </li>
        </ol>

        {step && (
          <div className="flex items-center gap-4 font-mono text-[0.6rem] uppercase tracking-[0.16em]">
            {step.prev ? (
              <Link href={step.prev.href} className="text-faint transition-colors hover:text-fg">
                <span aria-hidden="true">←</span> <span className="sr-only">Previous: </span>
                <span className="hidden sm:inline">{step.prev.title}</span>
                <span className="sm:hidden">Prev</span>
              </Link>
            ) : (
              <Link href="/" className="text-faint transition-colors hover:text-fg">
                <span aria-hidden="true">←</span> Home
              </Link>
            )}
            <span className="tabular text-faint">
              {step.index + 1}&thinsp;/&thinsp;{step.total}
            </span>
            {step.next && (
              <Link href={step.next.href} className="text-fg transition-opacity hover:opacity-70">
                <span className="sr-only">Next: </span>
                <span className="hidden sm:inline">{step.next.title}</span>
                <span className="sm:hidden">Next</span> <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
