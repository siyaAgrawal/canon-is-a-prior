import type { Metadata } from "next";
import { IcarusAscent } from "@/components/myth/IcarusAscent";
import { CounterfactualEngine } from "@/components/canon/CounterfactualEngine";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell, Boundary } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";
import { Recorded } from "@/components/ui/Recorded";
import { canonModules } from "@/data/canon";

export const metadata: Metadata = {
  title: "Icarus",
  description: "Climb. Change why he climbed. The fall stays exactly where it was.",
};

export default function RewritePage() {
  const achilles = canonModules[1];

  return (
    <>
      <section className="pt-16">
        <Shell>
          <div className="max-w-column">
            <p className="kicker">Ovid, Metamorphoses VIII — paraphrased</p>
            <h1 className="mt-5 font-display text-d2">Scroll. He goes up.</h1>
            <p className="say mt-6 max-w-measure">
              Four events, fixed. Change what he wanted and none of them move — but every one of
              them means something else.
            </p>
          </div>
        </Shell>
      </section>

      <IcarusAscent />

      <Shell className="mt-24">
        <Reveal>
          <div className="max-w-column">
            <h2 className="font-display text-d3">Nobody added an event.</h2>
            <div className="say mt-7 max-w-measure">
              <p>
                That is what separates a model from a list. In a list, facts are independent — revise
                one and the rest sit still. In a model they are load-bearing. Pull one and the whole
                structure redistributes.
              </p>
              <p style={{ color: "rgb(var(--fg))" }}>
                Three thousand years of this story meaning pride rests on an assumption the text does
                not state.
              </p>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-d4">{achilles.title}</h2>
            <p className="kicker">Harder — the gap is older than the readings</p>
          </div>
          <CounterfactualEngine module={achilles} />
        </Reveal>
      </Shell>

      <Shell className="mt-24">
        <Reveal>
          <div className="max-w-column">
            <Boundary title="So can a premise do anything?">
              <p>
                No. Every premise on this page names what it cannot absorb — the freedom reading has
                to admit Ovid gives the boy no grievance; the accident reading has to explain away a
                text describing him reaching for the sky.
              </p>
              <p>
                Those are the places a reading has to pay. One that pays nothing anywhere is not the
                strongest available. It is usually the one that has stopped touching the text.
              </p>
            </Boundary>
            <div className="mt-10">
              <Recorded what="Which premises you opened, and how long you spent climbing." />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Tag kind="analogy" />
              <span className="max-w-measure text-[0.8rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                Calling that &ldquo;paying&rdquo; borrows accounting from science, where a failed
                prediction can be observed. A reading&rsquo;s cost cannot be. The resemblance is in
                the bookkeeping, not the evidence.
              </span>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/rewrite" />
    </>
  );
}
