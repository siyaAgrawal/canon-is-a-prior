import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { sourceSections } from "@/data/sources";

export const metadata: Metadata = {
  title: "Where this came from",
  description: "Fanfiction. Then a myth, then a measurement, then a person.",
};

export default function AboutPage() {
  return (
    <>
      <PageHead title="Where this came from" />

      <Shell className="mt-8">
        <Reveal>
          <div className="max-w-column">
            <div className="say max-w-measure">
              <p>
                Fanfiction. Specifically Dramione, specifically several hundred thousand words of it,
                written by strangers who had all read the same seven books and disagreed
                fundamentally about who was in them.
              </p>
              <p>
                That is not a confession and it is not the charming origin anecdote. It is where the
                problem is clearest, because fanfiction is the only place I know of where thousands
                of people take an identical body of evidence, change one assumption each, and publish
                the result — with the changed assumption stated in the tags.
              </p>
              <p>
                No other domain hands you that. Historians do not label their priors. Neither do
                physicists, or juries, or anyone describing a colleague.
              </p>
              <p className="text-fg">
                I went looking for the same operation elsewhere and kept finding it, which was
                exciting for about two months and then became the actual problem.
              </p>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-24">
        <Reveal>
          <div className="max-w-column">
            <p className="statement">On the copyright question, since it comes up.</p>
            <div className="say mt-7 max-w-measure">
              <p>
                Nothing on this site quotes or reproduces a copyrighted work, and the character
                experiment uses someone I invented rather than someone else&rsquo;s. The narrative
                material is Ovid, Homer, Aeschylus, Sophocles and Virgil, in my own paraphrase, with
                line references on the sources list.
              </p>
              <p>
                The fanfiction is the origin and the method. It is not the content.
              </p>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-24">
        <Reveal>
          <div className="max-w-column">
            <p className="statement">How to take it apart.</p>
            <div className="say mt-7 max-w-measure">
              <p>
                The scenarios, the claims with their verdicts, the statistics and the pre-registered
                hypotheses are plain files in the repository. The metrics module carries its
                smoothing decisions as comments where they were made. The hypotheses sit in a file of
                their own so an edit after data arrives is visible as a dated change.
              </p>
              <p>
                If a scenario is badly written, a metric is misapplied, or a source is being made to
                say more than it does, that is a real error and worth finding. The ones already known
                about are on the{" "}
                <Link href="/lab" className="underline decoration-dotted underline-offset-2 hover:text-fg">
                  method page
                </Link>
                .
              </p>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-24">
        <Reveal>
          <div className="max-w-column">
            <h2 className="font-display text-d5">Sources</h2>
            <p className="mt-3 max-w-measure text-[0.86rem] leading-relaxed text-faint">
              Nothing listed that was not consulted, and nothing described as supporting a claim it
              does not make. Where this project uses an idea more loosely than its source does, the
              note says so.
            </p>
            <div className="mt-10 space-y-12">
              {sourceSections.map((section) => (
                <section key={section.id}>
                  <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent">
                    {section.title}
                  </h3>
                  <ul className="mt-4">
                    {section.sources.map((s) => (
                      <li key={s.id} className="hair py-4">
                        <p className="text-[0.92rem] leading-snug">
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
                        <p className="mt-1 text-[0.8rem] text-faint">
                          {s.authors} · {s.year} · <span className="italic">{s.where}</span>
                        </p>
                        <p className="mt-2 max-w-measure text-[0.84rem] leading-relaxed text-faint">
                          {s.useNote}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/about" />
    </>
  );
}
