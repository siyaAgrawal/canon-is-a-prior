import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHead, Reading, Shell, NoteCard } from "@/components/ui/primitives";
import { JourneyNav } from "@/components/ui/JourneyNav";
import { Reveal } from "@/components/ui/Reveal";
import { Term } from "@/components/ui/Glossary";
import { Dashboard } from "@/components/viz/Dashboard";

export const metadata: Metadata = {
  title: "The data",
  description:
    "Everything participants have actually shown, and nothing they haven't. Live from the dataset, including when the dataset is empty.",
};

const METRICS = [
  {
    term: "Total variation distance",
    plain:
      "How far one set of probabilities is from another. Add up the differences across all the readings and halve it. Zero means identical; one means no overlap at all. It is used here for both 'how much did you move' and 'how far apart are two people'.",
  },
  {
    term: "Disagreement",
    plain:
      "Take every possible pair of participants, measure the distance between their distributions, and average. High disagreement means the same evidence produced different readings.",
  },
  {
    term: "Spread (entropy)",
    plain:
      "How much someone is hedging. Putting equal weight on every reading is maximum spread; putting everything on one is zero. Shown as a percentage of the maximum for that scenario's number of options, so scenarios with different option counts stay comparable.",
  },
  {
    term: "Kullback–Leibler divergence",
    plain:
      "A measure of how much one probability distribution differs from another, in bits. It is not symmetric — the distance from A to B is not the distance from B to A — which makes it useful for asking how surprised you would have been by the new distribution if you had expected the old one. Wherever it appears here it is computed with additive smoothing, because participants assign zeroes and the unsmoothed version would be infinite.",
  },
];

export default function DataPage() {
  return (
    <>
      <ChapterHead
        n="07"
        kicker="The dataset"
        title="The data"
        standfirst="Everything on this page is computed from stored responses at the moment you load it. If the numbers are small, the numbers are small. Nothing here is illustrative."
      />

      <Shell className="mt-14">
        <Reveal>
          <Dashboard />
        </Reveal>
      </Shell>

      <Shell className="mt-24">
        <Reading>
          <Reveal>
            <h2 className="text-display-m">What the measurements mean</h2>
            <p className="prose-note mt-5">
              Statistical vocabulary is a way of being precise, not a way of sounding serious. Every
              quantity used on this site is defined here in plain English, and where a measure has a
              known defect the defect is stated rather than managed.
            </p>
          </Reveal>

          <dl className="mt-10">
            {METRICS.map((m, i) => (
              <Reveal key={m.term} delay={i * 0.04}>
                <div className="border-t border-rule-soft py-6">
                  <dt className="font-display text-lg">{m.term}</dt>
                  <dd className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">{m.plain}</dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal>
            <div className="mt-10">
              <NoteCard title="What is deliberately not computed" tone="warn">
                <p>
                  There are no significance tests, no p-values and no confidence intervals on this
                  page. With a sample this size they would be decoration, and a decorated number is
                  more misleading than a bare one.
                </p>
                <p>
                  There is also no accuracy score of any kind. Scoring an interpretation for accuracy
                  needs a correct answer, and these scenarios are built not to have one. A{" "}
                  <Term term="proper scoring rule">
                    A rule for grading probabilistic forecasts that is designed so the best strategy
                    is to report what you actually believe. The Brier score is the standard example.
                    All of them require knowing what happened.
                  </Term>{" "}
                  cannot be applied to a question with no ground truth, and applying one anyway would
                  be the most respectable-looking mistake available here.
                </p>
              </NoteCard>
            </div>
          </Reveal>

          <Reveal>
            <p className="prose-note mt-10">
              The full dataset is exportable as CSV or JSON by the project owner, in long format —
              one row per response, per stage, per interpretation — so it goes into pandas or R
              without reshaping. The{" "}
              <Link href="/lab" className="underline decoration-dotted underline-offset-2">
                lab page
              </Link>{" "}
              states what the analysis can and cannot support, and the{" "}
              <Link href="/ethics" className="underline decoration-dotted underline-offset-2">
                ethics statement
              </Link>{" "}
              covers what is stored about you, which is very little.
            </p>
          </Reveal>
        </Reading>
      </Shell>

      <JourneyNav pathname="/data" />
    </>
  );
}
