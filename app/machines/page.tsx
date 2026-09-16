import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { MachineTrack } from "@/components/experiment/MachineTrack";
import { languageScenarios } from "@/data";
import { hypotheses } from "@/research/lab";

export const metadata: Metadata = {
  title: "Humans and models",
  description:
    "The same ambiguous evidence given to people and to a language model, under identical constraints.",
};

export default function MachinesPage() {
  const relevant = hypotheses.filter((h) => h.id === "h3" || h.id === "h4");

  return (
    <>
      <PageHead
        title="Humans and models"
        tag={<Tag kind="hypothesis" />}
        note={
          <p>
            A model handed ambiguous evidence has to emit something, and what it emits is fluent.
            Whether it should be that fluent is testable, and the honest answer today is that nobody
            here knows.
          </p>
        }
      />

      <Shell className="mt-14">
        <Reveal>
          <div className="max-w-column">
            <div className="say max-w-measure">
              <p>
                This is the only experiment on the site that records anything. Everything else runs in
                your browser and vanishes.
              </p>
              <p>
                Two predictions, written before any data existed, both of which could be wrong in
                interesting ways:
              </p>
            </div>
            <ul className="mt-8 space-y-6">
              {relevant.map((h) => (
                <li key={h.id} className="border-l-2 border-indigo pl-5">
                  <p className="text-[0.96rem] leading-relaxed text-ink">{h.statement}</p>
                  <p className="mt-2 max-w-measure text-[0.84rem] leading-relaxed text-ink-faint">
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-rust">
                      Wrong if —{" "}
                    </span>
                    {h.wouldBeWrongIf}
                  </p>
                </li>
              ))}
            </ul>
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
            <p className="statement">Three things this cannot establish.</p>
            <div className="say mt-7 max-w-measure">
              <p>
                <strong>Not calibration.</strong> Calibration means stated probabilities match
                observed frequencies. That requires knowing the answer. These scenarios have none, by
                construction.
              </p>
              <p>
                <strong>Not understanding.</strong> Nothing here tests whether a model understands
                anything. It tests what numbers come out when you ask for numbers.
              </p>
              <p>
                <strong>Not a result.</strong> One run is one sample from a stochastic process. Runs
                are stored separately and shown separately, because the spread between them is part of
                whatever the finding turns out to be.
              </p>
            </div>
            <p className="mt-8 max-w-measure text-[0.84rem] leading-relaxed text-ink-faint">
              Prompt wording changes what a model reports as confidence, so every stored run is pinned
              to a prompt version and runs from different versions are never pooled. Details and the
              current counts are on the{" "}
              <Link href="/lab" className="underline decoration-dotted underline-offset-2 hover:text-ink">
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
