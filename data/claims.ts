/**
 * Structural claims, for the reader to judge.
 *
 * The instrument on /shape shows these one at a time, without saying which are
 * mine, which I have given up, and which I wrote as controls. The reader decides
 * whether each is a resemblance that is genuinely there or one somebody imposed,
 * and only then sees the verdict.
 *
 * The controls matter. Three of these were written to be exactly as pleasing as
 * the real ones and to survive a first reading — because if my defensible claims
 * are indistinguishable from my fabricated ones, that is a finding about the
 * method, and it should land on the reader rather than on a footnote.
 *
 * `verdict` is this project's current position, not a fact about the world.
 */

export type Verdict = "holds" | "weakened" | "abandoned" | "control";

export interface Claim {
  id: string;
  /** The two things being connected. */
  between: [string, string];
  /** The proposed shared structure, stated as attractively as it deserves. */
  claim: string;
  verdict: Verdict;
  /** Why the verdict. Written to be readable by someone who disagrees. */
  reasoning: string;
  /** What would change the verdict. Required: a claim that forbids nothing is not one. */
  wouldChangeIf: string;
}

export const claims: Claim[] = [
  {
    id: "canon-prior",
    between: ["A literary canon", "A Bayesian prior"],
    claim:
      "Both are starting positions that determine how much work new evidence has to do before it will be taken seriously, and neither is itself produced by the evidence it governs.",
    verdict: "weakened",
    reasoning:
      "The role is genuinely shared and the project is named after it. But a prior is a normalised distribution over a stated hypothesis space, updated by a rule that makes the update forced. A canon has no hypothesis space, no normalisation, and no rule — two readers with 'the same canon' can update in opposite directions without either violating anything. What survives is a claim about function. What does not survive is the equation in the title, which is why the title is a first discovery rather than a thesis.",
    wouldChangeIf:
      "Someone showed that canonical readings do constrain revision in a way that can be violated — that there is something a reader can do with a canon which is not merely unusual but incoherent.",
  },
  {
    id: "fanfic-counterfactual",
    between: ["Rewriting a character", "Counterfactual reasoning"],
    claim:
      "Both fix a body of facts, alter one antecedent, and work out which consequences have to move — and in both the interesting output is what stayed put.",
    verdict: "holds",
    reasoning:
      "This is the strongest connection in the project and the only one where the structure is close to identical rather than merely similar. Both operate on a fixed factual base. Both alter a single antecedent. Both are evaluated by coherence of the downstream consequences rather than by observation, because the altered world is not available to check. The difference is what they are for — one is used to support causal claims about the actual world, the other is not used to support claims at all — but the operation is the same operation.",
    wouldChangeIf:
      "It turned out that retellings do not in fact hold the factual base fixed, and that what reads as a changed premise is usually a quietly changed fact. Worth testing on an actual corpus and I have not.",
  },
  {
    id: "debroglie-category",
    between: ["Wave–particle duality", "Inherited interpretive categories"],
    claim:
      "In both, an anomaly that looks like a problem with the object turns out to be a problem with a pair of words that had been treated as exhausting the options.",
    verdict: "weakened",
    reasoning:
      "The physics is accurate and the history is accurate, and the philosophical move — the failure was partly in the categories — is one physicists themselves made. But the resemblance stops hard at one point: in physics there is a relation, V² + D² ≤ 1, which is derived, numerically precise and experimentally tested. It says exactly how the two descriptions trade against each other. There is no analogue of that anywhere else in this project. Nothing in reading has a theorem. So this is a good illustration of a move and a bad model of one.",
    wouldChangeIf:
      "Nothing would strengthen it to 'holds'. The absence of a formal constraint on the interpretive side is structural, not a gap in the research.",
  },
  {
    id: "person-dataset",
    between: ["A person", "A dataset"],
    claim:
      "You never have the whole of either. You have records, sampled unevenly, and whatever model you built to make the records cohere.",
    verdict: "weakened",
    reasoning:
      "The epistemic situation really is similar and the comparison is useful for one specific purpose: noticing that your model of someone is not them. But a dataset does not have a perspective on being modelled, does not change in response to your model of it, and is not owed anything. A person fails all three. The last one is not a technicality — most of what is wrong with treating people as datasets is contained in it.",
    wouldChangeIf:
      "Nothing. This one is kept because it is useful and flagged because it is dangerous, which is a different status from 'probably true'.",
  },
  {
    id: "law-interpretation",
    between: ["Legal interpretation", "Literary interpretation"],
    claim:
      "Both read a fixed authoritative text against inherited frameworks, and in both the framework partly determines what counts as relevant in the text.",
    verdict: "holds",
    reasoning:
      "Defensible, and less original than it feels — the resemblance has been argued over by legal theorists and literary critics for decades, in both directions, and my noticing it independently is not evidence for it. It holds because the machinery is visibly the same: canonical readings, competing schools about what the text is for, and explicit doctrines about whose reading wins. That last part is the difference worth keeping in view. Law has an authority that terminates the argument. Reading has nothing of the kind, and the terminating authority changes what the activity is.",
    wouldChangeIf:
      "Someone showed that legal reasoning's binding-authority structure makes the interpretive resemblance superficial — that the thing doing the work is institutional, not hermeneutic.",
  },
  {
    id: "llm-prior",
    between: ["A language model's training distribution", "A prior"],
    claim:
      "Both determine what reading is available before the particular evidence arrives.",
    verdict: "weakened",
    reasoning:
      "The functional similarity is real and it is why the comparison on this site is worth making at all. But the training distribution is implicit, not normalised over any stated hypothesis space, not reportable by the model, and not updated by anything resembling Bayes' rule during inference. Four disanalogies is a lot for a two-term comparison. It survives as a description of a role and nothing more.",
    wouldChangeIf:
      "Evidence that in-context updating in a model is well approximated by Bayesian updating over an identifiable hypothesis space. There is research arguing versions of this; I have not read enough of it to have a position, which is itself the honest status.",
  },
  {
    id: "grief-compression",
    between: ["Grief", "Lossy compression"],
    claim:
      "Both discard most of the original and keep the features that matter most to whoever is doing the keeping, which is why what remains feels both true and insufficient.",
    verdict: "control",
    reasoning:
      "I wrote this one. It is not a claim this project holds. It is here because it is exactly as pleasing as the real connections above, arrives with the same cadence, and survives about ninety seconds of thought before you notice that 'discards information' is true of almost every process and does no work. If you marked it as found, that is the more useful result, and it is the reason this page exists.",
    wouldChangeIf: "Nothing. It was written to be plausible and empty.",
  },
  {
    id: "immune-canon",
    between: ["The immune system", "A canon"],
    claim:
      "Both maintain a stored model of what is normal, and both respond to novelty by deciding whether it is a variant of something known or a genuine outsider.",
    verdict: "control",
    reasoning:
      "Also mine, also not a real claim. This one is harder, because the biology is accurate and self/non-self discrimination genuinely is a classification problem against a stored model. But the resemblance is at the level of 'both classify things', which is a description of an enormous number of unrelated processes. If you can state the shared structure only at a level that generic, you have found a word, not a structure.",
    wouldChangeIf: "Nothing. Kept as a control.",
  },
  {
    id: "narrative-identity",
    between: ["Rewriting a character", "Rewriting yourself"],
    claim:
      "Changing one assumption about your own motives reorganises your autobiography the way changing a premise reorganises a retelling — same events, different person.",
    verdict: "abandoned",
    reasoning:
      "I believed this for several weeks and it is the reason for a lot of this project's early notes. I gave it up for a specific reason: in a retelling the factual base is fixed and public, and in autobiography it is neither. What feels like changing an assumption about yourself is usually accompanied by remembering different events, weighting them differently, or discovering new ones. So the operation is not the one I claimed — the thing I said was held constant is exactly the thing that moves. It is left here rather than deleted because a project about protecting readings should show what it stopped protecting.",
    wouldChangeIf:
      "Longitudinal evidence that people's recalled facts stay stable across genuine reinterpretation of their own motives. I suspect the opposite, but I have not looked properly.",
  },
  {
    id: "evolution-revision",
    between: ["Natural selection", "Belief revision"],
    claim:
      "Both are processes where variants are generated, tested against an environment, and retained in proportion to how well they fit.",
    verdict: "control",
    reasoning:
      "The third control, and the one I was most tempted by. There is a real literature drawing this comparison, which makes it feel more legitimate than the other two. But selection has no representation of the environment anywhere in it, and belief revision is nothing but representation. A process that fits without representing and a process that is entirely representing do not share the structure this project is about. That I wanted this one to be true is itself data.",
    wouldChangeIf: "Nothing, for the purposes of this project. Kept as a control.",
  },
];

export const VERDICT_LABEL: Record<Verdict, string> = {
  holds: "Holds",
  weakened: "Weakened",
  abandoned: "Abandoned",
  control: "Written as a control",
};
