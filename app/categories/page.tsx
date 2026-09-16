import type { Metadata } from "next";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { Complementarity } from "@/components/physics/Complementarity";

export const metadata: Metadata = {
  title: "When the category breaks",
  description:
    "de Broglie, and what happens when an inherited pair of words stops fitting the evidence.",
};

export default function CategoriesPage() {
  return (
    <>
      <section className="pt-[16vh] pb-0">
        <Shell>
          <div className="max-w-column">
            <h1 className="statement">Is it a wave or a particle?</h1>
            <p className="say mt-8 max-w-measure">
              For most of the nineteenth century that question had an answer, and the answer depended
              on what you were asking about. Light was a wave. Matter was particles. Two categories,
              each with its own mathematics, each with its own half of the world.
            </p>
          </div>
        </Shell>
      </section>

      <Shell className="mt-20">
        <Reveal>
          <div className="max-w-column">
            <div className="say max-w-measure">
              <p>
                Then light started behaving badly. The photoelectric effect had it depositing energy
                in lumps sized by frequency rather than brightness. Compton had X-rays recoiling off
                electrons like billiard balls.
              </p>
              <p>
                In 1924 de Broglie made the move. If something everybody agreed was a wave carries
                momentum in lumps, why not the reverse? A particle of momentum <em>p</em> has a
                wavelength <em>λ = h/p</em>. Not as an image. As a number you could go and measure.
              </p>
              <p>
                Davisson and Germer fired electrons at nickel three years later and got a diffraction
                pattern. G. P. Thomson got one independently the same year. The wavelength came out
                where he said it would.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Tag kind="observed" />
              <span className="text-[0.8rem] text-faint">
                Sourced. Thesis, both 1927 experiments, and Bohr&rsquo;s 1928 paper are on the sources
                list.
              </span>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-24">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <Complementarity />
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-24">
        <Reveal>
          <div className="max-w-column">
            <p className="statement">The anomaly was not in the electron.</p>
            <div className="say mt-8 max-w-measure">
              <p>
                It was in two words that had been treated as exhausting the options. &ldquo;Wave or
                particle&rdquo; is not a question the world declined to answer. It is a question whose
                form assumed something false.
              </p>
              <p>
                Which is the only reason this page is here. Not because quantum mechanics says
                something about interpretation — it does not, and anyone telling you it proves
                reality is subjective is selling something — but because this is the cleanest
                recorded case of the failure being in the categories rather than the object.
              </p>
            </div>

            <div className="mt-12 border-l-2 border-sun/60 pl-6">
              <div className="mb-3"><Tag kind="analogy" /></div>
              <p className="say max-w-measure text-[0.95rem]">
                And here the comparison stops hard. The trade-off above is a relation — derived,
                numerically precise, experimentally tested. It states exactly how much of each
                description you can have. Nothing in reading has anything like it. No theorem tells
                you how much &ldquo;curious&rdquo; costs you in &ldquo;prideful&rdquo;.
              </p>
              <p className="mt-4 max-w-measure text-[0.88rem] leading-relaxed text-faint">
                So this is a good illustration of a move and a bad model of one. It is marked{" "}
                <em>weakened</em> on the claims page for exactly that reason.
              </p>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/categories" />
    </>
  );
}
