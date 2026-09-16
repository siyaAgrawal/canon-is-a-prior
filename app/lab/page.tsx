import type { Metadata } from "next";
import Link from "next/link";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell, Boundary } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";
import { Dashboard } from "@/components/viz/Dashboard";
import { ForgetButton } from "@/components/ui/ForgetButton";
import { hypotheses, limitations, method, nextQuestions } from "@/research/lab";

export const metadata: Metadata = {
  title: "Method & data",
  description: "What is measured, what has been collected, what this cannot show, and what is stored about you.",
};

const STORED = [
  ["A random identifier", "Made in your browser, kept in your browser. It lets several answers from one person be recognised as one person's. It links to nothing."],
  ["Which instrument", "One of six, plus the scenario experiment."],
  ["Ids and counts", "Which reading, which stance, how many switches. Drawn from fixed vocabularies and checked server-side against a closed schema."],
  ["Elapsed time", "Used only to spot answers submitted too fast to have been read."],
];

const NOT = [
  "Name, email, account — there is no account",
  "IP address",
  "Any analytics or tracking cookie. There is no analytics here",
  "Location, device fingerprint, referrer",
  "Anything you typed — there is nowhere on this site to type",
  "Any private message, of yours or anyone's",
];

export default function LabPage() {
  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Shell>
          <div className="max-w-column">
            <div className="mb-5"><Tag kind="observed" /></div>
            <h1 className="font-display text-d2">Method &amp; data</h1>
            <p className="say mt-7 max-w-measure">
              Computed from storage when you load the page. If the numbers are small, they are small.
            </p>
          </div>
        </Shell>
      </section>

      <Shell className="mt-14">
        <Reveal>
          <Dashboard />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <div className="max-w-column space-y-20">
          <Reveal>
            <section>
              <h2 className="font-display text-d3">Predictions, written first</h2>
              <p className="mt-4 max-w-measure text-[0.88rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                {method.preRegistration}
              </p>
              <ol className="mt-10 space-y-8">
                {hypotheses.map((h) => (
                  <li key={h.id} className="border-l-2 pl-5" style={{ borderColor: "rgb(var(--line) / 0.25)" }}>
                    <p className="kicker">{h.id.toUpperCase()}</p>
                    <p className="mt-2 text-[0.98rem] leading-relaxed" style={{ color: "rgb(var(--fg))" }}>
                      {h.statement}
                    </p>
                    <p className="mt-3 text-[0.85rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                      <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em]" style={{ color: "rgb(var(--accent))" }}>
                        Wrong if —{" "}
                      </span>
                      {h.wouldBeWrongIf}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-d3">How</h2>
              <ol className="mt-8 space-y-5">
                {method.steps.map((s) => (
                  <li key={s.title} className="grid gap-1.5 sm:grid-cols-[7.5rem_1fr] sm:gap-7">
                    <p className="font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.13em]" style={{ color: "rgb(var(--accent))" }}>
                      {s.title}
                    </p>
                    <p className="text-[0.92rem] leading-[1.7]" style={{ color: "rgb(var(--muted))" }}>{s.body}</p>
                  </li>
                ))}
              </ol>
            </section>
          </Reveal>

          <Reveal>
            <section id="ethics" className="scroll-mt-24">
              <h2 className="font-display text-d3">What is stored about you</h2>
              <dl className="mt-7">
                {STORED.map(([k, v]) => (
                  <div key={k} className="hair grid gap-1.5 py-4 sm:grid-cols-[11rem_1fr] sm:gap-7">
                    <dt className="text-[0.92rem]">{k}</dt>
                    <dd className="text-[0.88rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>{v}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-12 font-display text-d5">Not stored</h3>
              <ul className="mt-4 space-y-2">
                {NOT.map((n) => (
                  <li key={n} className="flex gap-3 text-[0.92rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                    <span aria-hidden="true" className="mt-[10px] h-px w-3 flex-none" style={{ background: "rgb(var(--accent))" }} />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-12">
                <Boundary title="Two trade-offs, stated rather than buried">
                  <p>
                    <strong>No deletion.</strong> Answers are anonymous, so nothing links a stored row
                    to you and none can be found and removed on request. Stronger anonymity, no
                    deletion mechanism. You can clear the identifier your browser holds, which stops
                    future answers being grouped with past ones.
                  </p>
                  <p>
                    <strong>A worse dataset, on purpose.</strong> Real screenshots of ambiguous
                    exchanges would be far richer. The person who wrote a message cannot consent to
                    its use and only the recipient would ever be asked, so all thirty-four scenarios
                    are written and the eight myth ones paraphrase texts millennia old. The cost is
                    artificiality, listed below rather than argued away.
                  </p>
                </Boundary>
              </div>
              <div className="mt-8">
                <ForgetButton />
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-d3">What this cannot show</h2>
              <ul className="mt-8 space-y-5">
                {limitations.map((l) => (
                  <li key={l.title} className="grid gap-1.5 sm:grid-cols-[10rem_1fr] sm:gap-7">
                    <p className="font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.12em]" style={{ color: "rgb(var(--accent))" }}>
                      {l.title}
                    </p>
                    <p className="text-[0.92rem] leading-[1.7]" style={{ color: "rgb(var(--muted))" }}>{l.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-d3">Next</h2>
              <ul className="mt-8 space-y-3">
                {nextQuestions.map((q) => (
                  <li key={q} className="flex gap-3 text-[0.95rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                    <span aria-hidden="true" className="mt-[10px] h-px w-3 flex-none" style={{ background: "rgb(var(--accent))" }} />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-10 max-w-measure text-[0.86rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                A prediction that turns out wrong stays on this page marked wrong. Quietly adjusting
                the question until the data answers it is the easiest way to make a project like this
                worthless, and it is almost invisible from outside. Changes go in the{" "}
                <Link href="/log" className="underline decoration-dotted underline-offset-2">log</Link>.
                Model runs happen from a{" "}
                <Link href="/console" className="underline decoration-dotted underline-offset-2">token-protected console</Link>,
                never triggered by visitors.
              </p>
            </section>
          </Reveal>
        </div>
      </Shell>

      <Continue from="/lab" />
    </>
  );
}
