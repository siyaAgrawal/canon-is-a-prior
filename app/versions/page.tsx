import type { Metadata } from "next";
import Link from "next/link";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell, Boundary } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";
import { Marginalia } from "@/components/origin/Marginalia";
import { CharacterLab } from "@/components/versions/CharacterLab";

export const metadata: Metadata = {
  title: "Versions",
  description:
    "A canon is a fixed body of evidence. A retelling changes one assumption and absorbs all of it. Then: seven facts about a stranger.",
};

export default function VersionsPage() {
  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Shell>
          <div className="grid items-center gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
            <div className="max-w-column">
              <p className="kicker">The original laboratory</p>
              <h1 className="mt-5 font-display text-d2">
                A canon is a fixed body of evidence that thousands of people have disagreed about in
                writing.
              </h1>
              <div className="say mt-8 max-w-measure">
                <p>
                  Nowhere else hands you that. Historians do not publish their priors. Neither do
                  physicists, or juries, or anyone describing a colleague.
                </p>
                <p>
                  Fanfiction does. Thousands of variants of one source, each changing an assumption,
                  each stating the change in the tags — and almost none of them contradicting the
                  source. That is the strange part. A retelling usually keeps every event and absorbs
                  all of them under a different reading.
                </p>
              </div>
            </div>

            <Reveal>
              <Marginalia />
            </Reveal>
          </div>
        </Shell>
      </section>

      <section className="py-24">
        <Shell>
          <Reveal>
            <div className="max-w-column">
              <Boundary title="Where this stops being about books">
                <p>
                  If the evidence is fixed and the person changes, the person was never only the
                  evidence. Something the reader brought was doing part of the work.
                </p>
                <p>
                  Which is fine in fiction — it is the craft. Applied to a person it means you can
                  know someone for years, be wrong about them the whole time, and never once meet a
                  fact that forces the issue.
                </p>
              </Boundary>
            </div>
          </Reveal>
        </Shell>
      </section>

      <section className="pb-8">
        <Shell>
          <Reveal>
            <div className="hair pt-12">
              <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="font-display text-d3">Seven facts about someone who does not exist</h2>
                <Tag kind="illustration" />
              </div>
              <p className="say mb-12 max-w-measure">
                Not a personality quiz. There is nothing to be correct about. The measurement is what
                you do at the point where the facts stop cooperating.
              </p>
              <CharacterLab />
            </div>
          </Reveal>
        </Shell>
      </section>

      <Shell className="mt-24">
        <Reveal>
          <div className="max-w-column">
            <p className="say max-w-measure">
              Accommodation is how a good model survives awkward evidence. It is also how a wrong one
              does, and nothing in the act itself tells you which you were doing.{" "}
              <Link href="/person">That problem has a worse version.</Link>
            </p>
            <div className="mt-8">
              <Tag kind="open" />
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/versions" />
    </>
  );
}
