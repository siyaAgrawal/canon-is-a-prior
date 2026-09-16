import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { Dashboard } from "@/components/viz/Dashboard";
import { hypotheses, limitations, method, nextQuestions } from "@/research/lab";

export const metadata: Metadata = {
  title: "Method and data",
  description: "What is measured, what has been collected, and what this cannot show.",
};

export default function LabPage() {
  return (
    <>
      <PageHead
        title="Method and data"
        tag={<Tag kind="observed" />}
        note={
          <p>
            Everything below is computed from storage when you load the page. If the numbers are
            small, they are small.
          </p>
        }
      />

      <Shell className="mt-14">
        <Reveal>
          <Dashboard />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <div className="max-w-column space-y-20">
          <Reveal>
            <section>
              <h2 className="font-display text-display-m">Predictions, written first</h2>
              <p className="mt-4 max-w-measure text-[0.88rem] leading-relaxed text-ink-faint">
                {method.preRegistration}
              </p>
              <ol className="mt-10 space-y-8">
                {hypotheses.map((h) => (
                  <li key={h.id} className="border-l-2 border-rule pl-5">
                    <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-ghost">
                      {h.id.toUpperCase()}
                    </p>
                    <p className="mt-2 text-[0.98rem] leading-relaxed text-ink">{h.statement}</p>
                    <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-faint">
                      <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-rust">
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
              <h2 className="font-display text-display-m">How</h2>
              <ol className="mt-8 space-y-5">
                {method.steps.map((s) => (
                  <li key={s.title} className="grid gap-1.5 sm:grid-cols-[7.5rem_1fr] sm:gap-7">
                    <p className="font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.13em] text-rust">
                      {s.title}
                    </p>
                    <p className="text-[0.92rem] leading-[1.7] text-ink-soft">{s.body}</p>
                  </li>
                ))}
              </ol>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-display-m">What this cannot show</h2>
              <p className="mt-4 max-w-measure text-[0.88rem] leading-relaxed text-ink-faint">
                Long on purpose. One of these cannot be fixed by collecting more.
              </p>
              <ul className="mt-8 space-y-5">
                {limitations.map((l) => (
                  <li key={l.title} className="grid gap-1.5 sm:grid-cols-[10rem_1fr] sm:gap-7">
                    <p className="font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.12em] text-rust">
                      {l.title}
                    </p>
                    <p className="text-[0.92rem] leading-[1.7] text-ink-soft">{l.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-display-m">Next</h2>
              <ul className="mt-8 space-y-3">
                {nextQuestions.map((q) => (
                  <li key={q} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-soft">
                    <span aria-hidden="true" className="mt-[10px] h-px w-3 shrink-0 bg-rust" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-10 max-w-measure text-[0.86rem] leading-relaxed text-ink-faint">
                If a prediction turns out wrong it stays on this page marked wrong. Quietly adjusting
                the question until the data answers it is the easiest way to make a project like this
                worthless, and it is almost invisible from outside. The{" "}
                <Link href="/log" className="underline decoration-dotted underline-offset-2 hover:text-ink">
                  log
                </Link>{" "}
                is where changes go.
              </p>
              <p className="mt-4 max-w-measure text-[0.82rem] leading-relaxed text-ink-ghost">
                Model runs are performed from a{" "}
                <Link href="/console" className="underline decoration-dotted underline-offset-2 hover:text-ink">
                  token-protected console
                </Link>
                , never triggered by visitors, and nothing you submit is ever sent to a model.
              </p>
            </section>
          </Reveal>
        </div>
      </Shell>

      <Continue from="/lab" />
    </>
  );
}
