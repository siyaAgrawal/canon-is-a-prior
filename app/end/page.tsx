import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHead, Reading, Shell } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { FinalChoice } from "@/components/ui/FinalChoice";

export const metadata: Metadata = {
  title: "There is no final canon",
  description:
    "Interpretations are constrained by evidence, but evidence does not always determine a single interpretation. The distinction is the whole point.",
};

export default function EndPage() {
  return (
    <>
      <ChapterHead
        n="11"
        kicker="The end, provisionally"
        title="There is no final canon"
        standfirst="Which does not mean anything can mean anything. It means something more specific and less comfortable than that."
      />

      <Shell className="mt-14">
        <Reading>
          <Reveal>
            <figure className="border-y border-rule py-12 text-center">
              <p className="font-display text-display-m leading-[1.15]">
                Interpretations are constrained by evidence,
                <br className="hidden sm:block" /> but evidence does not always determine a single
                interpretation.
              </p>
            </figure>
          </Reveal>

          <Reveal>
            <div className="prose-note mt-12">
              <p>
                Both halves are load-bearing. Drop the first and you get the relativism this project
                has been avoiding for eleven chapters — a world where the accident reading of Icarus
                is as good as any other, despite the text saying otherwise. Drop the second and you
                get a different error, the more respectable one: the belief that enough rigour will
                eventually squeeze a single answer out of any question, so anyone still undecided
                has simply not thought hard enough.
              </p>
              <p>
                The scenarios on this site are built to sit exactly between those. Several readings
                are eliminated immediately. Of the ones left, the evidence sometimes picks a winner
                and sometimes runs out first. Telling those two situations apart is the skill, and
                there is no rule for it.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="my-16 border-l-2 border-rust pl-6 sm:pl-8">
              <p className="font-display text-2xl leading-[1.45] sm:text-3xl">
                You began with a belief.
                <br />
                Then the evidence moved it.
                <br />
                <span className="text-ink-faint">Sometimes it should.</span>
                <br />
                <span className="text-ink-faint">Sometimes it shouldn&rsquo;t.</span>
                <br />
                <span className="text-ink-faint">Sometimes the evidence isn&rsquo;t enough.</span>
                <br />
                And sometimes the category itself needs rewriting.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="text-display-m">So what do you do when the evidence doesn&rsquo;t fit the story?</h2>
            <p className="prose-note mt-5">
              There are four moves. None of them is the answer, and the entire difficulty is working
              out which situation you are in.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-10">
              <FinalChoice />
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-20 border-t border-rule pt-10">
              <p className="eyebrow">Where this leaves the project</p>
              <div className="prose-note mt-4">
                <p>
                  Unfinished, and structurally so. The dataset is small or empty, the hypotheses are
                  written down and unanswered, and the model comparison has produced nothing yet. The
                  pages that report results report that they have none.
                </p>
                <p>
                  That is the only honest state for something like this to be in at the beginning,
                  and building it any other way would have required the one thing this project cannot
                  do — making the numbers up.
                </p>
              </div>
              <p className="mt-8 font-display text-2xl">We don&rsquo;t know yet.</p>
              <p className="mt-2 text-[0.92rem] text-ink-faint">That is not a failure. That is the experiment.</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-14 flex flex-wrap gap-4">
              <Link href="/humans-vs-machines" className="btn">
                Add a response to the dataset
              </Link>
              <Link href="/log" className="btn-quiet">
                Researcher&rsquo;s log
              </Link>
              <Link href="/sources" className="btn-quiet">
                Sources
              </Link>
              <Link href="/about" className="btn-quiet">
                About this project
              </Link>
            </div>
          </Reveal>
        </Reading>
      </Shell>
    </>
  );
}
