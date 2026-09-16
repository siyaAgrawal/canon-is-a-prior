import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHead, Reading, Shell, PullQuote, NoteCard, Rule, Annotation } from "@/components/ui/primitives";
import { JourneyNav } from "@/components/ui/JourneyNav";
import { Reveal } from "@/components/ui/Reveal";
import { LanguageTrack } from "@/components/experiment/LanguageTrack";
import { languageScenarios } from "@/data";
import { hypotheses } from "@/research/lab";

export const metadata: Metadata = {
  title: "Humans vs machines",
  description:
    "The same ambiguous scenarios, given to people and to a language model under identical constraints. Thirty-four original scenarios, no private messages, no fabricated results.",
};

export default function HumansVsMachinesPage() {
  const relevant = hypotheses.filter((h) => h.id === "h3" || h.id === "h4");

  return (
    <>
      <ChapterHead
        n="06"
        kicker="The comparison"
        title="Humans vs machines"
        standfirst="When the evidence is ambiguous, do humans and language models revise their interpretations in similar ways? The honest answer today is that nobody involved in this project knows, which is why the apparatus below exists."
      />

      <Shell className="mt-14">
        <Reading>
          <Reveal>
            <div className="prose-note">
              <p>
                A language model reading an ambiguous message is doing something structurally close
                to what you did two chapters ago. It has a learned expectation about what this kind
                of sentence usually means, it receives some context, and it produces an
                interpretation. Calling its training distribution a prior is loose — it is implicit,
                not normalised over any stated hypothesis space, and not something the model can
                report — but the role is genuinely similar.
              </p>
              <p>
                What differs, possibly, is what happens when the evidence is not enough. People often
                stay divided. A model has to emit something, and what it emits is fluent. Fluency is
                not evidence about anything except fluency, and yet it is extremely persuasive.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <PullQuote>Coherence is not certainty.</PullQuote>
          </Reveal>

          <Reveal>
            <div className="prose-note">
              <p>
                That sentence is the project&rsquo;s slogan and it is, right now, an intuition rather
                than a finding. So it has been written down as a pair of falsifiable predictions
                before any data exists, and both of them could be wrong in interesting ways.
              </p>
            </div>
          </Reveal>

          <div className="my-10 space-y-5">
            {relevant.map((h, i) => (
              <Reveal key={h.id} delay={i * 0.05}>
                <div className="border-l-2 border-indigo pl-5">
                  <p className="eyebrow text-indigo">Prediction {h.id.toUpperCase()}</p>
                  <p className="mt-2 text-[0.96rem] leading-relaxed text-ink">{h.statement}</p>
                  <p className="mt-2 text-[0.84rem] leading-relaxed text-ink-faint">
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-rust">
                      Wrong if —{" "}
                    </span>
                    {h.wouldBeWrongIf}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <NoteCard title="Where the scenarios come from" tone="quiet">
              <p>
                Thirty-four ambiguous situations, all written for this experiment. No real message,
                email, DM or chat log is used, and no participant&rsquo;s own material is collected.
                That rules out the richest possible dataset on purpose: the person who wrote a real
                message cannot consent to its use, and only the person who received it would ever be
                asked.
              </p>
              <p>
                The cost is artificiality, and it is a real cost. A written scenario is a model of an
                ambiguous exchange, not an instance of one. That limitation is listed on the{" "}
                <Link href="/lab" className="underline decoration-dotted underline-offset-2">
                  lab page
                </Link>{" "}
                rather than hidden here.
              </p>
            </NoteCard>
          </Reveal>
        </Reading>
      </Shell>

      <Shell className="mt-16">
        <Reveal>
          <LanguageTrack scenarios={languageScenarios} />
        </Reveal>
      </Shell>

      <Shell className="mt-24">
        <Reading>
          <Rule label="How the model side works" />
          <Reveal>
            <div className="prose-note">
              <p>
                The model is asked for numbers, not prose. A paragraph of considered interpretation
                cannot be compared with a slider position; a distribution can. It receives exactly
                what you received, in the same order, and it is told explicitly that there is no
                correct answer and that if the evidence does not discriminate it should say so by
                giving similar weight.
              </p>
              <p>
                Every stored run records the model identifier and a prompt version. That is not
                bureaucracy: elicited confidence from language models is known to be sensitive to how
                you ask, so runs from different prompt versions are never pooled. Changing the prompt
                starts a new version and a new series.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="my-10">
              <NoteCard title="Three things a model run here cannot establish" tone="warn">
                <p>
                  <strong>It is not calibration.</strong> Calibration means stated probabilities
                  match observed frequencies, and that requires knowing the right answer. These
                  scenarios have none, by construction.
                </p>
                <p>
                  <strong>It is not a claim about understanding.</strong> Nothing here tests whether a
                  model understands anything. It tests what numbers come out when you ask for numbers.
                </p>
                <p>
                  <strong>It is not a single result.</strong> One run is one sample from a stochastic
                  process. Several runs of the same scenario are stored separately and shown
                  separately, because the spread between them is part of the finding.
                </p>
              </NoteCard>
            </div>
          </Reveal>

          <Reveal>
            <div className="prose-note">
              <p>
                Running a model costs money, so the evaluation console is token-protected and cannot
                be triggered from these pages. If this deployment has no key configured, the
                comparison above says so and shows nothing — which is the correct behaviour, and also
                the state it is in most of the time.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-10">
              <Annotation tone="moss">
                The point of all this care is that the interesting outcome might be the one that
                embarrasses the hypothesis. A model that gets less certain when handed ambiguous
                context would be evidence against the whole worry — and it would still be worth
                publishing here.
              </Annotation>
            </div>
          </Reveal>
        </Reading>
      </Shell>

      <JourneyNav pathname="/humans-vs-machines" />
    </>
  );
}
