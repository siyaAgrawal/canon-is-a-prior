import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHead, Reading, Shell, Annotation } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Where this came from, what else is in the same drawer, and how to take it apart.",
};

const OTHER_WORK = [
  {
    name: "Khapee",
    line: "An ordering product that real people use.",
    body: "Built to find out what happens to a clean system when actual customers arrive. The interesting part was never the happy path — it was the order placed twice, the item that sells out mid-checkout, the person who does exactly what no flowchart anticipated.",
  },
  {
    name: "VAC",
    line: "A communication and AI project about tone and intent.",
    body: "Concerned with whether a machine can infer what someone meant rather than what they typed. Which is the same problem as the language track here, approached from the engineering side instead of the experimental one.",
  },
  {
    name: "The Canon Is a Prior",
    line: "This.",
    body: "An experiment about how interpretations change when evidence changes, and whether a machine's revisions look anything like a person's.",
  },
];

export default function AboutPage() {
  return (
    <>
      <ChapterHead
        n="—"
        kicker="About"
        title="Where this came from"
        standfirst="A folded sheet of paper, several coloured pens, and a suspicion that a connection was more than aesthetic."
      />

      <Shell className="mt-14">
        <Reading>
          <Reveal>
            <div className="prose-note">
              <p>
                I kept finding myself connecting ideas that were not supposed to belong together:
                wave and particle, myth and fanfiction, belief and probability, code and human
                behaviour. On paper it looked like a mind map. In my head it felt like one idea
                wearing different clothes.
              </p>
              <p>
                The suspicious part is that this feeling is cheap. Anything can be connected to
                anything if you are willing to be vague enough, and the sensation of insight is
                identical whether or not the connection survives being made precise. So the question
                became whether the connection was more than aesthetic — and the only way to find out
                was to make it specific enough to be wrong.
              </p>
              <p>
                Some of it did not survive. &ldquo;The canon is a prior&rdquo; as an equivalence is
                false, and the{" "}
                <Link href="/map" className="underline decoration-dotted underline-offset-2">
                  map marks that line dashed
                </Link>{" "}
                by its own rule. What survived is narrower and, I think, more interesting: a
                canonical reading does the job a prior does — it sets how much work a new reading has
                to do, and it is not itself the product of the evidence it governs.
              </p>
              <p>So I built an experiment to find out whether human and machine revisions look alike.</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="my-12 border-l-2 border-rust pl-6">
              <p className="font-display text-xl leading-[1.5]">
                I had a strange question. I followed the connection. Then I built something to find
                out whether I was right.
              </p>
              <p className="mt-4 text-[0.88rem] text-ink-faint">
                It is not finished, and it would be a worse project if it pretended to be.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="mt-16 text-display-m">Other work</h2>
            <p className="prose-note mt-4">
              These are separate projects and stay separate. What they have in common is a habit
              rather than a subject: build the system, watch where it breaks, and treat the edge case
              as the informative part rather than the annoying one.
            </p>
            <ul className="mt-10 space-y-8">
              {OTHER_WORK.map((w) => (
                <li key={w.name} className="grid gap-2 border-t border-rule-soft pt-5 sm:grid-cols-[10rem_1fr] sm:gap-8">
                  <div>
                    <p className="font-display text-lg leading-snug">{w.name}</p>
                    <p className="mt-1 text-[0.8rem] leading-snug text-ink-ghost">{w.line}</p>
                  </div>
                  <p className="text-[0.92rem] leading-relaxed text-ink-soft">{w.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h2 className="mt-16 text-display-m">How to take it apart</h2>
            <div className="prose-note mt-5">
              <p>
                The scenarios, the statistics and the hypotheses are all in the repository as plain
                files. The metrics are implemented in one module, with the smoothing decisions
                commented where they were made. The pre-registered hypotheses sit in a single file
                of their own, so once the project is under version control it is checkable whether
                they changed after data arrived.
              </p>
              <p>
                If a scenario is badly written, a metric is misapplied, or a source is being made to
                say more than it does, that is a real error and it is worth finding. The{" "}
                <Link href="/lab#limitations" className="underline decoration-dotted underline-offset-2">
                  limitations section
                </Link>{" "}
                is the list of the ones already known about.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-14">
              <Annotation tone="gold">
                The edge case is where the model meets reality. That is the thread running through all
                three projects, and it took a while to notice it was one thread.
              </Annotation>
            </div>
          </Reveal>
        </Reading>
      </Shell>
    </>
  );
}
