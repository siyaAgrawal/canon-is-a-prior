import Link from "next/link";
import { Shell } from "@/components/ui/primitives";
import { groupLabel, places } from "@/lib/journey";

export default function NotFound() {
  const groups = ["explore", "thread", "record"] as const;
  return (
    <Shell className="py-28">
      <div className="max-w-column">
        <p className="kicker">404</p>
        <h1 className="mt-5 font-display text-d2">Nothing here.</h1>
        <p className="say mt-6 max-w-measure">
          Unambiguous, for once. The rest of the site is about the harder case.
        </p>
        <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-3">
          {groups.map((g) => (
            <div key={g}>
              <p className="kicker mb-3">{groupLabel[g]}</p>
              <ul>
                {places
                  .filter((p) => p.group === g)
                  .map((p) => (
                    <li key={p.href}>
                      <Link href={p.href} className="block py-1.5 text-[0.95rem] hover:opacity-70">
                        {p.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
