import type { ReactNode } from "react";

export function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-wide px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Reading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-reading ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

/**
 * A page opening.
 *
 * No number, no standfirst. The first build put a paragraph under every title
 * explaining what the reader was about to understand, which is the single most
 * reliable way to stop them finding it themselves. If a page needs framing, the
 * framing is one line and it is a question or an observation, not a summary.
 */
export function PageHead({
  title,
  note,
  tag,
}: {
  title: string;
  note?: ReactNode;
  tag?: ReactNode;
}) {
  return (
    <header className="pt-14 sm:pt-20">
      <Shell>
        <div className="max-w-column">
          {tag && <div className="mb-5">{tag}</div>}
          <h1 className="text-display-l">{title}</h1>
          {note && <div className="say mt-6 max-w-measure">{note}</div>}
        </div>
      </Shell>
    </header>
  );
}

/** A marginal note in the author's hand. Decorative in placement, substantive in content. */
export function Annotation({
  children,
  className = "",
  tone = "rust",
}: {
  children: ReactNode;
  className?: string;
  tone?: "rust" | "indigo" | "gold" | "moss";
}) {
  const colors = {
    rust: "text-rust",
    indigo: "text-indigo",
    gold: "text-gold",
    moss: "text-moss",
  } as const;
  return (
    <p className={`hand ${colors[tone]} ${className}`}>
      <span aria-hidden="true" className="mr-1.5 opacity-60">
        ↳
      </span>
      {children}
    </p>
  );
}

export function PullQuote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="my-12 border-l-2 border-rust/40 pl-6 sm:pl-8">
      <blockquote className="font-display text-display-m leading-[1.15]">{children}</blockquote>
      {cite && <figcaption className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-faint">{cite}</figcaption>}
    </figure>
  );
}

export function Rule({ label }: { label?: string }) {
  if (!label) return <hr className="my-14 border-0 border-t border-rule-soft" />;
  return (
    <div className="my-14 flex items-center gap-4">
      <span className="h-px flex-1 bg-rule-soft" />
      <span className="eyebrow">{label}</span>
      <span className="h-px flex-1 bg-rule-soft" />
    </div>
  );
}

export function NoteCard({
  title,
  children,
  tone = "plain",
}: {
  title?: string;
  children: ReactNode;
  tone?: "plain" | "warn" | "quiet";
}) {
  const tones = {
    plain: "border-rule-soft",
    warn: "border-rust/30 bg-rust/[0.035]",
    quiet: "border-rule-soft bg-paper-sunk/60",
  } as const;
  return (
    <div className={`note ${tones[tone]}`}>
      {title && <p className="eyebrow mb-2">{title}</p>}
      <div className="prose-note">{children}</div>
    </div>
  );
}

/** Numbered step markers used in the belief-trajectory diagrams. */
export function StepMarker({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[0.6rem] tabular ${
        active ? "border-rust bg-rust text-paper" : "border-rule text-ink-faint"
      }`}
    >
      {label}
    </span>
  );
}
