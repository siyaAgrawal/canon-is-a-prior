import Link from "next/link";
import { Sure } from "@/components/origin/Sure";
import { SameEvidence } from "@/components/origin/SameEvidence";
import { ScaleBreak } from "@/components/shape/ScaleBreak";
import { Reveal } from "@/components/ui/Reveal";
import { Shell } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";

/**
 * The arc: ambiguous word → interpretation → fanfiction → character → the other
 * five cases → the suspicion. Nothing is explained before it has been done.
 */
export default function Home() {
  return (
    <>
      {/* ── 1 · The word ─────────────────────────────────────────────────── */}
      <section className="pt-10 sm:pt-14">
        <Shell>
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h1 className="font-display text-[1.6rem] tracking-tight sm:text-[1.9rem]">
              The Canon Is a Prior
            </h1>
            <p className="max-w-measure text-[0.86rem] leading-snug" style={{ color: "rgb(var(--faint))" }}>
              An open investigation into how we build versions of things from incomplete evidence —
              and whether the pattern it keeps finding is really there.
            </p>
          </div>
          <div className="mt-14 sm:mt-20">
            <Sure />
          </div>
        </Shell>
      </section>

      {/* ── 2 · The turn into the origin ─────────────────────────────────── */}
      <section className="pt-28 sm:pt-36">
        <Shell>
          <Reveal>
            <div className="max-w-column">
              <h2 className="font-display text-d3">I thought I was reading fanfiction.</h2>
              <div className="say mt-8 max-w-measure">
                <p>
                  Hundreds of thousands of words of it. Mostly one pairing, written by strangers who
                  had all read the same seven books and disagreed completely about who was in them.
                </p>
                <p>
                  Not disagreed about the events — nobody changes those. Disagreed about what the
                  events were evidence of.
                </p>
              </div>
            </div>
          </Reveal>
        </Shell>
      </section>

      {/* ── 3 · Same evidence, different person ──────────────────────────── */}
      <section className="pt-16 sm:pt-20">
        <Shell>
          <SameEvidence />
        </Shell>
      </section>

      {/* ── 4 · I did it again ───────────────────────────────────────────── */}
      <section className="pt-32">
        <Shell>
          <Reveal>
            <div className="max-w-column">
              <h2 className="font-display text-d3">Then I did it to Icarus.</h2>
              <div className="say mt-8 max-w-measure">
                <p>
                  The wings, the warning, the climb, the wax, the sea. Nobody disputes any of it.
                </p>
                <p>
                  Three thousand years of the story meaning <em>pride</em> rests on an assumption the
                  text does not state.
                </p>
              </div>
              <Link href="/rewrite" className="btn mt-9">
                Climb with him →
              </Link>
            </div>
          </Reveal>
        </Shell>
      </section>

      {/* ── 5 · And again ────────────────────────────────────────────────── */}
      <section className="pt-32">
        <Shell>
          <Reveal>
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-d3">And again. And again.</h2>
              <Tag kind="interpretation" />
            </div>
            <ScaleBreak />
          </Reveal>
        </Shell>
      </section>

      {/* ── 6 · The uncomfortable turn ───────────────────────────────────── */}
      <section className="py-32">
        <Shell>
          <Reveal>
            <div className="max-w-column">
              <p className="say max-w-measure">
                Six things with almost nothing to do with one another. I keep finding the same move
                in all of them.
              </p>
              <p className="say mt-5 max-w-measure">
                Which leaves one problem, and it is the reason this site exists rather than an essay.
              </p>

              <p className="mt-12 font-display text-d2" style={{ color: "rgb(var(--accent))" }}>
                What if the connection isn&rsquo;t there?
              </p>

              <p className="say mt-8 max-w-measure">
                Because this is exactly what it feels like from the inside when someone has found a
                pattern that is not. It gets clearer with every example. Examples are easy to add.
                Adding them feels like evidence.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-6">
                <Link href="/shape" className="btn btn-solid">
                  Is the shape really there?
                </Link>
                <Link href="/about" className="btn-quiet">
                  Or start at the beginning
                </Link>
              </div>
            </div>
          </Reveal>
        </Shell>
      </section>
    </>
  );
}
