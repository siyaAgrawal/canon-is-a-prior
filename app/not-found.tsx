import Link from "next/link";
import { Shell } from "@/components/ui/primitives";
import { territories } from "@/lib/journey";

export default function NotFound() {
  return (
    <Shell className="py-28">
      <div className="max-w-column">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-ghost">404</p>
        <p className="statement mt-5">Nothing here.</p>
        <p className="say mt-6 max-w-measure">
          Unambiguous, for once. The rest of the site is about the harder case, where several things
          fit and nothing settles it.
        </p>
        <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {territories.map((t) => (
            <div key={t.id}>
              <p className="eyebrow mb-2">{t.label}</p>
              <ul>
                {t.places.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="block py-1.5 text-[0.95rem] hover:text-rust">
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
