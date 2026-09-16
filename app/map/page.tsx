import type { Metadata } from "next";
import { ChapterHead, Reading, Shell, NoteCard, Annotation } from "@/components/ui/primitives";
import { JourneyNav } from "@/components/ui/JourneyNav";
import { Reveal } from "@/components/ui/Reveal";
import { ConnectionMap } from "@/components/map/ConnectionMap";
import { mapEdges } from "@/data/connections";

export const metadata: Metadata = {
  title: "The connection map",
  description:
    "The handwritten sheet this project started from, with every line required to declare how strong it actually is.",
};

export default function MapPage() {
  const counts = {
    structural: mapEdges.filter((e) => e.strength === "structural").length,
    analogical: mapEdges.filter((e) => e.strength === "analogical").length,
    historical: mapEdges.filter((e) => e.strength === "historical").length,
  };

  return (
    <>
      <ChapterHead
        n="10"
        kicker="The map"
        title="The connection map"
        standfirst="This started as a folded sheet of paper covered in coloured pen: de Broglie in one corner, Icarus in another, Bayes' rule in the middle, arrows everywhere. This is that sheet with one rule added — every line has to say what kind of line it is."
      />

      <Shell className="mt-12">
        <Reading>
          <Reveal>
            <p className="prose-note">
              The rule turned out to be the whole exercise. It is easy to draw an arrow between two
              ideas; it costs nothing and feels like insight. Requiring each arrow to state whether
              it is structural, analogical or historical — and requiring the analogical ones to name
              their own disanalogy — deleted several connections and weakened others, including the
              one this project is named after.
            </p>
          </Reveal>
        </Reading>
      </Shell>

      <Shell className="mt-10">
        <Reveal>
          <ConnectionMap />
        </Reveal>
      </Shell>

      <Shell className="mt-20">
        <Reading>
          <Reveal>
            <div className="grid gap-6 sm:grid-cols-3">
              {(
                [
                  ["Structural", counts.structural, "A form both things share, statable precisely enough to be wrong."],
                  ["Analogical", counts.analogical, "Suggestive. Each one carries a stated disanalogy."],
                  ["Historical", counts.historical, "One of them actually influenced the other."],
                ] as const
              ).map(([label, n, note]) => (
                <div key={label} className="border-t border-rule pt-4">
                  <p className="eyebrow">{label}</p>
                  <p className="mt-2 font-display text-3xl tabular">{n}</p>
                  <p className="mt-2 text-[0.8rem] leading-snug text-ink-ghost">{note}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-14">
              <NoteCard title="The edge that matters most is dashed" tone="warn">
                <p>
                  <strong>prior → canon</strong> is marked analogical, and its caveat says: a prior is
                  an explicit distribution over a stated hypothesis space; a canon is not numerical,
                  not normalised, and has no agreed set of options. The resemblance is about the role
                  played, not about the object.
                </p>
                <p>
                  That is the title of this project, demoted to a dashed line by its own rule. It is
                  the right outcome. The slogan asserted an equivalence and was false; the narrower
                  claim — that an inherited reading determines how much work a new reading has to do,
                  and is not itself the product of the evidence it governs — is checkable, and it
                  generated an experiment. The slogan never would have.
                </p>
              </NoteCard>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-12">
              <Annotation tone="moss">
                The sheet is still on the desk. It has more arrows than this, and most of them
                haven&rsquo;t earned a label yet.
              </Annotation>
            </div>
          </Reveal>
        </Reading>
      </Shell>

      <JourneyNav pathname="/map" />
    </>
  );
}
