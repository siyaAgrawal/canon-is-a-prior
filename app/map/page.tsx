import type { Metadata } from "next";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { ConnectionMap } from "@/components/map/ConnectionMap";
import { mapEdges } from "@/data/connections";

export const metadata: Metadata = {
  title: "The map",
  description: "Every connection this project draws, with the severed ones drawn as severed.",
};

export default function MapPage() {
  const n = (k: string) => mapEdges.filter((e) => e.strength === k).length;

  return (
    <>
      <PageHead
        title="The map"
        tag={<Tag kind="analogy" />}
        note={
          <p>
            It started as a folded sheet with coloured pen on it. Every line now has to say what kind
            of line it is, and the ones I cut are still drawn.
          </p>
        }
      />

      <Shell className="mt-14">
        <Reveal>
          <ConnectionMap />
        </Reveal>
      </Shell>

      <Shell className="mt-24">
        <Reveal>
          <div className="max-w-column">
            <div className="grid gap-6 sm:grid-cols-5">
              {(
                [
                  ["Structural", n("structural")],
                  ["Analogical", n("analogical")],
                  ["Historical", n("historical")],
                  ["Break", n("break")],
                  ["Open", n("open")],
                ] as const
              ).map(([label, count]) => (
                <div key={label} className="hair pt-4">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-ghost">
                    {label}
                  </p>
                  <p className="mt-1.5 font-display text-2xl tabular">{count}</p>
                </div>
              ))}
            </div>

            <div className="say mt-14 max-w-measure">
              <p>
                Drawing a line between two ideas costs nothing and feels like insight. Requiring each
                one to declare its kind — and requiring the analogies to name their own disanalogy —
                removed several and demoted more, including the line this project is named after.
              </p>
              <p className="text-ink">
                <strong>prior → canon</strong> is dashed. A prior is a normalised distribution over a
                stated hypothesis space. A canon is none of those things. What survives is a claim
                about the role played, which is smaller than the title and is the reason the title is
                a first discovery rather than a conclusion.
              </p>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/map" />
    </>
  );
}
