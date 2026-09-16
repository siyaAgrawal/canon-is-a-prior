import type { Metadata } from "next";
import Link from "next/link";
import { Continue } from "@/components/ui/Continue";
import { Reveal } from "@/components/ui/Reveal";
import { Shell } from "@/components/ui/primitives";
import { sourceSections } from "@/data/sources";

export const metadata: Metadata = {
  title: "Where this came from",
  description:
    "Fanfiction, a myth, a statute, an electron, a table of numbers, an ordering system, a robot, and someone I knew.",
};

/**
 * The long-form origin.
 *
 * Structured as the actual sequence rather than a subject list, which is why
 * none of these sections is named after a discipline. Each one is anchored on a
 * concrete object, because the alternative — "I am interested in how models
 * work" — is the sentence this page exists to avoid.
 */
const THREAD = [
  {
    n: "01",
    anchor: "A character",
    body: [
      "I read a lot of fanfiction. Mostly one pairing, which is not the interesting part. The interesting part is that a single canon — seven books, fixed events, a few hundred pages of the same boy doing the same things — supports tens of thousands of stories that disagree fundamentally about who he is.",
      "Not disagree about what happened. Nobody rewrites the events; a story that changes them stops being about him. They disagree about what the events were evidence *of*.",
      "In one, cruelty is character. In another it is fear with an audience. The scenes are identical. He stays recognisably himself across both, which is the thing I could not get past — because if the evidence is fixed and the person changes, the person was never only the evidence.",
    ],
  },
  {
    n: "02",
    anchor: "A myth",
    body: [
      "I noticed I was doing it to Icarus about a week later, and the case is cleaner because the text is short enough to hold in your head.",
      "Ovid gives the wings, the warning, the climb, the wax, the sea. He does not give a motive. Three thousand years of the story meaning *pride* rests on an assumption the text does not contain — and once you see that, you can swap it for curiosity and watch the fall stop being a punishment and become a price.",
      "Nothing moved except a premise nobody had written down.",
    ],
  },
  {
    n: "03",
    anchor: "A text with authority",
    body: [
      "Law was the first place I found the same shape with the machinery already built for it. Two readings of one statute, both careful, both citing the same clause, and an elaborate apparatus for deciding whose reading binds.",
      "That apparatus is an admission. If the text settled it, you would not need doctrines about who wins.",
      "It is also where the resemblance first showed me its edge. Legal interpretation terminates — a court rules and the question closes, at least procedurally. Reading has nothing of the kind, and an activity that can be closed by authority is not the same activity as one that cannot.",
    ],
  },
  {
    n: "04",
    anchor: "A measurement",
    body: [
      "Then physics, and the version I had been told was wrong. The story is not that scientists thought particles were particles until someone discovered they were waves.",
      "The story is that light started depositing energy in lumps, X-rays started recoiling like billiard balls, and in 1924 de Broglie proposed the reverse — that a particle has a wavelength, λ = h/p, as a number you could go and check. Davisson and Germer checked it three years later.",
      "The anomaly was not in the electron. It was in two words that had been treated as exhausting the options. That is a different kind of failure from getting the answer wrong, and I did not have a name for it.",
    ],
  },
  {
    n: "05",
    anchor: "A rule for changing your mind",
    body: [
      "Bayes' rule gave me the vocabulary and then showed me its own ceiling, which was more useful.",
      "It is exact about one thing: given a set of hypotheses and a sense of how expected the evidence is under each, the update is forced. You cannot keep a prior, keep a likelihood, and refuse the conclusion. That is a real constraint and most arguments about interpretation would be shorter if people stated both inputs.",
      "But it redistributes belief across options you already have. It cannot produce the one you had not thought of, and it has nothing to say about which of two surviving models is better supported. Peirce called the missing step abduction. The gap between 'I updated correctly' and 'I am justified' is where this whole project ended up living.",
    ],
  },
  {
    n: "06",
    anchor: "A table of numbers",
    body: [
      "A dataset is rows plus labels, and only the rows get collected. The labels are decisions — made by people, under deadline, in a schema somebody designed — and a model learns them exactly as confidently as it learns the measurements.",
      "Relabel the same rows and you get a model that has learned a different world and predicts in it with no loss of confidence.",
      "Which raises the question I still find hardest: a representation is good because it keeps what matters for a task and discards the rest. So does a representation that predicts well tell you what the thing *is*, or only what it does under the conditions you happened to sample?",
    ],
  },
  {
    n: "07",
    anchor: "Something I built",
    body: [
      "I wrote an ordering system. The model was clean: a person selects items, confirms, pays.",
      "Almost nobody does that. People order for other people. They change their mind after confirming. They share one thing across four of them and argue about it. They arrive at different times and expect the order to have waited. One person orders, another pays, and neither of them is the account holder.",
      "None of that is edge-case noise around a correct model. It is the actual behaviour, and my model had quietly assumed a customer who is a single decision-making unit. The system did not break because the code was wrong. It broke because the representation had omitted the thing that was really going on.",
    ],
  },
  {
    n: "08",
    anchor: "Something that fell over",
    body: [
      "Same lesson, cheaper: a robot that worked on the bench and not on the floor. Battery voltage sagging under load, a motor that was two percent faster than its twin, friction that changed with the surface.",
      "The code was internally correct the entire time. The world had variables the model did not contain, which is not a moral about persistence. It is a fact about what a model is.",
      "This is the point where I started writing things down, because I had now found the same move in fiction, in a myth, in a courtroom, in a lab, in a dataset, and in my own software — and that is either a discovery or a symptom.",
    ],
  },
  {
    n: "09",
    anchor: "Someone I knew",
    body: [
      "And then the one that stopped being interesting and started being uncomfortable.",
      "You do not meet people. You meet what they said, what they did, what someone told you, what you remember — which is not what happened — and what you were expecting before any of it. Then you build something out of that and talk to what you built.",
      "The model determines what you go looking for. What you find confirms the model. You can know someone for years, be wrong about them the whole time, and never once meet a fact that forces the issue. That is not a claim that people are constructions. They are entirely real. The model is yours and it is not them, and losing that distinction in either direction is how this goes wrong.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-16 sm:pt-28">
        <Shell>
          <div className="max-w-column">
            <p className="kicker">Where this came from</p>
            <h1 className="mt-6 font-display text-d2 leading-[1.05]">
              I kept finding the same uncomfortable moment: the evidence was fixed, and the story
              wasn&rsquo;t.
            </h1>
          </div>
        </Shell>
      </section>

      <Shell className="mt-24">
        <div className="max-w-column">
          {THREAD.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.02}>
              <section className="hair grid gap-x-10 gap-y-5 py-14 sm:grid-cols-[4.5rem_1fr]">
                <div>
                  <p className="font-mono text-[0.62rem] tabular" style={{ color: "rgb(var(--accent))" }}>
                    {t.n}
                  </p>
                  <p
                    className="mt-2 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.14em]"
                    style={{ color: "rgb(var(--faint))" }}
                  >
                    {t.anchor}
                  </p>
                </div>
                <div className="say max-w-measure">
                  {t.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </Shell>

      <section className="py-28">
        <Shell>
          <Reveal>
            <div className="max-w-column">
              <h2 className="font-display text-d3">Which leaves the problem.</h2>
              <div className="say mt-8 max-w-measure">
                <p>
                  Nine places. One move. It felt like a discovery for about two months, and then it
                  started to worry me, because I know what that feeling is worth.
                </p>
                <p>
                  A person who has found a real pattern and a person who is seeing things report the
                  same experience from the inside. It gets clearer with every example. Examples are
                  cheap. Adding one feels like evidence and is not.
                </p>
                <p style={{ color: "rgb(var(--fg))" }}>
                  So I could not tell whether I had found a connection or simply become very good at
                  making them. And there is no amount of further reading that settles that, because
                  more reading is exactly how you get better at making them.
                </p>
              </div>

              <div className="mt-14 border-l-2 pl-6" style={{ borderColor: "rgb(var(--accent))" }}>
                <p className="font-display text-d4 leading-snug">So I built an experiment.</p>
                <div className="say mt-6 max-w-measure">
                  <p>
                    Not to prove the connection. To find out whether I could tell my own real claims
                    from ones I fabricated — so I wrote three fake ones in the same voice, by the
                    same method, and mixed them in with the ones I defend.
                  </p>
                  <p>
                    Then I built instruments for the parts that could actually be measured: what
                    people do when the evidence stops cooperating, which property they treat as
                    decisive when two models both fit, and whether they can tell a confirming
                    observation from one that discriminates.
                  </p>
                  <p>
                    Everything is recorded, the decision rules were fixed before any of it arrived,
                    and the page that reports the results will contradict me if the numbers do.
                  </p>
                </div>
              </div>

              <div className="mt-14 flex flex-wrap gap-4">
                <Link href="/shape" className="btn btn-solid">
                  The three I made up
                </Link>
                <Link href="/discovery" className="btn">
                  What the data says now
                </Link>
              </div>
            </div>
          </Reveal>
        </Shell>
      </section>

      <Shell className="pb-8">
        <Reveal>
          <div className="max-w-column">
            <h2 className="font-display text-d4">Sources</h2>
            <p className="mt-3 max-w-measure text-[0.86rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
              Nothing listed that was not consulted, and nothing described as supporting a claim it
              does not make. Where this project uses an idea more loosely than its source does, the
              note says so.
            </p>
            <div className="mt-10 space-y-12">
              {sourceSections.map((section) => (
                <section key={section.id}>
                  <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.16em]" style={{ color: "rgb(var(--accent))" }}>
                    {section.title}
                  </h3>
                  <ul className="mt-4">
                    {section.sources.map((s) => (
                      <li key={s.id} className="hair py-4">
                        <p className="text-[0.92rem] leading-snug">
                          {s.url ? (
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-4">
                              {s.title}
                            </a>
                          ) : (
                            s.title
                          )}
                        </p>
                        <p className="mt-1 text-[0.8rem]" style={{ color: "rgb(var(--faint))" }}>
                          {s.authors} · {s.year} · <span className="italic">{s.where}</span>
                        </p>
                        <p className="mt-2 max-w-measure text-[0.84rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
                          {s.useNote}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </Reveal>
      </Shell>

      <Continue from="/about" />
    </>
  );
}
