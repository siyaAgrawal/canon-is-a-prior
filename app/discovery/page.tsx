import type { Metadata } from "next";
import Link from "next/link";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell, Boundary } from "@/components/ui/primitives";
import { DiscoveryBoard } from "@/components/research/DiscoveryBoard";
import { researchQuestion, candidates, STATUS_LABEL, type Status } from "@/research/discovery";

export const metadata: Metadata = {
  title: "What we know so far",
  description: "Every candidate finding, its status, what would move it, and the rival that would explain the same data.",
};

export default function DiscoveryPage() {
  const byStatus = (s: Status) => candidates.filter((c) => c.status === s).length;

  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Shell>
          <div className="max-w-column">
            <p className="kicker">The research state</p>
            <h1 className="mt-5 font-display text-d1 leading-[0.92]">
              We don&rsquo;t
              <br />
              know yet.
            </h1>
            <p className="say mt-9 max-w-measure">
              Eight candidates. One abandoned before anything was collected, one weakened by the
              project&rsquo;s own audit, six open with nothing bearing on them.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {(["open", "supported", "weakened", "contradicted", "abandoned"] as Status[]).map((s) => (
              <div key={s} className="hair pt-4">
                <p className="kicker">{STATUS_LABEL[s]}</p>
                <p className="mt-1.5 font-display text-2xl tabular">{byStatus(s)}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-measure text-[0.84rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
            There is no <em>proven</em> column, and there will not be one. A claim that has survived
            everything thrown at it is <em>supported</em> — which is a statement about what was
            thrown.
          </p>
        </Shell>
      </section>

      <Shell className="mt-20">
        <Reveal>
          <DiscoveryBoard />
        </Reveal>
      </Shell>

      <Shell className="mt-28">
        <Reveal>
          <div className="max-w-column space-y-12">
            <div>
              <h2 className="font-display text-d3">{researchQuestion.headline}</h2>
              <p className="say mt-6 max-w-measure">{researchQuestion.second}</p>
            </div>

            <Boundary title="If this works, what will exist that doesn't now">
              <p>{researchQuestion.outcome}</p>
            </Boundary>

            <div>
              <h2 className="font-display text-d4">Why every candidate carries a rival</h2>
              <div className="say mt-6 max-w-measure">
                <p>
                  A candidate with no rival is not a finding — it is a description of the data that
                  happens to be phrased as a discovery. The rival field is the cheapest available
                  guard against that, and in three of the eight cases above the rival is currently at
                  least as plausible as the claim.
                </p>
                <p>
                  The <Link href="/lab">method page</Link> has the pre-registration and the
                  limitations. <Link href="/shape">The audit</Link> is where the connections
                  themselves get attacked.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/discovery" />
    </>
  );
}
