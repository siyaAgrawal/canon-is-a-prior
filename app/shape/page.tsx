import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { ShapeAudit } from "@/components/shape/ShapeAudit";

export const metadata: Metadata = {
  title: "Is the shape really there?",
  description:
    "Ten structural claims. Some this project defends, one it gave up, three written as controls. Judge which are found and which are imposed.",
};

export default function ShapePage() {
  return (
    <>
      <PageHead
        title="Is the shape really there?"
        tag={<Tag kind="open" />}
        note={
          <>
            <p>
              A person who has found a real pattern and a person who is seeing things report the same
              experience. It gets clearer with every example. Examples are easy to add. Adding them
              feels like evidence.
            </p>
            <p>
              Ten claims below. Decide about each before I tell you anything.
            </p>
          </>
        }
      />

      <Shell className="mt-16">
        <Reveal>
          <ShapeAudit />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column">
            <p className="statement">What this does not settle.</p>
            <div className="say mt-7 max-w-measure">
              <p>
                Catching the controls does not show the real connections are real. It shows the
                controls were catchable, and I wrote them, so I had every advantage in making them
                catchable without noticing I had.
              </p>
              <p>
                The honest position is narrower than the page probably makes it feel: two of the ten
                survive scrutiny with a specific stated structure, most survive only as descriptions
                of a shared role, one did not survive at all, and three were never claims. That is a
                thinner result than &ldquo;the same shape appears everywhere&rdquo;.
              </p>
              <p className="text-fg">
                It is also the result, so it is what the site says.
              </p>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column">
            <div className="hair pt-10">
              <p className="kicker" style={{ color: "rgb(var(--accent))" }}>
                So what do you do with the next one?
              </p>
              <h2 className="mt-5 font-display text-d3">
                You have just tested somebody else&rsquo;s connections. Yours are harder.
              </h2>
              <p className="say mt-7 max-w-measure">
                These ten came labelled, judged, and with the fabrications disclosed at the end. A
                pattern you find yourself arrives with none of that — and it arrives feeling
                exactly like the ones above felt before the reveal.
              </p>
              <Link href="/canon-test" className="btn btn-solid mt-9">
                The Canon Test →
              </Link>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/shape" />
    </>
  );
}
