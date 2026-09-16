import Link from "next/link";
import { SameEvidence } from "@/components/origin/SameEvidence";
import { ScaleBreak } from "@/components/shape/ScaleBreak";
import { Reveal } from "@/components/ui/Reveal";
import { Shell } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";
import { places } from "@/lib/journey";

export default function Home() {
  const doors = places.filter((p) => ["/versions", "/rewrite", "/shape", "/map"].includes(p.href));

  return (
    <>
      <section className="pb-24 pt-10 sm:pt-16">
        <Shell>
          <SameEvidence />
        </Shell>
      </section>

      <section className="py-24">
        <Shell>
          <Reveal>
            <div className="max-w-column">
              <h2 className="font-display text-d3">I thought I was reading stories.</h2>
              <div className="say mt-8 max-w-measure">
                <p>
                  Hundreds of thousands of words of fanfiction, mostly one pairing, written by
                  strangers who had all read the same seven books and disagreed completely about who
                  was in them.
                </p>
                <p>Then I noticed I was doing it to Icarus.</p>
                <p>Then to a physics problem.</p>
                <p>Then to a dataset.</p>
                <p style={{ color: "rgb(var(--fg))" }}>Then to someone I knew.</p>
              </div>
            </div>
          </Reveal>
        </Shell>
      </section>

      <section className="pb-28">
        <Shell>
          <Reveal>
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
              <p className="kicker">Six cases. In none of them does the evidence change.</p>
              <Tag kind="interpretation" />
            </div>
            <ScaleBreak />
          </Reveal>
        </Shell>
      </section>

      <section className="pb-28">
        <Shell>
          <Reveal>
            <div className="max-w-column">
              <h2 className="font-display text-d3">
                Six things with nothing to do with each other.
              </h2>
              <div className="say mt-8 max-w-measure">
                <p>
                  I keep finding the same move in all of them, and I have not been able to decide
                  whether that is a discovery or a symptom.
                </p>
                <p>
                  Because this is what it feels like from the inside when someone has found a pattern
                  that is not there. The shape gets clearer the more examples you add. Examples are
                  easy to add. Adding them feels like evidence.
                </p>
                <p style={{ color: "rgb(var(--fg))" }}>
                  So the first thing I built was not an argument for the connection. It was an
                  instrument for prosecuting it.
                </p>
              </div>
            </div>
          </Reveal>
        </Shell>
      </section>

      <section className="pb-32">
        <Shell>
          <Reveal>
            <div className="hair pt-10">
              <p className="kicker mb-8">Start anywhere</p>
              <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {doors.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="group block">
                      <span className="block font-display text-d4">
                        <span className="transition-opacity group-hover:opacity-70">{p.title} →</span>
                      </span>
                      <span
                        className="mt-2 block max-w-measure text-[0.88rem] leading-snug"
                        style={{ color: "rgb(var(--faint))" }}
                      >
                        {p.line}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Shell>
      </section>
    </>
  );
}
