import type { Metadata } from "next";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { ModelLoop } from "@/components/person/ModelLoop";

export const metadata: Metadata = {
  title: "The model of a person",
  description: "You don't meet people. You meet fragments, and build.",
};

export default function PersonPage() {
  return (
    <>
      <section className="breath">
        <Shell>
          <div className="max-w-column">
            <h1 className="statement">You have almost never met anyone.</h1>
            <p className="say mt-8 max-w-measure">
              You have met what they said, what they did, what someone told you, what you remember,
              what you expected, and what you were afraid of. Then you built something out of it and
              have been talking to that.
            </p>
          </div>
        </Shell>
      </section>

      <Shell>
        <Reveal>
          <ModelLoop />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column">
            <p className="say max-w-measure">
              Everything else on this site is a rehearsal for this page. Icarus cannot be hurt by
              being read wrong. A dataset does not care what you trained on it. An electron has no
              stake in which of two words you use.
            </p>
            <p className="say mt-5 max-w-measure text-ink">
              The place where the model is not the thing, and the difference costs something, is
              here.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Tag kind="analogy" />
              <span className="max-w-measure text-[0.8rem] leading-relaxed text-ink-ghost">
                And this is where the project&rsquo;s own comparison is weakest. A person responds to
                being modelled. Nothing else in this investigation does. That asymmetry is on the{" "}
                <a href="/shape" className="underline decoration-dotted underline-offset-2 hover:text-ink">
                  claims page
                </a>{" "}
                and it is the reason the person/dataset comparison is marked as dangerous rather than
                as true.
              </span>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/person" />
    </>
  );
}
