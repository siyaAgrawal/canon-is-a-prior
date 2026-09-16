import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHead, Reading, Shell, PullQuote, Rule, NoteCard, Annotation } from "@/components/ui/primitives";
import { JourneyNav } from "@/components/ui/JourneyNav";
import { Reveal } from "@/components/ui/Reveal";
import { Term } from "@/components/ui/Glossary";
import { BayesMachine } from "@/components/experiment/BayesMachine";

export const metadata: Metadata = {
  title: "Why call it a prior?",
  description:
    "What you did in the experiment, written down: prior, likelihood, posterior — and the thing Bayesian updating cannot give you.",
};

const DOMAINS = [
  {
    field: "In science",
    body: "A model determines what counts as signal and what counts as noise before any measurement is taken. You cannot design an experiment without already having decided what would be surprising.",
  },
  {
    field: "In reading",
    body: "A canonical interpretation arrives with the text. You have heard that Icarus is about pride before you have read a line of Ovid, and the reading shapes what you notice when you do.",
  },
  {
    field: "In ordinary life",
    body: "Everything you already know about a person is what makes their forty-minute silence mean something. The same silence from a stranger means nothing at all.",
  },
  {
    field: "In a language model",
    body: "The training distribution determines what reading is available before your particular context arrives. It functions as a prior in the loose sense — but it is implicit, not normalised over any stated set of hypotheses, and the model cannot report it.",
  },
];

export default function BayesPage() {
  return (
    <>
      <ChapterHead
        n="02"
        kicker="What you just did"
        title="Why call it a prior?"
        standfirst="You started somewhere. Evidence arrived. You moved, or you didn't. There is a formal version of that operation, and it is worth meeting after doing it rather than before."
      />

      <Shell className="mt-14">
        <Reading>
          <Reveal>
            <p className="prose-note">
              What you performed in the last chapter was a simplified{" "}
              <Term term="Bayesian update">
                Redistributing your belief across a fixed set of explanations when new evidence
                arrives, in a way that keeps the total at one hundred percent. &ldquo;Simplified&rdquo;
                here means you supplied the numbers by intuition rather than deriving them — which is
                what makes it an experiment about people rather than a calculation.
              </Term>
              . Simplified because you were not asked to justify the size of any move. The structure,
              though, was the real thing: a starting position, evidence, a revised position.
            </p>
          </Reveal>

          <Reveal>
            <figure className="my-12 border-y border-rule py-10 text-center">
              <p className="font-display text-3xl sm:text-4xl">
                P(H | E) <span className="text-ink-ghost">∝</span> P(E | H) <span className="text-ink-ghost">·</span> P(H)
              </p>
              <figcaption className="mx-auto mt-6 max-w-measure text-left text-[0.88rem] leading-relaxed text-ink-faint">
                <span className="text-ink">H</span> is a hypothesis — one of the readings.{" "}
                <span className="text-ink">E</span> is the evidence.{" "}
                <span className="text-ink">P(H)</span> is how plausible the reading was before.{" "}
                <span className="text-ink">P(E | H)</span> is how expected the evidence would be if
                that reading were right. <span className="text-ink">P(H | E)</span> is where you end
                up. The <span className="text-ink">∝</span> means &ldquo;in proportion to&rdquo;: work
                out that product for every reading, then scale them so they total one hundred.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal>
            <p className="prose-note">
              The useful thing about writing it down is not the arithmetic. It is that the rule makes
              visible exactly two places where a judgement enters — where you started, and how
              expected the evidence is under each explanation — and it makes everything else
              mechanical. Disagreements about interpretation almost always turn out to live in one of
              those two places.
            </p>
          </Reveal>
        </Reading>
      </Shell>

      <Shell className="mt-12">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <BayesMachine />
          </Reveal>
        </div>
      </Shell>

      <Shell className="mt-20">
        <Reading>
          <Reveal>
            <PullQuote>Updating is not the same as discovering certainty.</PullQuote>
          </Reveal>

          <Reveal>
            <div className="prose-note">
              <p>
                Bayes&rsquo; rule is a bookkeeping constraint. It tells you how your beliefs must
                move together if they are to stay coherent — it does not tell you that any of them
                are true. Feed it a bad prior and it returns a carefully updated bad prior. Feed it a
                hypothesis list that omits the correct explanation and it will distribute one hundred
                percent of your confidence across explanations that are all wrong, without any
                internal signal that this has happened.
              </p>
              <p>
                That last point is not a technicality; it is the limit of the whole framework.{" "}
                <Term term="Peirce">
                  Charles Sanders Peirce (1839–1914), who called the step that generates a new
                  hypothesis &ldquo;abduction&rdquo; and argued it was a distinct form of inference
                  from both deduction and induction.
                </Term>{" "}
                called the missing step abduction: the moment where a new candidate explanation gets
                invented in the first place. Nothing in the rule above can do that. It can only move
                weight between options you have already written down.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="my-10">
              <NoteCard title="Which is why the experiment gave you a fixed list" tone="warn">
                <p>
                  Four readings of Icarus, and no box to write a fifth. That is a real limitation of
                  the instrument, and it is on the limitations page rather than buried here. Every
                  participant is working inside a hypothesis space somebody else chose — which is,
                  awkwardly, also a fair description of what a canon does to a reader.
                </p>
              </NoteCard>
            </div>
          </Reveal>

          <Rule label="Where priors come from" />

          <Reveal>
            <p className="prose-note">
              A prior is not a mistake to be eliminated. It is the thing that makes evidence mean
              anything at all — forty minutes of silence is only informative against a background of
              what usually happens. The question is never whether you have one. It is whether you can
              say what yours is.
            </p>
          </Reveal>

          <div className="mt-10 space-y-0">
            {DOMAINS.map((d, i) => (
              <Reveal key={d.field} delay={i * 0.04}>
                <div className="grid gap-2 border-t border-rule-soft py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-rust">{d.field}</p>
                  <p className="text-[0.92rem] leading-relaxed text-ink-soft">{d.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <h2 className="mt-16 text-display-m">Can we ever approach evidence without assumptions?</h2>
            <div className="prose-note mt-6">
              <p>
                The honest answer is no, and the interesting answer is that this is less damaging
                than it sounds. A prior is not a bias in the pejorative sense; it is compressed
                previous evidence. What makes it dangerous is not its existence but its invisibility
                — a starting position you cannot state is one you cannot revise, and one nobody else
                can argue with.
              </p>
              <p>
                This is also the strongest version of the claim in this project&rsquo;s title. Not
                that a canon is a probability distribution — it isn&rsquo;t, and{" "}
                <Link href="/map" className="underline decoration-dotted underline-offset-2">
                  the map marks that edge as analogical
                </Link>{" "}
                for exactly that reason. The claim is narrower: a canonical reading does the job a
                prior does. It determines how much work a new reading has to do before it will be
                taken seriously, and it is not itself the product of the evidence it governs.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-12">
              <Annotation tone="gold">
                Next: what happens when you change one thing in the story the prior came from.
              </Annotation>
            </div>
          </Reveal>
        </Reading>
      </Shell>

      <JourneyNav pathname="/bayes" />
    </>
  );
}
