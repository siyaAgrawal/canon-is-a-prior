import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHead, Reading, Shell, PullQuote, NoteCard, Annotation, Rule } from "@/components/ui/primitives";
import { JourneyNav } from "@/components/ui/JourneyNav";
import { Reveal } from "@/components/ui/Reveal";
import { Complementarity } from "@/components/physics/Complementarity";

export const metadata: Metadata = {
  title: "When the category breaks",
  description:
    "De Broglie, wave–particle duality, and what happens when phenomena resist the categories available to describe them.",
};

export default function CategoryPage() {
  return (
    <>
      <ChapterHead
        n="04"
        kicker="Physics"
        title="When the category breaks"
        standfirst="Sometimes evidence does not choose between the explanations you have. Sometimes it indicates that the explanations were the wrong shape. This is the cleanest historical example of the second thing, and it is not the story it is usually told as."
      />

      <Shell className="mt-14">
        <Reading>
          <Reveal>
            <p className="font-display text-display-m">Is it a wave, or a particle?</p>
            <p className="prose-note mt-6">
              The question sounds like it has to have an answer, and for most of the nineteenth
              century it did. Light was a wave — Young&rsquo;s interference experiment had settled
              it, and Maxwell had explained it. Matter was made of particles. Two categories, each
              with its own mathematics, each applying to its own half of the world.
            </p>
          </Reveal>

          <Reveal>
            <div className="prose-note mt-4">
              <p>
                Then light started behaving badly. The photoelectric effect, explained by Einstein in
                1905, showed light depositing its energy in discrete lumps whose size depended on
                frequency rather than brightness — behaviour a wave should not show. Compton
                scattering in 1923 showed X-rays recoiling off electrons the way one billiard ball
                recoils off another.
              </p>
              <p>
                In 1924 Louis de Broglie made the move that is easy to state and was extremely hard
                to make. If something everyone agreed was a wave turns out to also carry momentum in
                lumps, why should the reverse not hold? He proposed that a particle of momentum{" "}
                <em>p</em> has an associated wavelength <em>λ = h/p</em>, where <em>h</em> is
                Planck&rsquo;s constant. Not as a metaphor. As a quantity you could go and measure.
              </p>
              <p>
                Three years later Davisson and Germer fired electrons at a nickel crystal and got a
                diffraction pattern, and G. P. Thomson got one independently the same year. The
                wavelength came out where de Broglie said it would.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="my-10">
              <NoteCard title="What this is not" tone="warn">
                <p>
                  It is not that scientists thought particles were particles until de Broglie
                  discovered they were really waves. Nothing was replaced. The relation ties a
                  particle property — momentum — to a wave property — wavelength — in a single
                  equation, which is a stranger result than a substitution would have been.
                </p>
                <p>
                  Nor was it a lone genius versus an establishment: Einstein read the thesis, thought
                  it was right, and said so to Schrödinger, who took the idea and built a wave
                  equation out of it within eighteen months. The category moved because the community
                  had already accumulated results the old categories could not hold.
                </p>
              </NoteCard>
            </div>
          </Reveal>
        </Reading>
      </Shell>

      <Shell className="mt-6">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Complementarity />
          </Reveal>
        </div>
      </Shell>

      <Shell className="mt-20">
        <Reading>
          <Reveal>
            <h2 className="text-display-m">Why must the question have only two answers?</h2>
            <div className="prose-note mt-6">
              <p>
                Bohr&rsquo;s answer, in 1928, was complementarity: the wave and particle descriptions
                are both necessary and cannot both be applied at once, and which one is available
                depends on the experimental arrangement. That is one interpretation of the formalism
                and it is influential rather than final — how to interpret quantum mechanics is still
                genuinely open, and anyone who tells you otherwise is selling a position.
              </p>
              <p>
                What is not open is the structure the slider above shows. Path information and fringe
                visibility are not two states you toggle between; they are two quantities whose
                squares sum to at most one. You can have some of each. What you cannot do is have all
                of both, and no amount of better apparatus changes that.
              </p>
              <p>
                So &ldquo;is it a wave or a particle&rdquo; turns out not to be a question the world
                declined to answer. It is a question whose form assumed something false: that the two
                descriptions were mutually exclusive alternatives, exactly one of which had to apply.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <PullQuote>The evidence did not choose between the categories. It indicated that the categories were the wrong shape.</PullQuote>
          </Reveal>

          <Rule label="And back to reading" />

          <Reveal>
            <div className="prose-note">
              <p>
                Hold that structure next to the previous chapter. &ldquo;Is Icarus curious or
                prideful?&rdquo; has the same grammar as &ldquo;is it a wave or a particle?&rdquo; —
                a demand that one of two categories apply. And it may have the same defect. A boy can
                be delighted by height and overconfident about wax in the same motion; the categories
                were built for sorting people into moral bins, not for describing what a person is
                doing while they climb.
              </p>
              <p>
                This is an analogy and it is worth being exact about how far it goes. In physics the
                constraint is a theorem, derived and experimentally tested, and it makes numerical
                predictions. In reading there is no theorem — only the observation that a question
                can carry a false assumption in its form, and that noticing this is a different move
                from answering it.{" "}
                <Link href="/map" className="underline decoration-dotted underline-offset-2">
                  The connection map marks this edge as analogical
                </Link>{" "}
                and names the disanalogy, rather than letting the resemblance do work it cannot do.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-12">
              <Annotation>
                So: what happens when the categories we inherited stop fitting the evidence — and how
                do you tell that case apart from simply not having enough evidence yet?
              </Annotation>
            </div>
          </Reveal>
        </Reading>
      </Shell>

      <JourneyNav pathname="/category" />
    </>
  );
}
