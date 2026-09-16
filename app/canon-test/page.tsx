import type { Metadata } from "next";
import Link from "next/link";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell, Boundary } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";
import { StorageNotice } from "@/components/experiment/StorageNotice";
import { CanonTest } from "@/components/canontest/CanonTest";

export const metadata: Metadata = {
  title: "The Canon Test",
  description:
    "You think you've found a pattern. Eight questions that make you say what it would take to be wrong.",
};

const ORIGINS = [
  ["Fanfiction", "Same evidence, different assumption, different person. Step 02 is this.", "/versions"],
  ["Icarus", "The events held still and the premise moved. Step 03 is this.", "/rewrite"],
  ["Two models", "Both fit everything; nothing available separated them. Step 04 and 05 are this.", "/discriminate"],
  ["The seventh specimen", "The options themselves were the wrong shape. Step 06 is this.", "/categories"],
  ["The claims audit", "Three of my own connections were fabricated and passed. All of it is this.", "/shape"],
];

export default function CanonTestPage() {
  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Shell>
          <div className="max-w-column">
            <p className="kicker">Level III · the protocol</p>
            <h1 className="mt-5 font-display text-d2">
              You think you&rsquo;ve found a pattern. Now what?
            </h1>
            <div className="say mt-8 max-w-measure">
              <p>
                Eight questions. Seven have no right answer. One does, and it is the one almost
                everybody gets wrong.
              </p>
              <p>
                There is no score at the end and there will not be one. A number would be the exact
                error this project is about, wearing the costume of its cure.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Tag kind="open" />
              <span className="max-w-measure text-[0.8rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                Whether this protocol actually helps is itself untested. That study is described
                below, and it is the one I expect to come back negative.
              </span>
            </div>
          </div>
        </Shell>
      </section>

      <Shell className="mt-16">
        <Reveal>
          <StorageNotice />
          <div className="max-w-column">
            <CanonTest />
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-32">
        <Reveal>
          <div className="max-w-column">
            <h2 className="font-display text-d3">Every step came from somewhere on this site.</h2>
            <p className="say mt-6 max-w-measure">
              None of it was designed in the abstract. Each question is a place where one of these
              experiments went wrong, or nearly did.
            </p>
            <ul className="mt-10">
              {ORIGINS.map(([title, note, href]) => (
                <li key={href} className="hair py-5">
                  <Link href={href} className="group grid gap-x-8 gap-y-1 sm:grid-cols-[10rem_1fr]">
                    <span className="font-display text-[1.06rem] transition-opacity group-hover:opacity-70">
                      {title} →
                    </span>
                    <span className="text-[0.92rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                      {note}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hair" />
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column space-y-12">
            <Boundary title="Does this actually help? Nobody knows.">
              <p>
                A protocol that feels rigorous is not the same as one that works, and the genre it
                belongs to has a bad record. Most critical-thinking interventions that report success
                have moved a <em>threshold</em> rather than improved <em>discrimination</em> — people
                become warier of everything, reject more of both the good and the bad, and accuracy on
                the bad rises as a side effect.
              </p>
              <p>
                So the study attached to this separates two quantities. <strong>Sensitivity</strong>:
                can you tell a fabricated connection from a defended one at all. <strong>Bias</strong>:
                how willing you are to accept anything. A protocol that raises the first is useful. One
                that only lowers the second has made you harder to convince without making you better
                at judging, which is worse than nothing.
              </p>
              <p style={{ color: "rgb(var(--fg))" }}>
                I expect the null. If it comes back that way, that is a finding about a whole genre of
                thinking tools, and it stays on the{" "}
                <Link href="/discovery">findings page</Link> marked as one.
              </p>
            </Boundary>

            <div>
              <h2 className="font-display text-d4">How it will be tested</h2>
              <ol className="say mt-6 max-w-measure space-y-3">
                <li>
                  <strong>1.</strong> Judge a set of structural claims cold, on{" "}
                  <Link href="/shape">the audit</Link>. Some are defended, some fabricated.
                </li>
                <li>
                  <strong>2.</strong> Half of sessions then work through this protocol. The other half
                  spend comparable time on an unrelated task — so practice and fatigue are controlled
                  rather than assumed away.
                </li>
                <li>
                  <strong>3.</strong> Judge a second, matched set.
                </li>
                <li>
                  <strong>4.</strong> Compare the change in sensitivity and the change in bias across
                  the two arms.
                </li>
              </ol>
              <p className="mt-6 max-w-measure text-[0.86rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                Within-subject and pre/post, because between-subject arms on a site people choose to
                visit differ by who chose to arrive.
              </p>
            </div>

            <Boundary title="The confound I cannot fix from here">
              <p>
                The fabricated claims and the defended ones share an author, and the author knew which
                was which while writing them. So &ldquo;people accept the fabrications&rdquo; might
                measure nothing about reasoning and everything about one person writing fluent fakes.
              </p>
              <p>
                Partial remedy: participants also rate each claim on whether it names a mechanism and
                whether they could say what would falsify it. If acceptance tracks those surface
                features equally for real and fabricated claims, the confound is doing the work, and
                the analysis says so rather than reporting the headline.
              </p>
              <p>
                The real fix is a second author writing controls blind. That is not built, so it is not
                claimed.
              </p>
            </Boundary>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/canon-test" />
    </>
  );
}
