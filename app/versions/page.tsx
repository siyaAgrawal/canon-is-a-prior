import type { Metadata } from "next";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { CharacterLab } from "@/components/versions/CharacterLab";

export const metadata: Metadata = {
  title: "The character lab",
  description:
    "Seven facts about an invented person, in order. The experiment measures what it costs you to keep your first reading.",
};

export default function VersionsPage() {
  return (
    <>
      <PageHead
        title="The character lab"
        tag={<Tag kind="illustration" />}
        note={
          <p>
            Seven facts about someone who does not exist. The question is not whether you read them
            correctly — there is nothing to be correct about. It is what you do at the point where
            the facts stop cooperating.
          </p>
        }
      />

      <Shell className="mt-14">
        <Reveal>
          <CharacterLab />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column">
            <p className="statement">Why this is the fanfiction experiment.</p>
            <div className="say mt-7 max-w-measure">
              <p>
                A retelling does not usually contradict the source. It changes an assumption and then
                absorbs everything the source says under the new assumption. The cruelty is still
                there; it is now doing something else.
              </p>
              <p>
                That is the same operation as the one above, run in the other direction. Here you
                start with a reading and absorb facts into it. There a writer starts with a changed
                reading and absorbs an entire canon into it. Both are accommodation. Both produce
                something internally coherent.
              </p>
              <p>
                In fiction that is the craft. Applied to a person it is how you can know someone for
                years, be wrong about them the entire time, and never once encounter a fact that
                forced the issue.
              </p>
              <p className="text-ink">
                I have not worked out what distinguishes the two cases. That is a genuine gap and not
                a rhetorical one.
              </p>
            </div>
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
