import type { Metadata } from "next";
import Link from "next/link";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell, Boundary } from "@/components/ui/primitives";
import { ForgetButton } from "@/components/ui/ForgetButton";

export const metadata: Metadata = {
  title: "Ethics",
  description: "What is stored, what is not, why, and the trade-offs that buys.",
};

const STORED = [
  ["A random identifier", "Generated in your browser, kept in your browser. It lets several answers from one person be recognised as one person's during analysis. It links to nothing and traces back to nobody."],
  ["Which instrument", "Which of the seven you used."],
  ["Ids and counts", "Which reading you held, what you did with each fact, how many times you switched. Drawn from fixed vocabularies and checked server-side against a closed schema."],
  ["Your reasoning, if you write any", "Verbatim, up to 600 characters, from the boxes marked 'stored verbatim'. Always optional, never required to continue, and control characters are stripped before writing. This is the only place your own words are kept."],
  ["Elapsed time", "Milliseconds. Used only to spot answers submitted too fast to have been read."],
];

const NOT = [
  "Name, email or account — there is no account",
  "IP address",
  "Any analytics or tracking cookie. There is no analytics on this site at all",
  "Location, device fingerprint, referrer",
  "Anything typed anywhere except the boxes explicitly marked 'stored verbatim'",
  "Any private message, of yours or of anybody else's",
];

export default function EthicsPage() {
  return (
    <>
      <section className="pt-16 sm:pt-24">
        <Shell>
          <div className="max-w-column">
            <h1 className="font-display text-d2">What is stored</h1>
            <p className="say mt-7 max-w-measure">
              Enough to answer the research question and nothing else. This page is plain on purpose
              — it is the part of the project that has to be checkable rather than persuasive.
            </p>
          </div>
        </Shell>
      </section>

      <Shell className="mt-16">
        <div className="max-w-column space-y-20">
          <Reveal>
            <section>
              <h2 className="font-display text-d4">Kept</h2>
              <dl className="mt-6">
                {STORED.map(([k, v]) => (
                  <div key={k} className="hair grid gap-1.5 py-4 sm:grid-cols-[11rem_1fr] sm:gap-7">
                    <dt className="text-[0.94rem]">{k}</dt>
                    <dd className="text-[0.88rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 max-w-measure text-[0.86rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                Payloads are closed, not merely validated: the schema declares which keys may be
                written and the API strips everything else before storing. A field the schema does
                not know is dropped rather than kept as a blob, and that is asserted in the test
                suite.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-d4">Not kept</h2>
              <ul className="mt-6 space-y-2.5">
                {NOT.map((n) => (
                  <li key={n} className="flex gap-3 text-[0.94rem] leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                    <span aria-hidden="true" className="mt-[11px] h-px w-3 flex-none" style={{ background: "rgb(var(--accent))" }} />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-d4">Three trade-offs, stated rather than buried</h2>
              <div className="mt-7 space-y-10">
                <Boundary title="Anonymity costs deletion">
                  <p>
                    Nothing links a stored row to you, so no individual answer can be found and
                    removed on request. Stronger anonymity in exchange for no deletion mechanism. You
                    can clear the identifier your browser holds, which stops future answers being
                    grouped with past ones.
                  </p>
                </Boundary>
                <Boundary title="A worse dataset, on purpose">
                  <p>
                    Real screenshots of ambiguous exchanges would be far richer. The person who wrote
                    a message cannot consent to its use, and only the person who received it would
                    ever be asked — which is the wrong person. So all thirty-four language scenarios
                    are written for this experiment and the eight myth ones paraphrase texts that
                    have been public for millennia. The cost is artificiality, and it is listed as a
                    limitation on the <Link href="/lab">lab page</Link> rather than argued away.
                  </p>
                </Boundary>
                <Boundary title="This page used to say the opposite">
                  <p>
                    Until this build, nothing you typed was stored — there was nowhere to type, and
                    the site said so with some satisfaction. That was the wrong call. What someone
                    answered turns out to be far less informative than why, and no fixed vocabulary
                    recovers a reason.
                  </p>
                  <p>
                    So reasoning boxes exist now, optional and capped, labelled where they appear
                    rather than only here. The earlier claim is retracted in the{" "}
                    <Link href="/log">log</Link> rather than quietly edited out, because a project
                    about protecting readings should show what it stopped protecting.
                  </p>
                </Boundary>
                <Boundary title="Refusing rather than losing">
                  <p>
                    On a platform whose filesystem does not survive a request, the site refuses to
                    store rather than accepting a response and quietly losing it. You get a notice
                    before you start and a readable error if you submit anyway. A participant told
                    their answer was recorded, whose answer was not, is worse than an error message.
                  </p>
                </Boundary>
              </div>
              <div className="mt-10">
                <ForgetButton />
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display text-d4">Integrity</h2>
              <div className="say mt-6 max-w-measure">
                <p>
                  No participant counts, results, accuracy figures, model performance numbers,
                  significance claims, endorsements or citations here are invented. Where the dataset
                  is empty the page says zero. Where a prediction fails it stays on the{" "}
                  <Link href="/lab">lab page</Link> marked failed. Where a connection was abandoned it
                  stays on the <Link href="/shape">claims page</Link> marked abandoned.
                </p>
                <p>
                  The one place the project invents anything is the three control claims on{" "}
                  <Link href="/shape">/shape</Link>, and it discloses them on the same screen it
                  reveals everything else.
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
