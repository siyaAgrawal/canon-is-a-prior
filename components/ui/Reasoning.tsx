"use client";

import { REASONING_MAX } from "@/lib/trace-schema";

/**
 * The one place on this site where a participant's own words are kept.
 *
 * Labelled at the point of entry rather than in a policy page, capped, optional,
 * and never blocking. The warning about identifying detail is there because a
 * free-text box is the only route by which anything identifying could enter this
 * dataset, and saying so is cheaper than regretting it.
 */
export function Reasoning({
  value,
  onChange,
  label,
  placeholder,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
  id: string;
}) {
  const over = value.length > REASONING_MAX;
  return (
    <div>
      <label htmlFor={id} className="block font-display text-d5">
        {label}
      </label>
      <p className="mt-1.5 text-[0.8rem]" style={{ color: "rgb(var(--faint))" }}>
        Optional, and the most useful thing you can leave — what people answered is less
        informative than why. Please don&rsquo;t include anything that identifies you or anyone else.
      </p>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        maxLength={REASONING_MAX}
        placeholder={placeholder}
        className="mt-3 w-full resize-y px-3 py-2.5 font-text text-[0.96rem] leading-relaxed"
        style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--line) / var(--line-a))" }}
      />
      <div className="mt-1.5 flex items-center justify-between">
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--accent))" }}>
          Stored verbatim
        </span>
        <span
          className="font-mono text-[0.62rem] tabular"
          style={{ color: over ? "rgb(var(--accent))" : "rgb(var(--faint))" }}
        >
          {value.length}/{REASONING_MAX}
        </span>
      </div>
    </div>
  );
}
