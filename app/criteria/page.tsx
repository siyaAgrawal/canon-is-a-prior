import type { Metadata } from "next";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell, Boundary } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";
import { CriteriaTest } from "@/components/criteria/CriteriaTest";

export const metadata: Metadata = {
  title: "Criteria",
  description:
    "Coherent, plausible, supported, true, useful, predictive, satisfying. Seven words used as one. Two cases where you cannot have them all.",
};

const WORDS = [
  ["Coherent", "The parts hold together."],
  ["Plausible", "People behave like that."],
  ["Supported", "The evidence favours it over the alternatives."],
  ["Predictive", "It says what you will find next."],
  ["Useful", "Holding it lets you do something."],
  ["Satisfying", "It resolves."],
  ["True", "It is what was the case."],
];

export default function CriteriaPage() {
  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Shell>
          <div className="max-w-column">
            <div className="mb-5"><Tag kind="illustration" /></div>
            <h1 className="font-display text-d2">A story can be coherent and wrong.</h1>
          </div>

          <ul className="mt-14 grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
            {WORDS.map(([w, gloss], i) => (
              <li key={w} className="hair py-4">
                <p className="font-display text-d5" style={{ color: i === 6 ? "rgb(var(--accent))" : undefined }}>
                  {w}
                </p>
                <p className="mt-1 text-[0.84rem] leading-snug" style={{ color: "rgb(var(--faint))" }}>
                  {gloss}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-measure text-[0.9rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
            Seven different properties. The last one is almost always unknown, and it is the one
            people think they are arguing about.
          </p>
        </Shell>
      </section>

      <Shell className="mt-20">
        <Reveal>
          <CriteriaTest />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column">
            <Boundary title="Why a language model makes this urgent">
              <p>
                A model is optimised toward the first column. Producing text that holds together is
                close to a description of what it does.
              </p>
              <p>
                And coherence is the column people use as a proxy for the rest, because it is the
                only one you can assess instantly and without leaving your chair. Support takes work.
                Falsifiability takes imagination. Coherence arrives free.
              </p>
              <p>
                The mismatch is not a defect in the model. It is a defect in the proxy, and it
                predates models entirely.
              </p>
            </Boundary>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/criteria" />
    </>
  );
}
