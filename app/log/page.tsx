import type { Metadata } from "next";
import { ChapterHead, Reading, Shell, NoteCard } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { logEntries, logNote } from "@/research/log";

export const metadata: Metadata = {
  title: "Researcher's log",
  description: "Dated entries with a fixed format, including the fields that are still empty.",
};

const FIELDS = [
  ["Question", "question"],
  ["What I expected", "expected"],
  ["What happened", "happened"],
  ["What surprised me", "surprised"],
  ["What changed", "changed"],
  ["Next question", "next"],
] as const;

export default function LogPage() {
  return (
    <>
      <ChapterHead
        n="—"
        kicker="Log"
        title="Researcher's log"
        standfirst="A fixed format, kept deliberately awkward. The 'what happened' field cannot be quietly skipped when the answer is 'nothing yet', and earlier entries are not edited once later ones contradict them."
      />

      <Shell className="mt-14">
        <Reading>
          <Reveal>
            <NoteCard title="On the empty fields" tone="quiet">
              <p>{logNote}</p>
            </NoteCard>
          </Reveal>

          <div className="mt-14 space-y-16">
            {logEntries.map((entry, i) => (
              <Reveal key={`${entry.date}-${i}`}>
                <article className="border-t border-rule pt-8">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-rust">
                    {entry.displayDate}
                  </p>
                  <dl className="mt-6 space-y-6">
                    {FIELDS.map(([label, key]) => {
                      const value = entry[key];
                      return (
                        <div key={label} className="grid gap-1.5 sm:grid-cols-[9.5rem_1fr] sm:gap-6">
                          <dt className="font-mono text-[0.64rem] uppercase leading-relaxed tracking-[0.12em] text-ink-faint">
                            {label}
                          </dt>
                          <dd>
                            {value ? (
                              <p className="text-[0.94rem] leading-relaxed text-ink-soft">{value}</p>
                            ) : (
                              <p className="border border-dashed border-rule px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-ghost">
                                empty — the work has not happened yet
                              </p>
                            )}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-16 border-t border-rule-soft pt-8 text-[0.86rem] leading-relaxed text-ink-faint">
              Entries are added when work actually happens, and there is no backdated history here. A
              log that begins with a tidy sequence of prior months would be a nicer object and a less
              honest one.
            </p>
          </Reveal>
        </Reading>
      </Shell>
    </>
  );
}
