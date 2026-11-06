import Link from "next/link";
import { groupLabel, onward, places, stepFor, type Place } from "@/lib/journey";

/**
 * The end of every page: where you are on the suggested path, the stop before
 * and the stop after, and — kept from the earlier design — the two places the
 * thought most directly continues. The path is one route through, not the
 * route; every page stays two clicks away through the header.
 */
export function Continue({ from }: { from: string }) {
  const step = stepFor(from);
  const pathHrefs = [step?.prev?.href, step?.next?.href];
  const thread = (onward[from] ?? [])
    .filter((href) => !pathHrefs.includes(href))
    .map((href) => places.find((p) => p.href === href))
    .filter((p): p is Place => Boolean(p));

  return (
    <nav aria-label="Next and previous" className="mt-28">
      <div className="shell">
        <div className="hair pt-8">
          {step && (
            <>
              <p className="kicker mb-7">
                Suggested path · {step.index + 1} of {step.total}
              </p>
              <ul className="grid gap-4 sm:grid-cols-2">
                <li>
                  {step.prev ? (
                    <Tile place={step.prev} dir="prev" />
                  ) : (
                    <HomeTile label="Back to the beginning" />
                  )}
                </li>
                <li>
                  {step.next ? <Tile place={step.next} dir="next" /> : <HomeTile label="That was the last stop. Start again" />}
                </li>
              </ul>
            </>
          )}

          {thread.length > 0 && (
            <div className="mt-14">
              <p className="kicker mb-6">Or follow the thread</p>
              <ul className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
                {thread.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="group block">
                      <span className="block font-display text-d5 text-fg group-hover:opacity-70">{p.title} →</span>
                      <span className="mt-1 block max-w-measure text-[0.84rem] leading-snug text-faint">{p.line}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function Tile({ place, dir }: { place: Place; dir: "prev" | "next" }) {
  const next = dir === "next";
  return (
    <Link
      href={place.href}
      className={`group block h-full border p-5 transition-colors hover:bg-fg/[0.04] sm:p-6 ${next ? "sm:text-right" : ""}`}
      style={{ borderColor: next ? "rgb(var(--accent) / 0.5)" : "rgb(var(--line) / 0.22)" }}
    >
      <span className="block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
        {next ? `Next · ${groupLabel[place.group]} →` : `← Previous · ${groupLabel[place.group]}`}
      </span>
      <span className="mt-2 block font-display text-d4 text-fg">{place.title}</span>
      <span className="mt-1.5 block text-[0.84rem] leading-snug text-faint">{place.line}</span>
    </Link>
  );
}

function HomeTile({ label }: { label: string }) {
  return (
    <Link
      href="/"
      className="group block h-full border p-5 transition-colors hover:bg-fg/[0.04] sm:p-6"
      style={{ borderColor: "rgb(var(--line) / 0.22)" }}
    >
      <span className="block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">← Home</span>
      <span className="mt-2 block font-display text-d4 text-fg">{label}</span>
      <span className="mt-1.5 block text-[0.84rem] leading-snug text-faint">The “Sure.” opening.</span>
    </Link>
  );
}
