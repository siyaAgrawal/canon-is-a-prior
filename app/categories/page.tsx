import type { Metadata } from "next";
import Link from "next/link";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell, Boundary } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";
import { StorageNotice } from "@/components/experiment/StorageNotice";
import { CategoryFailure } from "@/components/physics/CategoryFailure";
import { Complementarity } from "@/components/physics/Complementarity";

export const metadata: Metadata = {
  title: "When the category breaks",
  description:
    "Sort six specimens. Then meet the seventh, which has the defining property of both kinds.",
};

export default function CategoriesPage() {
  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Shell>
          <div className="max-w-column">
            <p className="kicker">Level III · a third kind of revision</p>
            <h1 className="mt-5 font-display text-d2">
              Not every failure is a failure of the answer.
            </h1>
            <div className="say mt-7 max-w-measure">
              <p>
                Change the weights: a <strong>parameter</strong> update. Change the explanation: a{" "}
                <strong>model</strong> revision. Change what the options were: a{" "}
                <strong>category</strong> revision.
              </p>
              <p>The third one is rare, expensive, and never forced by the evidence.</p>
            </div>
          </div>
        </Shell>
      </section>

      <Shell className="mt-16">
        <Reveal>
          <StorageNotice />
          <CategoryFailure />
        </Reveal>
      </Shell>

      {/* Only now is the historical case named. */}
      <Shell className="mt-32">
        <Reveal>
          <div className="max-w-column">
            <div className="mb-6"><Tag kind="observed" /></div>
            <h2 className="font-display text-d3">This happened.</h2>
            <div className="say mt-7 max-w-measure">
              <p>
                For most of the nineteenth century light was a wave and matter was particles. Two
                categories, each with its own mathematics, each with its own half of the world.
              </p>
              <p>
                Then light started depositing energy in lumps sized by frequency, and X-rays started
                recoiling off electrons like billiard balls. In 1924 de Broglie proposed the reverse:
                a particle of momentum <em>p</em> has a wavelength <em>λ = h/p</em>. Not as an image
                — as a number. Davisson and Germer fired electrons at nickel three years later and
                the wavelength came out where he said it would.
              </p>
              <p style={{ color: "rgb(var(--fg))" }}>
                The anomaly was not in the electron. It was in a pair of words that had been treated
                as exhausting the options.
              </p>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-20">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <Complementarity />
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-24">
        <Reveal>
          <div className="max-w-column space-y-12">
            <Boundary title="What the toy above is not">
              <p>
                Seven invented specimens do not reproduce the history of quantum mechanics, and
                nothing you did on this page is evidence about physics. The sorting task is an
                illustration of a move; the physics is a case where the move was actually made, at
                enormous cost, over decades, against real resistance.
              </p>
              <p>
                The relation under the graph is the part that has no analogue anywhere else on this
                site: V² + D² ≤ 1 is derived, numerically precise, and experimentally tested. It says
                exactly how much of each description you can have. Nothing in reading has a theorem.
              </p>
            </Boundary>

            <div>
              <h2 className="font-display text-d4">And the thing this page must not say</h2>
              <div className="say mt-6 max-w-measure">
                <p>
                  Quantum mechanics does not show that reality is subjective, that all
                  interpretations are equally valid, or that observation creates the world. Anyone
                  telling you it does is selling something, and the interesting fact is strange
                  enough without help.
                </p>
                <p>
                  The claim here is narrower and historical: sometimes an anomaly is best treated as
                  a defect in the available vocabulary rather than in the object. That has happened.{" "}
                  <Link href="/shape">Whether it is the same move this project keeps finding
                  elsewhere</Link> is exactly what is in doubt.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/categories" />
    </>
  );
}
