/**
 * The contents of /lab.
 *
 * Nothing in this file describes a result. The RESULTS section of the lab page is
 * rendered from the live dataset, and if the dataset is empty the page says so.
 * What is written here is the design: the question, the hypotheses stated before
 * seeing data, the method, and the known limits.
 */

export interface Hypothesis {
  id: string;
  statement: string;
  /** What would count as evidence against it. Required — a hypothesis that forbids nothing is not doing work. */
  wouldBeWrongIf: string;
  /** Where this came from. */
  motivation: string;
}

export const researchQuestion = {
  short: "When evidence is incomplete, how do humans and language models revise their interpretations — and what makes one interpretation more justified than another?",
  long: [
    "The first half of that question is empirical and this site is built to answer a small piece of it. Give a person an ambiguous situation and a fixed set of readings. Ask how much weight they put on each. Then give them one new fact and ask again. The measurable quantity is the movement: how far, in which direction, and how much people differ from each other after seeing the same thing.",
    "Then run the identical procedure on a language model, with the same scenarios and the same constraint that the numbers sum to one hundred. Now the two trajectories can be laid side by side on the same axes.",
    "The second half of the question is philosophical and cannot be settled by collecting responses. A distribution tells you what people believed, never whether they were right to. But the empirical work sharpens the philosophical question, because it shows exactly where interpretations stop being determined by the evidence — and that is the point at which the question of justification starts to matter.",
  ],
};

export const hypotheses: Hypothesis[] = [
  {
    id: "h1",
    statement:
      "Participants will move substantially on the first piece of evidence and less on later ones, even when later evidence is more diagnostic.",
    wouldBeWrongIf:
      "Mean update magnitude is flat or increasing across evidence positions, or the ordering of update sizes tracks how diagnostic the items were designed to be rather than their position.",
    motivation:
      "An order effect, not a rational one. The scenario set is built so that in several cases the strongest discriminator comes last — the base-rate items in the language track especially.",
  },
  {
    id: "h2",
    statement:
      "Disagreement between participants will not fall to zero as evidence accumulates. Some scenarios will end with two readings sharing most of the mass across the group.",
    wouldBeWrongIf:
      "Mean pairwise disagreement declines monotonically toward zero in most scenarios, with a single interpretation taking the majority of mass for nearly every participant.",
    motivation:
      "Several scenarios were designed to underdetermine deliberately — the Orpheus scenario, where the two classical sources disagree about the cause, and the withdrawn job posting. If they do not underdetermine in practice, the design failed and that is worth knowing.",
  },
  {
    id: "h3",
    statement:
      "A language model asked for the same distributions will report lower entropy than the human group average — it will commit harder.",
    wouldBeWrongIf:
      "Model entropy matches or exceeds the human mean, or varies enough across prompt versions that no stable comparison exists.",
    motivation:
      "Stated as a prediction, not a conclusion. It is the intuition behind the phrase 'coherence is not certainty', and if the data contradicts it the phrase needs rethinking, not the data.",
  },
  {
    id: "h4",
    statement:
      "Additional context will reduce the model's entropy more than it reduces human disagreement.",
    wouldBeWrongIf:
      "Human disagreement falls at least as fast as model entropy, or the model's entropy rises with context in scenarios where the added fact is genuinely ambiguous.",
    motivation:
      "This is the sharpest version of the project's question. A model that becomes confident exactly where people remain divided is telling you something about the model. A model that becomes less certain when given ambiguous context would be evidence against the worry entirely.",
  },
  {
    id: "h5",
    statement:
      "In the myth track, participants who see the engineering framing of Daedalus's warning will shift mass away from 'hubris' more than the equivalent-strength evidence shifts other readings.",
    wouldBeWrongIf:
      "The hubris reading is stable against that item, which would suggest the canonical reading is anchored by something other than the evidence presented.",
    motivation:
      "A direct test of the canon-as-prior idea. If an inherited reading resists evidence that a non-inherited reading would yield to, that asymmetry is the interesting quantity.",
  },
];

export const method = {
  steps: [
    {
      title: "Stimulus",
      body: "Forty-two scenarios: eight paraphrased from public-domain classical texts, thirty-four written for this experiment. No real private messages are used, and no participant's own material is collected. Each scenario presents a context, one ambiguous act, three to five interpretations, and two or three evidence items.",
    },
    {
      title: "Elicitation",
      body: "The participant distributes one hundred points across the interpretations using sliders that enforce the constraint. Raising one reading necessarily lowers another — the constraint is the instrument, since an unconstrained rating scale would let someone call everything plausible and measure nothing.",
    },
    {
      title: "Evidence",
      body: "Evidence items are revealed one at a time in a fixed order per scenario. After each, the participant re-distributes. The previous distribution stays visible: this measures revision, not recall.",
    },
    {
      title: "What is stored",
      body: "A random session identifier, the scenario id, the ordered list of distributions, an optional confidence rating, and elapsed milliseconds. No account, no email, no name, no IP address, no demographics, no cookies used for tracking.",
    },
    {
      title: "Model runs",
      body: "The same scenarios are presented to a language model through an evaluation interface that requires numeric distributions summing to one hundred, plus a brief rationale per step. Every stored model response records the exact model identifier and a prompt version. Responses produced under different prompt versions are never pooled.",
    },
    {
      title: "Analysis",
      body: "Movement is measured as total variation distance between consecutive distributions. Within-group disagreement is mean pairwise total variation. Commitment is Shannon entropy, normalised by the maximum for that scenario's option count. Kullback–Leibler divergence is reported only with explicit additive smoothing, and labelled as smoothed wherever it appears.",
    },
  ],
  preRegistration:
    "The hypotheses above were written before any response was collected. They live in one file in this repository — research/lab.ts — so that putting the project under version control makes any later edit to them visible as a dated change rather than a silent one. If they do change, the change and its reason go in the log; the original is not replaced quietly.",
};

export const failures: { title: string; body: string }[] = [
  {
    title: "The first version showed participants why each evidence item was written",
    body:
      "Each evidence item carries a design note explaining what it was built to discriminate. In the first build these were visible alongside the evidence — which tells the participant what update the designer expects, and would have measured compliance rather than interpretation. The notes are now shown only after the final submission.",
  },
  {
    title: "Unconstrained sliders measured almost nothing",
    body:
      "An early design let each interpretation be rated independently from zero to one hundred. Everything drifted upward: readings are cheap to find plausible when plausibility is not scarce. Forcing the total to one hundred was the change that made the instrument informative, and it is also the thing that makes it feel uncomfortable to use.",
  },
  {
    title: "Two scenarios gave the answer away and were rewritten",
    body:
      "Early drafts of the 'Thanks.' and 'Ok then.' scenarios described the sender's mood in the context paragraph. That is the measurement leaking into the stimulus. Both were rewritten so the context contains only what an actual recipient would have.",
  },
  {
    title: "KL divergence was unusable as first implemented",
    body:
      "Participants routinely assign an interpretation zero, which makes an unsmoothed KL divergence infinite. The metric now applies additive smoothing before computing, and every place it is displayed says so. The alternative — silently dropping those participants — would have quietly deleted the most decisive responses in the dataset.",
  },
];

export const limitations: { title: string; body: string }[] = [
  {
    title: "Self-selection",
    body: "Everyone in this dataset chose to do an online experiment about belief revision in Greek myth. That is not a sample of anything except people who would do that. No claim on this site generalises beyond the people who happened to participate.",
  },
  {
    title: "Sample size",
    body: "Small, for as long as it is small, and the dashboard shows the exact number rather than a percentage that hides it. Nothing here is tested for statistical significance, because with these numbers a significance test would be theatre.",
  },
  {
    title: "Wording effects",
    body: "Each interpretation is a label plus one gloss, and both were written by one person. A reading that sounds generous and a reading that sounds petty do not start from the same place, however carefully the evidence is balanced.",
  },
  {
    title: "Order is fixed, not randomised",
    body: "Evidence is presented in the same order to every participant, which means order effects and evidence effects are confounded. Randomising the order is the single most valuable change to make next, and it has not been made yet.",
  },
  {
    title: "Numbers are reports, not beliefs",
    body: "Asking someone to put a number on a reading changes the reading. The heuristics-and-biases literature is thirty years of reasons to treat elicited probabilities as approximate at best — anchoring on the starting position of a slider is a live risk in this exact design.",
  },
  {
    title: "A model's stated probability is not a probability",
    body: "Verbalised confidence from a language model is a token sequence that has been shaped to look like a probability. It is sensitive to prompt wording, and it changes between model versions. This site pins a prompt version to every stored response for that reason, and still cannot claim the numbers are calibrated.",
  },
  {
    title: "There is no ground truth here",
    body: "The scenarios have no correct answer, by construction. That means accuracy cannot be scored and no proper scoring rule applies. What can be measured is movement, spread and agreement — and those are not the same as being right.",
  },
  {
    title: "Narrative interpretation is not scientific inference",
    body: "This is the project's own central caveat. A reading of Icarus and a hypothesis about electron diffraction are not the same kind of object: one has an experiment that can go against it and the other does not. The site argues that they share a structure. It does not argue that they share a standard of evidence.",
  },
  {
    title: "One language, one cultural frame",
    body: "The scenarios are in English and assume conventions about politeness, directness and silence that are not universal. The blunt-reply scenario is about that assumption; it does not escape it.",
  },
];

export const nextQuestions: string[] = [
  "Randomise evidence order so that order and content stop being confounded.",
  "Run the same scenario against several models and several prompt versions, and report the spread between them rather than a single number.",
  "Ask a subset of participants to predict the group distribution as well as giving their own — a cheap way to find out whether people know they are unusual.",
  "Find out whether participants who resist an evidence item can say what would have moved them. Popper's question, asked of a reader.",
  "Build a version where the participant writes the next evidence item themselves: what would you need to see?",
];
