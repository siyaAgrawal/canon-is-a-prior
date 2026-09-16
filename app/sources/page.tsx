import type { Metadata } from "next";
import { ChapterHead, Reading, Shell, NoteCard } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { sourceSections, allSources } from "@/data/sources";

export const metadata: Metadata = {
  title: "Sources & further reading",
  description:
    "Primary, secondary and background sources, each with a note on how this project actually uses it — including where it uses it loosely.",
};

const KIND_STYLE = {
  primary: "border-rust/40 text-rust",
  secondary: "border-indigo/40 text-indigo",
  background: "border-ink/25 text-ink-faint",
} as const;

export default function SourcesPage() {
  const counts = {
    primary: allSources.filter((s) => s.kind === "primary").length,
    secondary: allSources.filter((s) => s.kind === "secondary").length,
    background: allSources.filter((s) => s.kind === "background").length,
  };

  return (
    <>
      <ChapterHead
        n="—"
        kicker="Sources"
        title="Sources & further reading"
        standfirst="Nothing is listed that was not consulted, and nothing is described as supporting a claim it does not make. Where this project uses an idea more loosely than its source does, the note says so."
      />

      <Shell className="mt-14">
        <Reading>
          <Reveal>
            <div className="grid gap-5 sm:grid-cols-3">
              {(
                [
                  ["Primary", counts.primary, "The original paper, book or text."],
                  ["Secondary", counts.secondary, "Scholarly overviews, mostly the Stanford Encyclopedia."],
                  ["Background", counts.background, "Read around the question; not load-bearing."],
                ] as const
              ).map(([label, n, note]) => (
                <div key={label} className="border-t border-rule pt-4">
                  <p className="eyebrow">{label}</p>
                  <p className="mt-2 font-display text-2xl tabular">{n}</p>
                  <p className="mt-1.5 text-[0.78rem] leading-snug text-ink-ghost">{note}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-16 space-y-16">
            {sourceSections.map((section) => (
              <Reveal key={section.id}>
                <section>
                  <h2 className="font-display text-2xl sm:text-3xl">{section.title}</h2>
                  <p className="prose-note mt-3 max-w-reading">{section.blurb}</p>

                  <ul className="mt-8 space-y-8">
                    {section.sources.map((s) => (
                      <li key={s.id} className="border-t border-rule-soft pt-5">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span
                            className={`border px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] ${KIND_STYLE[s.kind]}`}
                          >
                            {s.kind}
                          </span>
                          <p className="text-[0.88rem] text-ink-faint">
                            {s.authors} · {s.year}
                          </p>
                        </div>
                        <p className="mt-2 font-display text-[1.14rem] leading-snug">
                          {s.url ? (
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline decoration-rule underline-offset-4 hover:decoration-rust"
                            >
                              {s.title}
                            </a>
                          ) : (
                            s.title
                          )}
                        </p>
                        <p className="mt-1 text-[0.84rem] italic text-ink-faint">{s.where}</p>
                        <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-soft">
                          <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-ghost">
                            How it is used —{" "}
                          </span>
                          {s.useNote}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-16">
              <NoteCard title="On citation honesty" tone="warn">
                <p>
                  The most common failure in a project like this is not inventing a reference. It is
                  citing a real one for a claim it does not support — a paper about calibration on
                  tasks with correct answers, used to imply something about interpretation, where
                  there are none.
                </p>
                <p>
                  That specific move is flagged in the note on Kadavath et al., and the same
                  discipline is applied to Kuhn, to Popper and to Gadamer, each of whom would have
                  objected to part of how this site frames things. Where that is true, it is stated
                  rather than smoothed over.
                </p>
              </NoteCard>
            </div>
          </Reveal>
        </Reading>
      </Shell>
    </>
  );
}
