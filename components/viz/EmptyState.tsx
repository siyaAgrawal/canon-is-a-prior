import type { ReactNode } from "react";

/**
 * The empty state is a first-class design object here, not a fallback.
 *
 * A chart with no data behind it must never be drawn with placeholder numbers, so
 * this component exists to make the absence of data look deliberate and readable.
 */
export function EmptyState({
  title,
  children,
  n,
}: {
  title: string;
  children?: ReactNode;
  n?: number;
}) {
  return (
    <div className="relative overflow-hidden border border-dashed border-rule bg-paper-sunk/40 px-6 py-10 text-center sm:px-10 sm:py-14">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="empty-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(23,24,26,0.13)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#empty-hatch)" />
      </svg>
      <div className="relative">
        <p className="eyebrow">No data yet</p>
        <p className="mx-auto mt-3 max-w-measure font-display text-xl leading-snug">{title}</p>
        {children && <div className="mx-auto mt-3 max-w-measure text-[0.88rem] leading-relaxed text-ink-faint">{children}</div>}
        {typeof n === "number" && (
          <p className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-ghost tabular">
            Responses collected: {n}
          </p>
        )}
      </div>
    </div>
  );
}
