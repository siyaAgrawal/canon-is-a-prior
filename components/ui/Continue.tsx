import Link from "next/link";
import { allPlaces, continuations } from "@/lib/journey";
import { Shell } from "./primitives";

/**
 * Where this page's argument actually continues.
 *
 * Deliberately not previous/next. There is no sequence, and pretending there is
 * one was what made the first build feel like a syllabus. Each page names two
 * places chosen because the thought carries on there.
 */
export function Continue({ from }: { from: string }) {
  const next = (continuations[from] ?? [])
    .map((href) => allPlaces.find((p) => p.href === href))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (next.length === 0) return null;

  return (
    <nav aria-label="Continue" className="mt-24">
      <Shell>
        <div className="hair pt-8">
          <p className="eyebrow mb-6">From here</p>
          <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {next.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="group block">
                  <span className="block font-display text-display-s group-hover:text-rust">{p.title}</span>
                  <span className="mt-1 block max-w-measure text-[0.85rem] leading-snug text-ink-faint">
                    {p.line}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Shell>
    </nav>
  );
}
