import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHead, Reading, Shell, PullQuote, Rule, NoteCard, Annotation } from "@/components/ui/primitives";
import { JourneyNav } from "@/components/ui/JourneyNav";
import { Reveal } from "@/components/ui/Reveal";
import { FiveKinds } from "@/components/philosophy/FiveKinds";

export const metadata: Metadata = {
  title: "When should we change the story?",
  description:
    "Bayes, Peirce, Popper, Kuhn, Duhem–Quine and hermeneutics — each tied to something you actually did earlier on this site.",
};

const THINKERS = [
  {
    id: "bayes",
    name: "Bayes",
    claim: "Belief revision has a shape, and it can be written down.",
    body: [
      "If you hold beliefs as degrees rather than as yes-or-no commitments, there is exactly one rule for updating them that keeps you from being led into a guaranteed loss. That is not a metaphor — it is a theorem about betting, proved in various forms since the 1930s. The rule is the one from chapter two.",
      "What it does not do is tell you where to start, and it does not tell you what the options are. Feed it a hypothesis list that omits the true explanation and it will confidently distribute your belief across explanations that are all wrong, with no internal signal that anything has gone missing.",
    ],
    didIt: "You performed a simplified Bayesian update the moment you moved a slider after reading a new fact.",
    href: "/experiment",
  },
  {
    id: "peirce",
    name: "Peirce",
    claim: "Somebody has to invent the hypothesis first.",
    body: [
      "Peirce's abduction is the step nobody formalises well: a surprising fact is observed; if some hypothesis were true, the fact would be a matter of course; therefore there is reason to suspect that hypothesis. It is not deduction, because the conclusion could be false. It is not induction, because nothing is being generalised from a sample. It is the generation of a candidate.",
      "This is the step the experiment on this site cannot support, and the omission is structural rather than lazy. Every scenario gives you a fixed list of readings and no box to write a fifth. What you did was distribute belief inside a hypothesis space somebody else chose — which happens to be an exact description of what a canon does to a reader.",
    ],
    didIt: "You noticed, perhaps, that none of the four readings of Icarus was the one you would have written.",
    href: "/bayes",
  },
  {
    id: "popper",
    name: "Popper",
    claim: "Ask what would show you wrong.",
    body: [
      "Popper's criterion is about what a theory forbids. A theory compatible with every possible observation has told you nothing about the world, however satisfying it is to hold. The test is not 'can I find support for this' — you almost always can — but 'what would I have to see to give it up'.",
      "Applied to reading, the question becomes uncomfortable and useful in the same move: what would you have to find in the text to abandon your interpretation? If the answer is nothing, that is worth knowing about yourself before it is worth knowing about the text. Note that Popper would have rejected the Bayesian framing used on this site; the two positions are set side by side here rather than blended, because they genuinely disagree.",
    ],
    didIt: "Every premise in the counterfactual engine carries a line saying what it cannot absorb. That line is the Popperian one.",
    href: "/canon",
  },
  {
    id: "kuhn",
    name: "Kuhn",
    claim: "Sometimes the frame goes, not the belief.",
    body: [
      "Kuhn's picture has normal science as puzzle-solving inside a paradigm that supplies the problems, the standards and the categories. Anomalies accumulate; for a long time they are absorbed as open puzzles; and then, sometimes, the frame itself gives way and the anomalies become the new frame's ordinary results.",
      "The contested part of his account is the claim that paradigm choice is not fully settled by shared evidence, because the paradigms partly determine what counts as evidence. That is not the same as saying theory choice is irrational — he explicitly denied that in the 1969 postscript, and the misreading is common enough to be worth naming.",
    ],
    didIt: "De Broglie's proposal is a small, clean instance: the anomaly was not a wrong number but a pair of categories that had been treated as alternatives.",
    href: "/category",
  },
  {
    id: "duhem",
    name: "Duhem and Quine",
    claim: "Evidence arrives addressed to a bundle, not to a hypothesis.",
    body: [
      "A prediction never follows from a hypothesis alone. It follows from the hypothesis plus your instruments, your background theory, and your assumptions about the conditions. When the prediction fails, one of those is wrong and the failure does not say which. Duhem made the point about physics; Quine extended it until any statement could in principle be held true, given enough adjustment elsewhere.",
      "That is not permission. It is a statement about price. You can always save a reading — the question is what you had to give up to do it, and whether what remains is still making contact with anything.",
    ],
    didIt: "In the Orpheus scenario the two surviving classical sources assign different causes. There is no third source to break the tie.",
    href: "/underdetermination",
  },
  {
    id: "hermeneutics",
    name: "Hermeneutics",
    claim: "You cannot read from nowhere, and that is a condition rather than a flaw.",
    body: [
      "The tradition running through Schleiermacher and Dilthey to Gadamer takes the interpreter's situation as what makes interpretation possible. Gadamer's word — usually translated 'prejudice' — names the fore-structure you bring to a text, without which the text would not be legible at all. Understanding happens when that structure meets something that resists it.",
      "This is the closest thing in the humanities to what this project calls a prior, and the resemblance has a limit worth stating: Gadamer would have resisted the quantification, and his 'fusion of horizons' is not a posterior. The comparison is about the role the starting position plays, not about turning reading into arithmetic.",
    ],
    didIt: "Your first distribution, before any evidence, was your fore-structure with a number attached to it.",
    href: "/bayes",
  },
];

export default function PhilosophyPage() {
  return (
    <>
      <ChapterHead
        n="09"
        kicker="Theory"
        title="When should we change the story?"
        standfirst="Six positions, each attached to something you already did on this site. They are not laid out as a survey — they are laid out as answers to the question of when a revision is warranted, and they do not entirely agree with each other."
      />

      <Shell className="mt-14">
        <Reading>
          <Reveal>
            <p className="prose-note">
              The question in the title sounds practical and turns out not to be. Before you can
              answer it you have to separate some properties that ordinary language keeps welded
              together — because most disagreements about interpretation are disagreements about
              which property is being claimed.
            </p>
          </Reveal>
        </Reading>
      </Shell>

      <Shell className="mt-10">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <FiveKinds />
          </Reveal>
        </div>
      </Shell>

      <Shell className="mt-20">
        <Reading>
          <Reveal>
            <PullQuote>
              A coherent story is not a supported story. A supported story is not a true one. A
              useful story can be none of the above.
            </PullQuote>
          </Reveal>

          <Reveal>
            <div className="prose-note">
              <p>
                This is also the sharpest thing that can be said about language models without
                needing any data at all. A model produces coherent text; that is close to a
                definition of what it does. Coherence is the property it is optimised toward, and it
                is the property humans use as a proxy for the other four. The mismatch is not a bug
                in the model. It is a bug in the proxy.
              </p>
            </div>
          </Reveal>

          <Rule label="Six positions" />
        </Reading>
      </Shell>

      <Shell className="mt-4">
        <Reading className="space-y-16">
          {THINKERS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.03}>
              <article className="border-t border-rule pt-8">
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <h2 className="font-display text-3xl leading-none">{t.name}</h2>
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-rust">{t.claim}</p>
                </div>
                <div className="prose-note mt-5">
                  {t.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
                <Link
                  href={t.href}
                  className="mt-5 block border-l-2 border-gold bg-gold/[0.05] py-3 pl-4 text-[0.88rem] leading-relaxed text-ink transition-colors hover:bg-gold/[0.09]"
                >
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-gold">
                    You already did this —{" "}
                  </span>
                  {t.didIt}
                </Link>
              </article>
            </Reveal>
          ))}
        </Reading>
      </Shell>

      <Shell className="mt-20">
        <Reading>
          <Reveal>
            <h2 className="text-display-m">So: when should you change the story?</h2>
            <div className="prose-note mt-6">
              <p>
                There is no rule, and the absence of one is not a gap in the literature. What there
                is, is a set of questions worth asking in order.
              </p>
            </div>
            <ol className="mt-8 space-y-5">
              {[
                ["Is the evidence surprising under your reading?", "If it is exactly what you expected, it is not evidence about anything and nothing should move. The most common error is moving anyway, because the fact is new and newness feels like information."],
                ["Is it more surprising under your reading than under the alternatives?", "This is the whole of the likelihood. A fact that every reading predicts equally cannot separate them, however striking it is."],
                ["What did you have to give up to keep your reading?", "You can always save it. The Duhem–Quine point is that the price is the diagnostic, not the possibility."],
                ["Would anything change your mind?", "If nothing would, you are not holding an interpretation. You are holding an identity, and the two behave very differently under pressure."],
                ["Is the question itself the wrong shape?", "The rarest and most valuable move, and the one that no updating rule can produce for you. Wave or particle. Curiosity or hubris. Sometimes the answer is that the 'or' was the mistake."],
              ].map(([q, a], i) => (
                <li key={q} className="grid gap-2 sm:grid-cols-[2rem_1fr] sm:gap-5">
                  <span className="font-mono text-[0.66rem] tracking-[0.18em] text-rust tabular">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-[1.12rem] leading-snug">{q}</span>
                    <span className="mt-1.5 block text-[0.9rem] leading-relaxed text-ink-soft">{a}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <div className="mt-12">
              <NoteCard title="What this section is not claiming" tone="warn">
                <p>
                  That literary interpretation and scientific inference are the same activity. They
                  are not, and the difference is not subtle: a physical hypothesis can be confronted
                  with an experiment designed to destroy it, and a reading of Ovid cannot.
                </p>
                <p>
                  The claim is narrower and survives that objection. Both involve a starting position
                  that is not itself derived from the evidence, both involve revision under
                  constraint, and in both the interesting cases are the ones where the evidence runs
                  out before the question does.
                </p>
              </NoteCard>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-10">
              <Annotation tone="indigo">
                Everything on this site is connected to everything else in some way. The map is where
                each of those connections has to say how strong it actually is.
              </Annotation>
            </div>
          </Reveal>
        </Reading>
      </Shell>

      <JourneyNav pathname="/philosophy" />
    </>
  );
}
