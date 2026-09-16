import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, Shell } from "@/components/ui/primitives";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { ForgetButton } from "@/components/ui/ForgetButton";

export const metadata: Metadata = {
  title: "What is stored",
  description: "Almost nothing, and the reasons the dataset is deliberately poorer than it could be.",
};

const STORED = [
  ["A random identifier", "Made in your browser, kept in your browser. It lets several answers from one person be recognised as one person's during analysis. It links to nothing."],
  ["Which scenario", "One of forty-two."],
  ["Your distributions", "One per stage, including where you started."],
  ["Confidence", "Optional. Null if you didn't touch it."],
  ["Elapsed time", "Used only to spot answers submitted too fast to have been read."],
];

const NOT = [
  "Name, email, account — there is no account",
  "IP address",
  "Any analytics or tracking cookie. There is no analytics on this site",
  "Location, device fingerprint, referrer",
  "Anything you typed, because there is nowhere to type",
  "Any private message, of yours or anyone's",
];

export default function EthicsPage() {
  return (
    <>
      <PageHead
        title="What is stored"
        note={
          <p>
            One experiment on this site records anything. The rest run in your browser and are gone
            when you close the tab.
          </p>
        }
      />

      <Shell className="mt-14">
        <div className="max-w-column space-y-20">
          <Reveal>
            <section>
              <h2 className="font-display text-display-s">Kept</h2>
              <dl className="mt-6">
                {STORED.map(([k, v]) => (
                  <div key={k} className="hair grid gap-1.5 py-4 sm:grid-cols-[11rem_1fr] sm:gap-7">
                    <dt className="text-[0.92rem]">{k}</dt>
                    <dd className="text-[0.88rem] leading-relaxed text-ink-faint">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-display-s">Not kept</h2>
              <ul className="mt-6 space-y-2">
                {NOT.map((n) => (
                  <li key={n} className="flex gap-3 text-[0.92rem] leading-relaxed text-ink-soft">
                    <span aria-hidden="true" className="mt-[10px] h-px w-3 shrink-0 bg-rust" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-display-s">Why the dataset is worse than it could be</h2>
              <div className="say mt-6 max-w-measure">
                <p>
                  The obvious way to build the language experiment would be to collect real
                  screenshots of ambiguous exchanges. It would produce a far better dataset.
                </p>
                <p>
                  The person who wrote a message cannot consent to its use. Only the person who
                  received it would ever be asked, and that is the wrong person. So all thirty-four
                  are written, and the eight myth scenarios paraphrase texts that have been public for
                  millennia.
                </p>
                <p>
                  The cost is artificiality, which is real, and is listed as a limitation rather than
                  argued away.
                </p>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-display-s">The trade-off nobody mentions</h2>
              <div className="say mt-6 max-w-measure">
                <p>
                  Because answers are anonymous, they cannot be found and deleted later on request.
                  Nothing links a stored row to you. Stronger anonymity in exchange for no deletion
                  mechanism — stated here rather than buried.
                </p>
                <p>
                  You can clear the identifier your browser holds at any time, which stops future
                  answers being grouped with past ones.
                </p>
              </div>
              <div className="mt-7">
                <ForgetButton />
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-display-s">Integrity</h2>
              <div className="say mt-6 max-w-measure">
                <p>
                  No participant counts, results, accuracy figures, model performance numbers,
                  significance claims, endorsements or citations here are invented. Where the dataset
                  is empty the page says zero. Where a prediction fails it stays on the{" "}
                  <Link href="/lab" className="underline decoration-dotted underline-offset-2 hover:text-ink">
                    method page
                  </Link>{" "}
                  marked as failed. Where a connection was abandoned it stays on the{" "}
                  <Link href="/shape" className="underline decoration-dotted underline-offset-2 hover:text-ink">
                    claims page
                  </Link>{" "}
                  marked as abandoned.
                </p>
                <p className="text-ink">
                  Everything else here is an argument about interpretation. This is the part that
                  makes the arguments worth reading.
                </p>
              </div>
            </section>
          </Reveal>
        </div>
      </Shell>

      <Continue from="/ethics" />
    </>
  );
}
