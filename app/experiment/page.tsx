import type { Metadata } from "next";
import { ChapterHead, Reading, Shell, Annotation, NoteCard } from "@/components/ui/primitives";
import { JourneyNav } from "@/components/ui/JourneyNav";
import { Reveal } from "@/components/ui/Reveal";
import { ExperimentRunner } from "@/components/experiment/ExperimentRunner";
import { StorageNotice } from "@/components/experiment/StorageNotice";
import { mythScenarios } from "@/data";

export const metadata: Metadata = {
  title: "Update your belief",
  description:
    "Assign probabilities to competing readings of a myth, then revise them as evidence arrives. The core experiment.",
};

export default function ExperimentPage() {
  return (
    <>
      <ChapterHead
        n="01"
        kicker="The experiment"
        title="Update your belief"
        standfirst="You are about to be given incomplete evidence and asked to interpret it anyway. There is no correct answer here and none will be revealed at the end, because none exists. What is being measured is movement."
      />

      <Shell className="mt-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
          <div className="min-w-0">
            <StorageNotice />
            <ExperimentRunner scenarios={mythScenarios} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <NoteCard title="How to use the sliders" tone="quiet">
                <p>
                  The values always total one hundred. Raising one lowers the others automatically,
                  in proportion to where they already were.
                </p>
                <p>
                  That constraint is deliberate and slightly uncomfortable. A scale that lets you
                  call everything plausible measures nothing — the discomfort is the instrument
                  working.
                </p>
              </NoteCard>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-6">
                <Annotation tone="indigo">
                  Keyboard: arrow keys move by one, page up and down by ten, home and end jump to the
                  extremes.
                </Annotation>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-8 border-t border-rule-soft pt-6">
                <p className="eyebrow mb-2">What gets stored</p>
                <p className="text-[0.82rem] leading-relaxed text-ink-faint">
                  A random identifier, the scenario, your distributions and the elapsed time. No
                  name, no account, no IP, no tracking cookie. You can leave without submitting and
                  nothing is recorded.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </Shell>

      <Shell className="mt-24">
        <Reading>
          <Reveal>
            <div className="border-t border-rule-soft pt-10">
              <p className="eyebrow">Before you go on</p>
              <p className="prose-note mt-4">
                Whatever you just did, you did it without being told a rule. You had a starting
                position, evidence arrived, and you moved — or you didn&rsquo;t. The next page is
                what that operation looks like written down properly, and what it turns out you
                cannot get from it.
              </p>
            </div>
          </Reveal>
        </Reading>
      </Shell>

      <JourneyNav pathname="/experiment" />
    </>
  );
}
