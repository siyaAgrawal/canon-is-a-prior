import type { Metadata } from "next";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell, Boundary } from "@/components/ui/primitives";
import { ConnectionMap } from "@/components/map/ConnectionMap";
import { mapEdges } from "@/data/connections";
import { Recorded } from "@/components/ui/Recorded";

export const metadata: Metadata = {
  title: "The map",
  description: "Every connection, with the severed ones drawn as severed. Also the way around.",
};

export default function MapPage() {
  const n = (k: string) => mapEdges.filter((e) => e.strength === k).length;

  return (
    <>
      <section className="pt-16 sm:pt-20">
        <Shell>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-column">
              <p className="kicker">This map is not the territory</p>
              <h1 className="mt-4 font-display text-d2">The map</h1>
            </div>
            <p className="max-w-measure text-[0.86rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
              It started as a folded sheet with coloured pen on it. Every line now has to declare
              what kind of line it is, and the ones I cut are still drawn.
            </p>
          </div>
        </Shell>
      </section>

      <Shell className="mt-12">
        <Reveal>
          <ConnectionMap />
        </Reveal>
      </Shell>

      <Shell className="mt-20">
        <Reveal>
          <div className="max-w-column">
            <div className="grid gap-5 sm:grid-cols-5">
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
                  <p className="kicker">{label}</p>
                  <p className="mt-1.5 font-display text-2xl tabular">{count}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Recorded what="Which nodes you opened, in order — a rough measure of which connections people actually check." />
            </div>

            <div className="mt-16">
              <Boundary title="The line this project is named after is dashed">
                <p>
                  A prior is a normalised distribution over a stated hypothesis space. A canon is
                  none of those things. What survives is a claim about the role played — smaller than
                  the title, and the reason the title is a first discovery rather than a conclusion.
                </p>
              </Boundary>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/map" />
    </>
  );
}
