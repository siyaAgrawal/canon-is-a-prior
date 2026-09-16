import type { Metadata } from "next";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { CounterfactualEngine } from "@/components/canon/CounterfactualEngine";
import { canonModules } from "@/data/canon";

export const metadata: Metadata = {
  title: "Rewrite the canon",
  description:
    "Same events. Change one premise. Watch which readings have to move with it, and which refuse.",
};

export default function RewritePage() {
  const [icarus, achilles] = canonModules;

  return (
    <>
      <PageHead
        title="Same events. Different person."
        tag={<Tag kind="interpretation" />}
        note={
          <p>
            Nothing below changes what happened. The wings are built, the warning is given, the boy
            climbs, the wax fails. Change one assumption about why, and count what moves.
          </p>
        }
      />

      <Shell className="mt-16">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-display-m">{icarus.title}</h2>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-ghost">
              four premises
            </p>
          </div>
          <CounterfactualEngine module={icarus} />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column">
            <p className="statement">Nobody added an event.</p>
            <div className="say mt-7 max-w-measure">
              <p>
                Four facts, unchanged. One assumption altered — and four other readings moved with it,
                without being adjusted one at a time.
              </p>
              <p>
                That is what distinguishes a model from a list. In a list, facts are independent: you
                can revise one and leave the rest. In a model they are load-bearing. Pull on one and
                the structure redistributes, which is why a single anomalous result can be absorbed
                harmlessly by one theory and be fatal to another.
              </p>
              <p className="text-ink">
                Three thousand years of Icarus meaning pride rests on an assumption the text does not
                state.
              </p>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-display-m">{achilles.title}</h2>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-ghost">
              harder — the gap is older than the readings
            </p>
          </div>
          <CounterfactualEngine module={achilles} />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column">
            <p className="statement">So can a premise do anything?</p>
            <div className="say mt-7 max-w-measure">
              <p>
                No, and you can see the constraint in the engine. Every premise carries a line naming
                what it cannot absorb. The freedom reading has to admit Ovid gives the boy no
                grievance. The accident reading has to explain away a text describing him drawn
                upward. The tactical reading of the armour has to account for the commanders Achilles
                refused.
              </p>
              <p>
                Those lines are the literary equivalent of a prediction a theory got wrong: the
                places a reading has to pay something. A reading that pays nothing anywhere is not
                the strongest one available. It is usually the one that has stopped touching the
                text.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Tag kind="analogy" />
              <span className="max-w-measure text-[0.8rem] leading-relaxed text-ink-ghost">
                That last comparison is doing more work than it can carry. A failed prediction can be
                observed. A reading that &ldquo;pays&rdquo; cannot. The resemblance is in the
                accounting, not in the evidence.
              </span>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/rewrite" />
    </>
  );
}
