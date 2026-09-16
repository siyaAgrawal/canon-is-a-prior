import type { Metadata } from "next";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { AIConsole } from "@/components/experiment/AIConsole";
import { allScenarios } from "@/data";

export const metadata: Metadata = {
  title: "Model console",
  description: "Where the machine half of the experiment is run. Token-protected.",
  robots: { index: false, follow: false },
};

export default function ConsolePage() {
  return (
    <>
      <PageHead
        title="Model console"
        note={
          <p>
            Visible so the method can be inspected, operable only with the research token. There is
            no demo mode: with no key configured it refuses and says so rather than generating a
            plausible trajectory and labelling it a sample.
          </p>
        }
      />
      <Shell className="mt-12">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <AIConsole scenarios={allScenarios} />
          </Reveal>
        </div>
      </Shell>
    </>
  );
}
