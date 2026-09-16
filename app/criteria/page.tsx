import type { Metadata } from "next";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { CriteriaTest } from "@/components/criteria/CriteriaTest";

export const metadata: Metadata = {
  title: "Coherent, supported, true",
  description:
    "Three explanations, one set of facts, none best at everything. Find out which criterion you actually use.",
};

export default function CriteriaPage() {
  return (
    <>
      <PageHead
        title="A story can be coherent and wrong."
        tag={<Tag kind="illustration" />}
        note={
          <p>
            Coherent, plausible, satisfying, predictive, useful, supported, true. Seven words that
            get used as though they were one. Two cases below, arranged so you cannot have all of
            them at once.
          </p>
        }
      />

      <Shell className="mt-16">
        <Reveal>
          <CriteriaTest />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column">
            <p className="statement">Why this is the page about machines.</p>
            <div className="say mt-7 max-w-measure">
              <p>
                A language model is optimised toward the first column. Producing text that holds
                together is close to a description of what it does.
              </p>
              <p>
                And the first column is the one people use as a proxy for the others, because it is
                the only one you can assess instantly and without leaving your chair. Support takes
                work. Falsifiability takes imagination. Coherence arrives free.
              </p>
              <p className="text-ink">
                The mismatch is not a defect in the model. It is a defect in the proxy, and it was
                there long before there were models.
              </p>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/criteria" />
    </>
  );
}
