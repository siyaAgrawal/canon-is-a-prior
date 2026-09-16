import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHead, Reading, Shell, NoteCard } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ForgetButton } from "@/components/ui/ForgetButton";

export const metadata: Metadata = {
  title: "Ethics & privacy",
  description: "What is stored, what is not, and why the dataset is deliberately less rich than it could be.",
};

const STORED = [
  ["A random session identifier", "Generated in your browser, stored in your browser. It lets several responses from one person be recognised as one person's during analysis. It is not linked to anything and nothing can be traced back through it."],
  ["The scenario you answered", "Which of the forty-two."],
  ["Your distributions", "One per stage, including your starting position."],
  ["Your confidence ratings", "Optional; null if you did not touch the slider."],
  ["Elapsed time", "Milliseconds from the scenario appearing to your final submission. Used only to spot responses submitted too fast to have been read."],
];

const NOT_STORED = [
  "Your name, email address or any account",
  "Your IP address",
  "Any tracking or analytics cookie — there is no analytics on this site at all",
  "Your location, device fingerprint or referrer",
  "Anything you typed, because there is nowhere to type",
  "Any private message of yours or of anybody else's",
];

export default function EthicsPage() {
  return (
    <>
      <ChapterHead
        n="—"
        kicker="Ethics"
        title="Ethics & privacy"
        standfirst="The dataset is less rich than it could be, on purpose. This page says exactly what is kept, what is refused, and what the refusals cost."
      />

      <Shell className="mt-14">
        <Reading>
          <Reveal>
            <h2 className="font-display text-2xl">What is stored when you submit</h2>
            <dl className="mt-6">
              {STORED.map(([k, v]) => (
                <div key={k} className="grid gap-1.5 border-t border-rule-soft py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <dt className="text-[0.9rem] text-ink">{k}</dt>
                  <dd className="text-[0.88rem] leading-relaxed text-ink-faint">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal>
            <h2 className="mt-14 font-display text-2xl">What is not</h2>
            <ul className="mt-5 space-y-2">
              {NOT_STORED.map((n) => (
                <li key={n} className="flex gap-3 text-[0.92rem] leading-relaxed text-ink-soft">
                  <span aria-hidden="true" className="mt-[9px] h-px w-3 shrink-0 bg-rust" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <div className="mt-14">
              <NoteCard title="Why no private messages" tone="warn">
                <p>
                  The obvious way to build the language track would have been to collect real
                  screenshots of ambiguous exchanges. It would produce a far better dataset. It is
                  not done here, because the person who wrote a message cannot consent to its use —
                  only the person who received it would ever be asked, and that is the wrong person.
                </p>
                <p>
                  So all thirty-four language scenarios were written for this experiment, and the
                  eight myth scenarios paraphrase texts that have been public domain for
                  millennia. The cost is artificiality, and it is listed as a limitation rather
                  than argued away.
                </p>
              </NoteCard>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="mt-14 font-display text-2xl">Participation</h2>
            <div className="prose-note mt-4">
              <p>
                There is no sign-up and no consent form, because there is nothing to consent about
                until you press submit — and until you do, nothing has left your browser. You can
                read every page and do every experiment without contributing anything.
              </p>
              <p>
                Because responses are anonymous, they cannot be found and deleted later on request:
                there is nothing linking a stored row to you. That is a genuine trade-off, stated
                here rather than buried — stronger anonymity in exchange for no deletion mechanism.
                You can clear the identifier your browser holds at any time, which stops future
                responses being grouped with past ones.
              </p>
            </div>
            <div className="mt-6">
              <ForgetButton />
            </div>
          </Reveal>

          <Reveal>
            <h2 className="mt-14 font-display text-2xl">Model runs</h2>
            <div className="prose-note mt-4">
              <p>
                Language-model evaluations are performed by the project owner through a
                token-protected console, never triggered by visitors, and nothing you submit is ever
                sent to a model. Each stored run records the model identifier and a prompt version so
                results stay comparable, and runs from different prompt versions are never pooled.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="mt-14 font-display text-2xl">Integrity</h2>
            <div className="prose-note mt-4">
              <p>
                No participant counts, results, accuracy figures, model performance numbers,
                significance claims, endorsements or citations on this site are invented. Where the
                dataset is empty, the page says zero. Where a hypothesis fails, it stays on the{" "}
                <Link href="/lab" className="underline decoration-dotted underline-offset-2">
                  lab page
                </Link>{" "}
                marked as failed.
              </p>
              <p>
                This is the load-bearing commitment of the whole project. Everything else here is an
                argument about interpretation; this is the thing that makes the arguments worth
                reading.
              </p>
            </div>
          </Reveal>
        </Reading>
      </Shell>
    </>
  );
}
