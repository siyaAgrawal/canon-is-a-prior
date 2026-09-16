import type { Metadata } from "next";
import { ChapterHead, Reading, Shell, NoteCard } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { AIConsole } from "@/components/experiment/AIConsole";
import { allScenarios } from "@/data";

export const metadata: Metadata = {
  title: "Model evaluation console",
  description: "The instrument for running scenarios through a language model. Token-protected, and honest when unconfigured.",
  robots: { index: false, follow: false },
};

export default function AIConsolePage() {
  return (
    <>
      <ChapterHead
        n="—"
        kicker="Instrument"
        title="Model evaluation console"
        standfirst="Where the machine half of the experiment is run. Visible to everyone so the method can be inspected; operable only with the research token, because each run costs money."
      />

      <Shell className="mt-12">
        <Reading>
          <Reveal>
            <NoteCard title="There is no demo mode" tone="warn">
              <p>
                If no model API key is configured, this console refuses to run and says so. It does
                not generate a plausible trajectory and label it a sample. The model comparison is
                the central empirical claim of this project, and a single fabricated run would make
                every real one unreadable.
              </p>
            </NoteCard>
          </Reveal>
        </Reading>
      </Shell>

      <Shell className="mt-10">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <AIConsole scenarios={allScenarios} />
          </Reveal>
        </div>
      </Shell>
    </>
  );
}
