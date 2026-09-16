import type { Metadata } from "next";
import { ChapterHead, Reading, Shell, PullQuote, NoteCard, Rule } from "@/components/ui/primitives";
import { JourneyNav } from "@/components/ui/JourneyNav";
import { Reveal } from "@/components/ui/Reveal";
import { Term } from "@/components/ui/Glossary";
import { BeliefExperiment } from "@/components/experiment/BeliefExperiment";
import { StorageNotice } from "@/components/experiment/StorageNotice";
import { AggregateResults } from "@/components/viz/AggregateResults";
import { getScenario } from "@/data";

export const metadata: Metadata = {
  title: "Same evidence, different reading",
  description:
    "Can two people rationally update differently from identical evidence? A scenario built so that the sources themselves disagree.",
};

export default function UnderdeterminationPage() {
  const scenario = getScenario("orpheus-turn")!;

  return (
    <>
      <ChapterHead
        n="05"
        kicker="Underdetermination"
        title="Same evidence. Different reading."
        standfirst="Two careful people can receive identical evidence and end up in different places without either of them having made a mistake. That is a stronger claim than it sounds, and it is worth doing before reading about."
      />

      <Shell className="mt-14">
        <Reading>
          <Reveal>
            <p className="prose-note">
              The scenario below was chosen because the two surviving classical accounts of it
              assign different causes to the same act. Ovid says he turned in fear for her; Virgil
              says a sudden madness took him. There is no third source to adjudicate. Whatever you
              conclude, you will be concluding it from a record that does not contain the answer.
            </p>
          </Reveal>
        </Reading>
      </Shell>

      <Shell className="mt-12">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <StorageNotice />
          </Reveal>
          <Reveal>
            <article className="card p-6 sm:p-9">
              <header className="mb-8 border-b border-rule-soft pb-7">
                <h2 className="font-display text-2xl leading-tight">{scenario.title}</h2>
                <p className="prose-note mt-4">{scenario.context}</p>
                <p className="mt-5 border-l-2 border-ink/25 pl-4 font-display text-[1.14rem] leading-[1.5]">
                  {scenario.stimulus}
                </p>
              </header>
              <BeliefExperiment scenario={scenario} />
            </article>
          </Reveal>
        </div>
      </Shell>

      <Shell className="mt-16">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <AggregateResults scenario={scenario} />
          </Reveal>
        </div>
      </Shell>

      <Shell className="mt-20">
        <Reading>
          <Reveal>
            <h2 className="text-display-m">Can two people rationally update differently from the same evidence?</h2>
            <div className="prose-note mt-6">
              <p>
                Yes, and Bayes&rsquo; rule shows you exactly how. The posterior depends on two inputs.
                Two people who start from different priors will end up in different places even if
                they agree perfectly about how much the evidence discriminates. Two people who start
                identically will still diverge if they disagree about how expected the evidence would
                be under each reading — which is usually a disagreement about how people behave, not
                about the text.
              </p>
              <p>
                Neither of those is an error. They are the rule working as specified. What the rule
                does guarantee is something narrower and still useful: given your inputs, your output
                is forced. You cannot keep both a prior and a likelihood and refuse the conclusion
                they entail. That is a real constraint, and it is why making the inputs explicit is
                worth the discomfort — disagreements become locatable instead of atmospheric.
              </p>
            </div>
          </Reveal>

          <Rule label="The formal version" />

          <Reveal>
            <div className="prose-note">
              <p>
                In philosophy of science this has a name.{" "}
                <Term term="Underdetermination">
                  The thesis that a body of evidence can be consistent with more than one theory, so
                  the evidence alone does not select between them. Weak versions are uncontroversial;
                  strong versions — that there are always empirically equivalent rivals — are
                  disputed.
                </Term>{" "}
                Duhem made the point that hypotheses never face evidence alone: a prediction requires
                the hypothesis plus assumptions about your instruments, your background theory, and
                the conditions. When the prediction fails, something in that bundle is wrong, and the
                failure does not say which.
              </p>
              <p>
                Quine pushed it further: any statement can be held true come what may, if you are
                willing to make enough adjustments elsewhere in the web of belief. That is not a
                licence — it is a description of a cost. You can always save a reading. The question
                is what you had to give up to do it, and whether the result is still doing any work.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <PullQuote>
              Interpretations are constrained by evidence. Evidence does not always determine a single
              interpretation.
            </PullQuote>
          </Reveal>

          <Reveal>
            <div className="my-10">
              <NoteCard title="The thing this is not saying" tone="warn">
                <p>
                  Underdetermination is not the claim that all readings are equally good. Most
                  readings are eliminated immediately — by the text, by the record, by the
                  implausibility of the behaviour they require. The claim is about what happens after
                  elimination has done all it can: sometimes several readings remain, and the
                  evidence has genuinely run out.
                </p>
                <p>
                  The failure mode in one direction is pretending the evidence settled something it
                  didn&rsquo;t. The failure mode in the other is treating &ldquo;the evidence
                  doesn&rsquo;t fully settle it&rdquo; as permission to believe anything. Both are
                  available and this project is trying to avoid both.
                </p>
              </NoteCard>
            </div>
          </Reveal>

          <Reveal>
            <div className="prose-note">
              <p>
                Which sets up the next question sharply. If humans faced with genuinely
                underdetermined evidence stay divided — and the data above will eventually say
                whether they do — what does a language model do with the same material? It is
                unusually good at producing a reading that sounds settled. Whether it should sound
                settled is testable.
              </p>
            </div>
          </Reveal>
        </Reading>
      </Shell>

      <JourneyNav pathname="/underdetermination" />
    </>
  );
}
