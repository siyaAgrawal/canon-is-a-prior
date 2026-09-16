import type { Metadata } from "next";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell, Boundary } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";
import { StorageNotice } from "@/components/experiment/StorageNotice";
import { ScenarioRunner } from "@/components/experiment/ScenarioRunner";
import { allScenarios } from "@/data";

export const metadata: Metadata = {
  title: "Sure.",
  description:
    "The full version: forty-two scenarios, a fixed set of readings, and evidence that arrives after you have committed.",
};

export default function SurePage() {
  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Shell>
          <div className="max-w-column">
            <div className="mb-5"><Tag kind="observed" /></div>
            <h1 className="font-display text-d2">The same thing, forty-two times.</h1>
            <p className="say mt-7 max-w-measure">
              On the homepage you did it once with one word. Here it runs properly: a situation, an
              ambiguous act, a fixed set of readings, and evidence arriving one piece at a time —
              after you have committed, which is the order it usually arrives in.
            </p>
            <p className="mt-5 max-w-measure text-[0.86rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
              Instead of picking one reading you spread a hundred points across them. Raising one
              lowers the others. That constraint is the instrument: a scale that lets you call
              everything plausible measures nothing.
            </p>
          </div>
        </Shell>
      </section>

      <Shell className="mt-14">
        <Reveal>
          <StorageNotice />
          <ScenarioRunner scenarios={allScenarios} />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column">
            <Boundary title="What the numbers are and are not">
              <p>
                A distribution here is a report, not a measurement of a belief. Asking someone to put
                a number on a reading changes the reading, and thirty years of work on judgement
                under uncertainty is thirty years of reasons to treat elicited probabilities as
                approximate.
              </p>
              <p>
                What they are good for is movement. How far you went, in which direction, and how far
                apart two people end up after seeing the same thing — those survive the imprecision.
              </p>
            </Boundary>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/sure" />
    </>
  );
}
