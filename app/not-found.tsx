import Link from "next/link";
import { Shell, Reading } from "@/components/ui/primitives";
import { journey } from "@/lib/journey";

export default function NotFound() {
  return (
    <Shell className="py-24 sm:py-32">
      <Reading>
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-display-l">This page does not exist.</h1>
        <p className="lede mt-6">
          Which is at least unambiguous. Most of the rest of this site is about the harder case,
          where several answers fit and nothing settles it.
        </p>
        <nav className="mt-12">
          <p className="eyebrow mb-4">Try one of these</p>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {journey.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="flex gap-3 border-b border-rule-soft py-2.5 hover:text-rust">
                  <span className="mt-[3px] font-mono text-[0.62rem] tracking-widest text-ink-ghost tabular">
                    {s.n}
                  </span>
                  <span className="font-display text-[1.02rem] leading-snug">{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Reading>
    </Shell>
  );
}
