import Link from "next/link";
import { asideLinks } from "@/lib/journey";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule-soft">
      <div className="mx-auto max-w-wide px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-measure">
            <p className="font-display text-lg leading-snug">The Canon Is a Prior</p>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-faint">
              An independent, unfinished investigation into how interpretations change when
              evidence changes. No results are reported that the dataset does not contain.
            </p>
          </div>
          <nav aria-label="Secondary" className="flex flex-col gap-2">
            {asideLinks.map((l) => (
              <Link key={l.href} href={l.href} className="btn-quiet">
                {l.title}
              </Link>
            ))}
            <Link href="/ai-console" className="btn-quiet">
              Model evaluation console
            </Link>
          </nav>
        </div>
        <p className="mt-10 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-ghost">
          Classical texts are public domain. Scenario prose, code and analysis are the author&rsquo;s own.
        </p>
      </div>
    </footer>
  );
}
