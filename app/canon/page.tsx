import type { Metadata } from "next";
import { ChapterHead, Reading, Shell, PullQuote, Rule, NoteCard, Annotation } from "@/components/ui/primitives";
import { JourneyNav } from "@/components/ui/JourneyNav";
import { Reveal } from "@/components/ui/Reveal";
import { CounterfactualEngine } from "@/components/canon/CounterfactualEngine";
import { PremiseTree } from "@/components/canon/PremiseTree";
import { canonModules } from "@/data/canon";

export const metadata: Metadata = {
  title: "Rewrite the canon",
  description:
    "Change one assumption in Icarus or in the Iliad and watch which readings have to move with it — and which don't.",
};

export default function CanonPage() {
  const [icarus, achilles] = canonModules;

  return (
    <>
      <ChapterHead
        n="03"
        kicker="Counterfactuals"
        title="Rewrite the canon"
        standfirst="A canon hands you a model before you have read anything. Here you can change exactly one assumption inside it and watch how much else has to move — which is the narrative version of perturbing a parameter and seeing which predictions survive."
      />

      <Shell className="mt-14">
        <Reading>
          <Reveal>
            <div className="prose-note">
              <p>
                Retelling is not a modern hobby. The Greek tragedians were rewriting Homer, Ovid was
                rewriting everybody, and the reason the material survives at all is that each
                generation found it worth reorganising. What contemporary fanfiction adds is scale
                and, unusually, explicit labelling: thousands of variants of one source, most of them
                stating up front which premise they changed.
              </p>
              <p>
                Read as a corpus, that is an odd and rather valuable object — a systematic
                exploration of the space of readings a fixed text will support. This chapter borrows
                the method and strips it down to one operation: alter a single assumption, hold
                everything else constant, and see what moves.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="my-12">
              <PremiseTree
                branches={["what the fall means", "who Icarus is", "what Daedalus did", "what it is for"]}
              />
            </div>
          </Reveal>
        </Reading>
      </Shell>

      <Shell className="mt-8">
        <Reveal>
          <article className="card p-6 sm:p-10">
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-rule pb-6">
              <h2 className="font-display text-3xl leading-none">{icarus.title}</h2>
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink-ghost">
                Module 01 · four premises
              </p>
            </div>
            <CounterfactualEngine module={icarus} />
          </article>
        </Reveal>
      </Shell>

      <Shell className="mt-20">
        <Reading>
          <Reveal>
            <PullQuote>Changing one premise can reorganise an entire explanatory model.</PullQuote>
          </Reveal>
          <Reveal>
            <div className="prose-note">
              <p>
                Notice what did not happen. Nobody added an event, removed a character, or contested
                a line of the text. The four narrative facts stayed exactly where they were. What
                changed was one assumption about motive — and four other readings moved with it,
                without being adjusted individually.
              </p>
              <p>
                That is the signature of a model rather than a list. In a list, facts are independent
                and you can revise one without touching the rest. In a model they are load-bearing:
                pull on one and the structure redistributes. It is the same reason a single anomalous
                measurement can be absorbed by a theory or can bring it down, depending entirely on
                where in the structure it lands.
              </p>
            </div>
          </Reveal>

          <Rule label="A harder case" />

          <Reveal>
            <div className="prose-note">
              <p>
                Icarus is a clean case because Ovid gives us the acts and almost none of the
                interior. The next module is harder, because the gap in the text is one that readers
                have been filling — and arguing about — for two and a half thousand years.
              </p>
            </div>
          </Reveal>
        </Reading>
      </Shell>

      <Shell className="mt-12">
        <Reveal>
          <article className="card p-6 sm:p-10">
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-rule pb-6">
              <h2 className="font-display text-3xl leading-none">{achilles.title}</h2>
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink-ghost">
                Module 02 · four premises
              </p>
            </div>
            <CounterfactualEngine module={achilles} />
          </article>
        </Reveal>
      </Shell>

      <Shell className="mt-20">
        <Reading>
          <Reveal>
            <NoteCard title="The part that has to be said carefully" tone="warn">
              <p>
                The Iliad does not use a term for what Achilles and Patroclus are to each other that
                maps onto any modern category. Later antiquity supplied several and disagreed:
                Aeschylus took a position in the lost <em>Myrmidons</em>, and Plato&rsquo;s{" "}
                <em>Symposium</em> has Phaedrus take a different one and say so.
              </p>
              <p>
                So the honest statement is not &ldquo;the text says&rdquo; and not &ldquo;all
                readings are equal&rdquo;. It is that the text leaves a gap, the gap has a documented
                history of being filled differently, and a reading can be well-motivated, historically
                situated and still not the poem&rsquo;s own. Pretending otherwise in either direction
                would be the exact error this project exists to notice.
              </p>
            </NoteCard>
          </Reveal>

          <Reveal>
            <h2 className="mt-16 text-display-m">So is any reading available?</h2>
            <div className="prose-note mt-6">
              <p>
                No — and the constraint is visible in the engine above. Every premise carries a note
                saying what it cannot absorb. The freedom reading of Icarus has to admit that Ovid
                gives the boy no grievance and no speech. The accident reading has to explain away a
                text that describes him drawn upward. The tactical reading of the armour has to
                account for the commanders Achilles refused.
              </p>
              <p>
                Those are not decorations. They are the literary equivalent of a prediction a theory
                got wrong: the places where the reading has to pay something. A reading that pays
                nothing anywhere is not the strongest one — it is usually the one that has stopped
                making contact with the text.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-12">
              <Annotation tone="indigo">
                Next: the same operation, performed on physics, where it was a category rather than a
                motive that had to give.
              </Annotation>
            </div>
          </Reveal>
        </Reading>
      </Shell>

      <JourneyNav pathname="/canon" />
    </>
  );
}
