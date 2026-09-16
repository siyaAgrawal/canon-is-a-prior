import type { Metadata } from "next";
import Link from "next/link";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell, Boundary } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";
import { StorageNotice } from "@/components/experiment/StorageNotice";
import { Discriminate } from "@/components/discriminate/Discriminate";

export const metadata: Metadata = {
  title: "Two models, same evidence",
  description:
    "Both explanations fit everything you have been told. Design the observation that would tell them apart.",
};

export default function DiscriminatePage() {
  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Shell>
          <div className="max-w-column">
            <p className="kicker">Level III · justification</p>
            <h1 className="mt-5 font-display text-d2">
              More evidence is not the same as better evidence.
            </h1>
            <p className="say mt-7 max-w-measure">
              Two explanations. Both account for everything. The question is not which one you like
              — it is what you would have to go and look at.
            </p>
            <div className="mt-7">
              <Tag kind="hypothesis" />
            </div>
          </div>
        </Shell>
      </section>

      <Shell className="mt-14">
        <Reveal>
          <StorageNotice />
          <Discriminate />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column space-y-12">
            <Boundary title="Why this is the hardest instrument here">
              <p>
                Everywhere else on this site the measurement is how far a belief moved. That is
                Level II, and Bayes&rsquo; rule describes it completely — given a hypothesis set and
                a likelihood, the update is forced.
              </p>
              <p>
                This page is Level III. It asks what would make one of two surviving models{" "}
                <em>better supported</em> than the other, when nothing you currently have separates
                them. No updating rule answers that, because the answer is not in the evidence you
                have. It is in the evidence you would have to go and get.
              </p>
            </Boundary>

            <div>
              <h2 className="font-display text-d4">What this can measure</h2>
              <div className="say mt-6 max-w-measure">
                <p>
                  A proposed test either separates the two models or it does not, and that is a fact
                  about the test rather than a judgement about the person. So unlike almost
                  everything else on this site, there is a gradable response here.
                </p>
                <p>
                  Several of the non-discriminating options were written to be vivid, specific, and
                  clearly relevant — because that is what makes more-evidence feel like
                  better-evidence. If people reliably pick those, that is a finding, and it is the
                  one this instrument exists to look for.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-d4">Where the cases are weak</h2>
              <div className="say mt-6 max-w-measure">
                <p>
                  Two cases is not a study. The candidate tests are written by one person who knows
                  which answer is correct, which is the classic route to an instrument that measures
                  its author&rsquo;s intuitions. And a stipulated outcome is not an observation —
                  nothing was run; the world is a paragraph I wrote.
                </p>
                <p>
                  What survives all that is narrow and still worth having: whether people
                  distinguish confirming evidence from discriminating evidence when both are on the
                  same screen.{" "}
                  <Link href="/shape">The page that attacks this project</Link> is the right place to
                  press on it.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/discriminate" />
    </>
  );
}
