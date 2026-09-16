import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-rule-soft">
      <div className="mx-auto max-w-wide px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="max-w-measure text-[0.82rem] leading-relaxed text-ink-faint">
            An investigation, not a conclusion. Nothing is reported that the data does not contain,
            and where there is no data the page says so.
          </p>
          <nav aria-label="Secondary" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/lab" className="btn-quiet">Method</Link>
            <Link href="/ethics" className="btn-quiet">What is stored</Link>
            <Link href="/about" className="btn-quiet">Origin</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
