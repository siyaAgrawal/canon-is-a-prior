import Link from "next/link";
import { OpeningDemo } from "@/components/experiment/OpeningDemo";
import { Reveal } from "@/components/ui/Reveal";
import { Annotation, PullQuote, Reading, Shell } from "@/components/ui/primitives";
import { journey } from "@/lib/journey";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <Shell className="pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <p className="eyebrow animate-fade-up">An open experiment · begun September 2026</p>

              <h1 className="mt-6 text-display-xl animate-fade-up" style={{ animationDelay: "60ms" }}>
                The Canon
                <br />
                Is a Prior
              </h1>

              <p
                className="mt-7 max-w-measure font-display text-xl leading-[1.5] text-ink-soft animate-fade-up sm:text-2xl"
                style={{ animationDelay: "140ms" }}
              >
                How do we decide what a story means when the evidence is incomplete?
              </p>

              <div className="mt-8 max-w-measure animate-fade-up" style={{ animationDelay: "220ms" }}>
                <p className="prose-note">
                  Every interpretation begins somewhere. You arrive at a myth, a message, a
                  measurement, already carrying something — a default reading, an expectation, a
                  prior. Then evidence arrives.
                </p>
                <p className="prose-note mt-4">
                  Sometimes it should move you. Sometimes it shouldn&rsquo;t. Sometimes there
                  isn&rsquo;t enough of it to settle anything, and you build a coherent story anyway.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-5 animate-fade-up" style={{ animationDelay: "300ms" }}>
                <Link href="/experiment" className="btn border-ink bg-ink text-paper hover:bg-transparent hover:text-ink">
                  Begin the experiment
                </Link>
                <Link href="/lab" className="btn-quiet">
                  Read the method first
                </Link>
              </div>

              <p
                className="mt-14 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-ink-ghost animate-fade-up"
                style={{ animationDelay: "380ms" }}
              >
                Physics. Myth. Inference. AI.
              </p>
            </div>

            <div className="animate-fade-up lg:pt-10" style={{ animationDelay: "260ms" }}>
              <OpeningDemo />
              <Annotation className="mt-5" tone="indigo">
                This is the whole idea in miniature. The rest of the site is the same operation,
                performed on things that matter more and settle less.
              </Annotation>
            </div>
          </div>
        </Shell>
      </section>

      <Shell>
        <div className="border-t border-rule-soft" />
      </Shell>

      <section className="py-20 sm:py-24">
        <Shell>
          <Reading>
            <Reveal>
              <p className="eyebrow">The question this is actually about</p>
              <h2 className="mt-4 text-display-m">
                When evidence is incomplete, how do humans and machines revise their
                interpretations — and what makes one interpretation more justified than another?
              </h2>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="prose-note mt-8">
                <p>
                  In 1924 Louis de Broglie proposed that matter has a wavelength. The proposal was
                  strange not because the arithmetic was hard but because it required treating two
                  descriptions that had been used as alternatives — wave, particle — as applying to
                  the same objects. The evidence did not fit the available categories, and the
                  categories moved.
                </p>
                <p>
                  A canonical reading of Icarus says the story is about pride. That reading is also a
                  category, inherited rather than derived, and it determines what you notice in the
                  text before you have noticed anything. Change one assumption — say he climbs out of
                  curiosity rather than defiance — and the fall stops being a punishment and becomes
                  a price. The events are identical. The model is not.
                </p>
                <p>
                  Bayesian inference gives a precise language for the part these have in common: you
                  start somewhere, evidence arrives, and how far you move depends on how surprising
                  that evidence would be under each explanation you are entertaining.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <PullQuote>
                We take incomplete realities and construct stories that make intellectual sense. A
                coherent story is not the same thing as a true one.
              </PullQuote>
            </Reveal>

            <Reveal>
              <div className="prose-note">
                <p>
                  That gap is where this project lives. Language models are extremely good at
                  producing coherent readings of ambiguous material — that is close to a description
                  of what they do. So the interesting empirical question is not whether a model can
                  interpret. It is whether a model&rsquo;s confidence behaves like a person&rsquo;s
                  when the evidence genuinely does not settle the matter.
                </p>
                <p>
                  This site puts identical scenarios in front of both and records what happens. As of
                  today it has collected very little, and the pages that show results say so rather
                  than filling the space with something more impressive.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <p className="mt-10 border-l-2 border-rust pl-5 font-display text-lg leading-snug">
                We do not know what the experiment will find yet. That is not a disclaimer. That is
                the experiment.
              </p>
            </Reveal>
          </Reading>
        </Shell>
      </section>

      <section className="pb-24">
        <Shell>
          <div className="border-t border-rule-soft pt-10">
            <p className="eyebrow">The route through</p>
            <ol className="mt-6 grid gap-x-10 gap-y-0 md:grid-cols-2">
              {journey.slice(1).map((s, i) => (
                <Reveal as="li" key={s.href} delay={i * 0.02}>
                  <Link
                    href={s.href}
                    className="group flex gap-4 border-b border-rule-soft py-4 transition-colors hover:text-rust"
                  >
                    <span className="mt-1 font-mono text-[0.64rem] tracking-[0.18em] text-ink-ghost tabular">{s.n}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[1.15rem] leading-snug">{s.title}</span>
                      <span className="mt-0.5 block text-[0.84rem] leading-snug text-ink-faint">{s.line}</span>
                    </span>
                    <span className="mt-1 shrink-0 font-mono text-[0.62rem] text-ink-ghost tabular">{s.minutes}m</span>
                  </Link>
                </Reveal>
              ))}
            </ol>
          </div>
        </Shell>
      </section>
    </>
  );
}
