import type { Metadata } from "next";
import Link from "next/link";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell, Boundary, Rule } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";
import { MachineTrack } from "@/components/experiment/MachineTrack";
import { languageScenarios } from "@/data";
import { hypotheses } from "@/research/lab";

export const metadata: Metadata = {
  title: "How interpretations move",
  description:
    "Which criterion you actually use, and what a language model does with the same ambiguous evidence.",
};

export default function MachinesPage() {
  const relevant = hypotheses.filter((h) => h.id === "h3" || h.id === "h4");

  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Shell>
          <div className="max-w-column">
            <p className="kicker">The comparison</p>
            <h1 className="mt-5 font-display text-d2">
              Given the same ambiguous evidence, how do a person and a model move?
            </h1>
            <p className="say mt-7 max-w-measure">
              Not which is smarter. Not which is more human. Just: what happens to each
              interpretation as the evidence arrives.
            </p>
          </div>
        </Shell>
      </section>

      <Shell className="mt-28">
        <Reveal>
          
          <div className="max-w-column">
            <div className="say max-w-measure">
              <p>
                Same ambiguous scenarios, to people and to a model, under the same constraint that
                the numbers total a hundred. Two predictions, written before any data existed:
              </p>
            </div>
            <ul className="mt-8 space-y-6">
              {relevant.map((h) => (
                <li key={h.id} className="border-l-2 pl-5" style={{ borderColor: "rgb(var(--accent))" }}>
                  <p className="text-[0.96rem] leading-relaxed" style={{ color: "rgb(var(--fg))" }}>
                    {h.statement}
                  </p>
                  <p className="mt-2 max-w-measure text-[0.84rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--accent))" }}>
                      Wrong if —{" "}
                    </span>
                    {h.wouldBeWrongIf}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Tag kind="hypothesis" />
            </div>
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-20">
        <Reveal>
          <MachineTrack scenarios={languageScenarios} />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column">
            <h2 className="font-display text-d3">Three things this cannot establish.</h2>
            <div className="say mt-7 max-w-measure">
              <p>
                <strong>Not calibration.</strong> That needs a right answer. These scenarios have
                none, by construction.
              </p>
              <p>
                <strong>Not understanding.</strong> This tests what numbers come out when you ask for
                numbers.
              </p>
              <p>
                <strong>Not a result.</strong> One run is one sample from a stochastic process. Runs
                are stored and shown separately, because the spread between them is part of whatever
                the finding turns out to be.
              </p>
            </div>
            <p className="mt-8 max-w-measure text-[0.84rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
              Prompt wording changes what a model reports as confidence, so every run is pinned to a
              prompt version and versions are never pooled. Counts are on the{" "}
              <Link href="/lab" className="underline decoration-dotted underline-offset-2">
                method page
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/machines" />
    </>
  );
}
