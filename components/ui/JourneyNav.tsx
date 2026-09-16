import Link from "next/link";
import { neighbours } from "@/lib/journey";
import { Shell } from "./primitives";

export function JourneyNav({ pathname }: { pathname: string }) {
  const { prev, next } = neighbours(pathname);
  if (!prev && !next) return null;

  return (
    <nav aria-label="Journey" className="mt-24 border-t border-rule-soft pt-8">
      <Shell>
        <div className="grid gap-6 sm:grid-cols-2">
          {prev ? (
            <Link href={prev.href} className="group block">
              <span className="eyebrow">← Previously — {prev.n}</span>
              <span className="mt-2 block font-display text-xl leading-snug group-hover:text-rust">{prev.title}</span>
              <span className="mt-1 block text-[0.84rem] text-ink-faint">{prev.line}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={next.href} className="group block sm:text-right">
              <span className="eyebrow">Next — {next.n} →</span>
              <span className="mt-2 block font-display text-xl leading-snug group-hover:text-rust">{next.title}</span>
              <span className="mt-1 block text-[0.84rem] text-ink-faint">{next.line}</span>
            </Link>
          )}
        </div>
      </Shell>
    </nav>
  );
}
