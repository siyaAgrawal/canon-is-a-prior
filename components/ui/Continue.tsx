import Link from "next/link";
import { onward, places } from "@/lib/journey";

/**
 * Where the thought continues. Not previous/next — every route is reachable from
 * the index at any time, so this is a suggestion, never the only way forward.
 */
export function Continue({ from }: { from: string }) {
  const next = (onward[from] ?? [])
    .map((href) => places.find((p) => p.href === href))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (next.length === 0) return null;

  return (
    <nav aria-label="Continue" className="mt-28">
      <div className="shell">
        <div className="hair pt-8">
          <p className="kicker mb-7">The thread continues</p>
          <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {next.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="group block">
                  <span
                    className="block font-display text-d4 transition-colors"
                    style={{ color: "rgb(var(--fg))" }}
                  >
                    <span className="group-hover:opacity-70">{p.title} →</span>
                  </span>
                  <span
                    className="mt-1.5 block max-w-measure text-[0.86rem] leading-snug"
                    style={{ color: "rgb(var(--faint))" }}
                  >
                    {p.line}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
