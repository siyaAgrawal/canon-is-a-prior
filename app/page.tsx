import Link from "next/link";
import { Sure } from "@/components/origin/Sure";
import { SameEvidence } from "@/components/origin/SameEvidence";
import { ScaleBreak } from "@/components/shape/ScaleBreak";
import { Reveal } from "@/components/ui/Reveal";
import { Shell } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";
import { Pulse } from "@/components/research/Pulse";

/**
 * The arc: ambiguous word → interpretation → fanfiction → character → the other
 * five cases → the suspicion. Nothing is explained before it has been done.
 */
/**
 * Each rung is a question the previous answer created. This is the actual
 * intellectual sequence rather than a subject list, which is why none of these
 * is named after a discipline.
 */
const LADDER = [
  {
    q: "You began somewhere. Evidence arrived. You moved.",
    a: "There is a formal rule for that part, and it is exact: the update is forced once you have a hypothesis set and a sense of how expected the evidence is under each.",
    href: "/sure",
    label: "Do it properly, forty-two times",
  },
  {
    q: "But where did the hypotheses come from?",
    a: "The rule redistributes belief across options you already had. It cannot generate the one you hadn't thought of — and on the homepage above, I chose the five.",
    href: "/versions",
    label: "Build one from seven facts",
  },
  {
    q: "And what if two of them fit everything?",
    a: "Then nothing you currently have separates them, and more of the same evidence never will.",
    href: "/discriminate",
    label: "Design the observation that would",
  },
  {
    q: "What if the options were the wrong shape?",
    a: "A third kind of revision, rarer and more expensive than changing your answer or changing your model. It happened once, in public, to physics.",
    href: "/categories",
    label: "Sort the seventh specimen",
  },
  {
    q: "What if a machine builds the story instead?",
    a: "It will be coherent. Coherence is what it is optimised for, and coherence is the property people use as a proxy for all the others.",
    href: "/machines",
    label: "Same evidence, two readers",
  },
];

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

      {/* ── 6 · The ladder ───────────────────────────────────────────────── */}
      <section className="pt-32">
        <Shell>
          <Reveal>
            <div className="max-w-column">
              <h2 className="font-display text-d3">Every answer opened a worse question.</h2>
              <ol className="mt-12">
                {LADDER.map((r, i) => (
                  <li key={r.q} className="hair grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[2.5rem_1fr]">
                    <span className="font-mono text-[0.62rem] tabular" style={{ color: "rgb(var(--faint))" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-display text-d5 leading-snug">{r.q}</span>
                      <span className="mt-2 block max-w-measure text-[0.9rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                        {r.a}
                      </span>
                      {r.href && (
                        <Link href={r.href} className="btn-quiet mt-3">
                          {r.label} →
                        </Link>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="hair" />
            </div>
          </Reveal>
        </Shell>
      </section>

      {/* ── 7 · The uncomfortable turn ───────────────────────────────────── */}
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

              <div className="mt-14 max-w-column">
                <Pulse />
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-6">
                <Link href="/shape" className="btn btn-solid">
                  Try to break it
                </Link>
                <Link href="/discovery" className="btn-quiet">
                  Or see what we actually know
                </Link>
              </div>
            </div>
          </Reveal>
        </Shell>
      </section>
    </>
  );
}
