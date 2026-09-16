import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHead, Reading, Shell, Rule, NoteCard, Annotation } from "@/components/ui/primitives";
import { JourneyNav } from "@/components/ui/JourneyNav";
import { Reveal } from "@/components/ui/Reveal";
import { ResultsStatus } from "@/components/viz/ResultsStatus";
import { failures, hypotheses, limitations, method, nextQuestions, researchQuestion } from "@/research/lab";
import { logEntries } from "@/research/log";

export const metadata: Metadata = {
  title: "The lab",
  description:
    "Question, hypotheses registered before data, method, failures, limitations, and what comes next. The parts of a project that usually stay in a notebook.",
};

function LabSection({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-rule pt-10">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[0.66rem] tracking-[0.2em] text-rust tabular">{n}</span>
        <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function LabPage() {
  const revisions = logEntries.filter((e) => e.changed);

  return (
    <>
      <ChapterHead
        n="08"
        kicker="The lab"
        title="An investigation, not a finished thing"
        standfirst="Everything below is the part of a project that usually stays in a notebook: what is being asked, what was predicted before any data arrived, what has already gone wrong, and what this experiment is structurally incapable of showing."
      />

      <Shell className="mt-14">
        <Reading className="space-y-16">
          <Reveal>
            <LabSection id="question" n="Q" title="The question">
              <p className="font-display text-xl leading-[1.45]">{researchQuestion.short}</p>
              <div className="prose-note mt-6">
                {researchQuestion.long.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </LabSection>
          </Reveal>

          <Reveal>
            <LabSection id="hypotheses" n="H" title="Hypotheses">
              <p className="prose-note">
                Written before the first response was collected, and kept in a single file in this
                repository. Each one states what would make it wrong, because a prediction that
                forbids nothing is not a prediction.
              </p>
              <ol className="mt-8 space-y-8">
                {hypotheses.map((h) => (
                  <li key={h.id} className="border-l-2 border-rule pl-5">
                    <p className="eyebrow">{h.id.toUpperCase()}</p>
                    <p className="mt-2 text-[1rem] leading-relaxed text-ink">{h.statement}</p>
                    <p className="mt-3 text-[0.86rem] leading-relaxed text-ink-faint">
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-rust">
                        Wrong if —{" "}
                      </span>
                      {h.wouldBeWrongIf}
                    </p>
                    <p className="mt-2 text-[0.86rem] leading-relaxed text-ink-ghost">{h.motivation}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-8 text-[0.84rem] leading-relaxed text-ink-faint">{method.preRegistration}</p>
            </LabSection>
          </Reveal>

          <Reveal>
            <LabSection id="method" n="M" title="Method">
              <ol className="space-y-6">
                {method.steps.map((s, i) => (
                  <li key={s.title} className="grid gap-2 sm:grid-cols-[8rem_1fr] sm:gap-6">
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-rust">
                      {String(i + 1).padStart(2, "0")} {s.title}
                    </p>
                    <p className="text-[0.92rem] leading-relaxed text-ink-soft">{s.body}</p>
                  </li>
                ))}
              </ol>
            </LabSection>
          </Reveal>

          <Reveal>
            <LabSection id="data" n="D" title="Data">
              <p className="prose-note">
                Live counts, per-scenario disagreement and update magnitudes are on the{" "}
                <Link href="/data" className="underline decoration-dotted underline-offset-2">
                  data page
                </Link>
                , computed from storage on each request. Responses are exportable as CSV or JSON in
                long format by the project owner.
              </p>
            </LabSection>
          </Reveal>

          <Reveal>
            <LabSection id="results" n="R" title="Results">
              <ResultsStatus />
            </LabSection>
          </Reveal>

          <Reveal>
            <LabSection id="failures" n="F" title="Failures">
              <p className="prose-note">
                Design problems found and fixed during construction. They are here because a method
                section that lists only what worked is a description of a finished product, not of an
                investigation.
              </p>
              <ul className="mt-8 space-y-7">
                {failures.map((f) => (
                  <li key={f.title}>
                    <p className="font-display text-lg leading-snug">{f.title}</p>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">{f.body}</p>
                  </li>
                ))}
              </ul>
            </LabSection>
          </Reveal>

          <Reveal>
            <LabSection id="revisions" n="V" title="Revisions">
              <ul className="space-y-7">
                {revisions.map((e) => (
                  <li key={`${e.date}-${e.question.slice(0, 12)}`}>
                    <p className="eyebrow">{e.displayDate}</p>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">{e.changed}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[0.84rem] text-ink-faint">
                The full entries, including the fields still empty, are in the{" "}
                <Link href="/log" className="underline decoration-dotted underline-offset-2">
                  researcher&rsquo;s log
                </Link>
                .
              </p>
            </LabSection>
          </Reveal>

          <Reveal>
            <LabSection id="limitations" n="L" title="What this cannot tell us">
              <p className="prose-note">
                The list below is long on purpose. Several of these are severe enough that a
                published finding would have to be hedged heavily, and one of them — the absence of
                ground truth — cannot be fixed by collecting more data.
              </p>
              <ul className="mt-8 space-y-6">
                {limitations.map((l) => (
                  <li key={l.title} className="grid gap-1.5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                    <p className="font-mono text-[0.66rem] uppercase leading-relaxed tracking-[0.12em] text-rust">
                      {l.title}
                    </p>
                    <p className="text-[0.92rem] leading-relaxed text-ink-soft">{l.body}</p>
                  </li>
                ))}
              </ul>
            </LabSection>
          </Reveal>

          <Reveal>
            <LabSection id="next" n="N" title="Next question">
              <ul className="space-y-3">
                {nextQuestions.map((q) => (
                  <li key={q} className="flex gap-3 text-[0.94rem] leading-relaxed text-ink-soft">
                    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-rust" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </LabSection>
          </Reveal>

          <Reveal>
            <div className="mt-6">
              <NoteCard title="A standing commitment" tone="quiet">
                <p>
                  If a hypothesis on this page turns out to be wrong, it stays on this page and is
                  marked wrong. If the model behaves better than predicted, that is what gets
                  written. If the human data is too messy to support any conclusion, that is a result
                  and it will be reported as one.
                </p>
                <p>
                  The alternative — quietly adjusting the question until the data answers it — is
                  the single easiest way to make a project like this worthless, and it is almost
                  invisible from the outside.
                </p>
              </NoteCard>
            </div>
          </Reveal>

          <Reveal>
            <Rule />
            <Annotation tone="gold">
              None of this requires believing the project will find something. It requires the
              experiment to be capable of finding nothing, and saying so.
            </Annotation>
          </Reveal>
        </Reading>
      </Shell>

      <JourneyNav pathname="/lab" />
    </>
  );
}
