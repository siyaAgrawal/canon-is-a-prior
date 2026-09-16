import Link from "next/link";
import { Entry } from "@/components/experiment/Entry";
import { ScaleBreak } from "@/components/shape/ScaleBreak";
import { Reveal } from "@/components/ui/Reveal";
import { Shell } from "@/components/ui/primitives";
import { Tag } from "@/components/ui/Tag";

export default function Home() {
  return (
    <>
      {/* The reader does something before being told anything. The heading exists for
          the document outline; putting it on screen would announce the thesis, which is
          the one thing this page must not do. */}
      <section className="pt-10 sm:pt-16">
        <Shell>
          <h1 className="sr-only">
            The Canon Is a Prior — an investigation into how we build the versions of reality we
            then call reality
          </h1>
          <Entry />
        </Shell>
      </section>

      <section className="breath">
        <Shell>
          <Reveal>
            <div className="max-w-column">
              <h2 className="statement">I thought I was reading fanfiction.</h2>
              <div className="say mt-8 max-w-measure">
                <p>
                  Hundreds of thousands of words of it. Mostly one pairing, mostly the same two
                  people, written by different strangers who had all read the same seven books.
                </p>
                <p>
                  In one of them he is cruel and it is load-bearing. In another the cruelty is fear
                  wearing a uniform. Same scenes. Same lines. Same history. And he stays{" "}
                  <em>recognisably him</em> across both, which is the part that stopped me — because
                  if the evidence is fixed and the person changes, then the person was never only the
                  evidence.
                </p>
                <p>Then I noticed I was doing it to Icarus.</p>
                <p>Then to a physics problem.</p>
                <p>Then to a dataset.</p>
                <p className="text-ink">Then to someone I knew.</p>
              </div>
            </div>
          </Reveal>
        </Shell>
      </section>

      <section className="pb-24">
        <Shell>
          <Reveal>
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-ghost">
                Six cases. Nothing in the evidence changes in any of them.
              </p>
              <Tag kind="interpretation" />
            </div>
            <ScaleBreak />
          </Reveal>
        </Shell>
      </section>

      <section className="pb-28">
        <Shell>
          <Reveal>
            <div className="max-w-column">
              <p className="statement">Six things that have nothing to do with each other.</p>
              <div className="say mt-8 max-w-measure">
                <p>
                  A character, a myth, a statute, an electron, a table of numbers, a person you
                  love. I keep finding the same move in all of them and I have been unable to decide
                  whether that is a discovery or a symptom.
                </p>
                <p>
                  Because this is exactly what it feels like from the inside when someone has found a
                  pattern that is not there. The shape gets clearer the more examples you add, and
                  adding examples is easy, and it feels like evidence.
                </p>
                <p className="text-ink">
                  So the first thing I built was not an argument for the connection. It was an
                  instrument for prosecuting it.
                </p>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-6">
                <Link href="/shape" className="btn border-ink bg-ink text-paper hover:bg-transparent hover:text-ink">
                  Is the shape really there?
                </Link>
                <Link href="/rewrite" className="btn-quiet">
                  Or start with the myth
                </Link>
              </div>
            </div>
          </Reveal>
        </Shell>
      </section>
    </>
  );
}
