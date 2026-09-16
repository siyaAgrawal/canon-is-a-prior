"use client";

import { useState, useId } from "react";
import type { ReactNode } from "react";

/**
 * Inline jargon, expandable.
 *
 * The rule for this site is that no technical term appears without a plain-English
 * version one click away, and that the plain version is the honest one rather than a
 * simplification that would mislead.
 */
export function Term({ term, children }: { term: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="border-b border-dotted border-cold/60 text-cold transition-colors hover:border-cold hover:bg-cold/5"
      >
        {term}
      </button>
      {open && (
        <span
          id={id}
          role="note"
          className="mt-2 block border-l-2 border-cold/30 bg-surface px-4 py-3 text-[0.86rem] leading-relaxed text-muted"
        >
          {children}
        </span>
      )}
    </span>
  );
}
