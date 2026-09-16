import type { ReactNode } from "react";

export function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`shell ${className}`}>{children}</div>;
}

export function Reading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-reading ${className}`}>{children}</div>;
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker">{children}</p>;
}

/**
 * A page opening. No standfirst — if a page needs framing it is one line, and it
 * is an observation or a question rather than a summary of what follows.
 */
export function PageHead({
  title,
  note,
  tag,
  kicker,
}: {
  title: string;
  note?: ReactNode;
  tag?: ReactNode;
  kicker?: string;
}) {
  return (
    <header className="pt-16 sm:pt-24">
      <Shell>
        <div className="max-w-column">
          {kicker && <p className="kicker mb-5">{kicker}</p>}
          {tag && <div className="mb-5">{tag}</div>}
          <h1 className="font-display text-d2">{title}</h1>
          {note && <div className="say mt-7 max-w-measure">{note}</div>}
        </div>
      </Shell>
    </header>
  );
}

export function Rule({ label }: { label?: string }) {
  if (!label) return <hr className="hair my-16 border-0" />;
  return (
    <div className="my-16 flex items-center gap-4">
      <span className="h-px flex-1" style={{ background: "rgb(var(--line) / var(--line-a))" }} />
      <span className="kicker">{label}</span>
      <span className="h-px flex-1" style={{ background: "rgb(var(--line) / var(--line-a))" }} />
    </div>
  );
}

/** A marginal note in the researcher's hand. */
export function Aside({ children }: { children: ReactNode }) {
  return (
    <p
      className="max-w-measure text-[0.84rem] leading-relaxed"
      style={{ color: "rgb(var(--faint))" }}
    >
      {children}
    </p>
  );
}

/** Where a claim needs an explicit boundary drawn around it. */
export function Boundary({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-l-2 py-1 pl-6" style={{ borderColor: "rgb(var(--accent))" }}>
      <p className="kicker mb-2" style={{ color: "rgb(var(--accent))" }}>
        {title}
      </p>
      <div className="say max-w-measure text-[0.98rem]">{children}</div>
    </div>
  );
}
