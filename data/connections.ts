/**
 * The connection map.
 *
 * This is the handwritten sheet the project started from, made checkable. Every edge
 * carries a `claim` — a sentence saying what the connection actually asserts — and a
 * `strength`. "Structural" means the two things share a form that can be stated
 * precisely. "Analogical" means the comparison is suggestive and has known
 * disanalogies, which are named. "Historical" means one actually influenced the other.
 *
 * Requiring every line to declare its own strength is the discipline that stops a
 * connection map from becoming a claim that everything is connected.
 */

export type EdgeStrength = "structural" | "analogical" | "historical";

export interface MapNode {
  id: string;
  label: string;
  cluster: "physics" | "inference" | "myth" | "machine";
  /** Position as a percentage of the canvas, laid out to echo the original sheet. */
  x: number;
  y: number;
  /** The one-line reason this node is on the sheet at all. */
  note: string;
  /** Expanded reading shown when the node is opened. */
  detail: string;
  /** Where in the site this idea is actually used. */
  href?: string;
  hrefLabel?: string;
}

export interface MapEdge {
  from: string;
  to: string;
  strength: EdgeStrength;
  claim: string;
  /** What this connection is not claiming. Required for analogical edges. */
  caveat?: string;
}

export const mapNodes: MapNode[] = [
  {
    id: "de-broglie",
    label: "de Broglie",
    cluster: "physics",
    x: 16,
    y: 20,
    note: "Matter has a wavelength.",
    detail:
      "In his 1924 thesis Louis de Broglie proposed that the wave–particle relation already accepted for light extends to matter: a particle of momentum p is associated with a wavelength λ = h/p. It was confirmed experimentally by Davisson and Germer in 1927 and independently by G. P. Thomson. The interesting part for this project is not that he was right; it is that the proposal required treating two categories that had been used as alternatives as applying to the same objects.",
    href: "/category",
    hrefLabel: "When the category breaks",
  },
  {
    id: "categories",
    label: "inherited categories",
    cluster: "physics",
    x: 32,
    y: 9,
    note: "The boxes you had before the evidence arrived.",
    detail:
      "Every measurement is made with instruments and concepts chosen in advance. When results resist the available categories, you can add a correction, restrict the category's domain, or replace it — and which of those is reasonable is not settled by the data alone.",
  },
  {
    id: "measurement",
    label: "what you measure",
    cluster: "physics",
    x: 9,
    y: 38,
    note: "Different apparatus, different aspect.",
    detail:
      "A double-slit arrangement makes interference visible; a which-path arrangement makes it disappear. Both are real measurements of the same system. The apparatus is part of what determines which description applies — a fact that is easy to state and notoriously hard to interpret.",
  },
  {
    id: "kuhn",
    label: "Kuhn",
    cluster: "inference",
    x: 30,
    y: 33,
    note: "Frameworks change, and not only by accumulation.",
    detail:
      "Kuhn's 1962 account describes normal science as puzzle-solving within a paradigm, and crisis as what happens when anomalies accumulate faster than the paradigm absorbs them. The part relevant here is his claim that the choice between paradigms is not fully decided by shared evidence, because the paradigms partly determine what counts as evidence.",
    href: "/philosophy",
    hrefLabel: "When should we change the story?",
  },
  {
    id: "popper",
    label: "Popper",
    cluster: "inference",
    x: 45,
    y: 24,
    note: "Ask what would show you wrong.",
    detail:
      "Popper's demarcation criterion is falsifiability: a theory earns scientific standing by forbidding things. In this project the equivalent question is asked of every interpretation — what would you have to see to lower it? An interpretation compatible with every possible piece of evidence is not thereby the strongest one.",
    href: "/philosophy",
    hrefLabel: "When should we change the story?",
  },
  {
    id: "peirce",
    label: "Peirce",
    cluster: "inference",
    x: 47,
    y: 40,
    note: "Where hypotheses come from.",
    detail:
      "Peirce's abduction is the step that generates a hypothesis worth testing: a surprising fact is observed; if some hypothesis were true, the fact would be a matter of course; so there is reason to suspect it. Neither deduction nor induction supplies new candidates, and Bayesian updating cannot either — it can only redistribute belief over hypotheses you already listed.",
    href: "/philosophy",
    hrefLabel: "When should we change the story?",
  },
  {
    id: "bayes",
    label: "Bayes",
    cluster: "inference",
    x: 62,
    y: 32,
    note: "P(H|E) ∝ P(E|H) · P(H)",
    detail:
      "A rule for redistributing belief across a fixed set of hypotheses when evidence arrives. Its two inputs are where you started and how expected the evidence is under each hypothesis. It is a bookkeeping constraint on coherent belief, not a method for producing true beliefs from nothing.",
    href: "/bayes",
    hrefLabel: "Why call it a prior?",
  },
  {
    id: "prior",
    label: "prior",
    cluster: "inference",
    x: 73,
    y: 20,
    note: "Where you started.",
    detail:
      "The distribution you brought to the evidence. In the formal setting it is a number; in reading, it is everything you already believed about what this kind of story tends to mean. Both are inputs that the evidence adjusts rather than replaces.",
    href: "/bayes",
    hrefLabel: "Why call it a prior?",
  },
  {
    id: "underdetermination",
    label: "underdetermination",
    cluster: "inference",
    x: 60,
    y: 52,
    note: "The evidence fits more than one story.",
    detail:
      "The claim that a body of evidence can be consistent with rival theories. Duhem and Quine's version is stronger than the everyday one: because hypotheses face evidence in bundles, a failed prediction never tells you which element of the bundle to give up. Underdetermination is not an excuse for believing anything; it is a description of when the evidence has run out.",
    href: "/underdetermination",
    hrefLabel: "Same evidence, different reading",
  },
  {
    id: "hermeneutics",
    label: "hermeneutics",
    cluster: "myth",
    x: 78,
    y: 49,
    note: "You cannot read from nowhere.",
    detail:
      "The tradition running through Schleiermacher, Dilthey and Gadamer takes the interpreter's situation as a condition of interpretation rather than an obstacle to it. Gadamer's 'prejudice' is close to what this project calls a prior: not an error, but the thing that makes a reading possible and that the text can push back against.",
    href: "/philosophy",
    hrefLabel: "When should we change the story?",
  },
  {
    id: "canon",
    label: "canon",
    cluster: "myth",
    x: 84,
    y: 30,
    note: "The reading you inherited.",
    detail:
      "The default interpretation that arrives with a story: Icarus is about pride, the Iliad is about wrath. Canons are informative — they compress a great deal of prior reading — and they are also the reason a new reading has to work harder than an old one to be heard.",
    href: "/canon",
    hrefLabel: "Rewrite the canon",
  },
  {
    id: "icarus",
    label: "Icarus",
    cluster: "myth",
    x: 90,
    y: 14,
    note: "One climb, four motives.",
    detail:
      "Ovid gives us the acts and almost none of the interior. Curiosity, rebellion, freedom and hubris all fit the surviving text. That is what makes it a usable experimental stimulus rather than merely a famous story.",
    href: "/canon?module=icarus",
    hrefLabel: "Change one assumption",
  },
  {
    id: "achilles",
    label: "Achilles & Patroclus",
    cluster: "myth",
    x: 88,
    y: 63,
    note: "A relationship the poem never names.",
    detail:
      "The Iliad describes what they do and not what they are to each other in any modern sense. Antiquity itself disagreed about it. A gap that has been argued over for two and a half thousand years is a good place to study how readers fill gaps.",
    href: "/canon?module=achilles",
    hrefLabel: "Change one assumption",
  },
  {
    id: "fanfiction",
    label: "fanfiction",
    cluster: "myth",
    x: 74,
    y: 70,
    note: "Systematic perturbation of a shared model.",
    detail:
      "Retelling is the oldest thing literature does — the Greek tragedians were rewriting Homer. What contemporary fanfiction adds is scale and explicit tagging: thousands of variants of the same source, each stating which premise it changed. As a corpus of counterfactuals over a fixed canon it has a structure that is genuinely unusual.",
    href: "/canon",
    hrefLabel: "Rewrite the canon",
  },
  {
    id: "counterfactual",
    label: "counterfactual",
    cluster: "myth",
    x: 62,
    y: 76,
    note: "Change one premise; see what moves.",
    detail:
      "Asking what would have been true had one antecedent been different. It is how causal claims get tested in statistics and how retellings work in fiction, and in both cases the interesting output is the same: which other things had to change, and which did not.",
    href: "/canon",
    hrefLabel: "Rewrite the canon",
  },
  {
    id: "llm",
    label: "language models",
    cluster: "machine",
    x: 30,
    y: 70,
    note: "A learned prior over what text usually means.",
    detail:
      "A language model's training distribution functions as a prior in a loose but real sense: it determines what reading is available before your particular context arrives. Unlike a Bayesian prior it is not explicit, not normalised over a stated hypothesis space, and not something the model can report on reliably.",
    href: "/humans-vs-machines",
    hrefLabel: "Humans vs machines",
  },
  {
    id: "confidence",
    label: "confidence",
    cluster: "machine",
    x: 17,
    y: 58,
    note: "Fluency is not evidence.",
    detail:
      "A model can produce a well-formed, internally consistent interpretation of evidence that supports several. Whether its stated probabilities track anything is an empirical question about calibration, and the answer varies by model, prompt and domain. This site tests it rather than assuming it.",
    href: "/humans-vs-machines",
    hrefLabel: "Humans vs machines",
  },
  {
    id: "ambiguity",
    label: "ambiguity",
    cluster: "machine",
    x: 43,
    y: 62,
    note: "Where both sides have to guess.",
    detail:
      "The shared territory: a message whose meaning is not fixed by its words, read by a person with a history or a model with a training distribution. It is the one place where human and machine interpretation can be compared on identical input.",
    href: "/humans-vs-machines",
    hrefLabel: "Humans vs machines",
  },
  {
    id: "perception",
    label: "the predictive brain",
    cluster: "machine",
    x: 24,
    y: 84,
    note: "Sensory input arrives against an expectation.",
    detail:
      "Predictive-processing accounts treat perception as an ongoing reconciliation between what the brain predicts and what arrives, with prediction error driving the revision. Whether the brain literally implements Bayesian inference is contested; that perception is not a passive read-out of the world is not.",
  },
  {
    id: "law",
    label: "evidence in law",
    cluster: "inference",
    x: 47,
    y: 88,
    note: "Two narratives, one set of facts.",
    detail:
      "A trial is an unusually explicit version of the problem: competing narratives, a shared evidential record, and procedural rules about who must move whom and by how much. It is also where the limits of the Bayesian framing are argued most sharply, since standards like 'beyond reasonable doubt' resist being restated as a probability threshold.",
  },
  {
    id: "evidence",
    label: "evidence",
    cluster: "inference",
    x: 44,
    y: 48,
    note: "What arrives and moves things.",
    detail:
      "In this project, anything that changes how plausible an interpretation looks. Its force is not intrinsic: the same fact moves belief a lot or not at all depending on how surprising it is under each hypothesis you are entertaining.",
  },
];

export const mapEdges: MapEdge[] = [
  { from: "de-broglie", to: "categories", strength: "historical", claim: "The matter-wave hypothesis required applying two descriptions, previously treated as alternatives, to the same objects." },
  { from: "de-broglie", to: "measurement", strength: "structural", claim: "Which aspect of a quantum system shows up depends on the experimental arrangement." },
  { from: "categories", to: "kuhn", strength: "structural", claim: "Kuhn's paradigms are, among other things, systems of categories that determine what counts as an anomaly." },
  { from: "kuhn", to: "underdetermination", strength: "structural", claim: "If evidence does not uniquely select a framework, framework change cannot be a purely evidential matter." },
  { from: "popper", to: "evidence", strength: "structural", claim: "Popper's criterion is about what evidence a hypothesis forbids, which is the same quantity that carries weight in a likelihood." },
  { from: "peirce", to: "bayes", strength: "structural", claim: "Abduction supplies the hypothesis set; Bayes redistributes belief within it. Neither does the other's job.", caveat: "Peirce did not frame abduction as a step in Bayesian updating, and resisted reducing inquiry to probability." },
  { from: "bayes", to: "prior", strength: "structural", claim: "The prior is one of the two inputs to the rule; without it the likelihood alone determines nothing." },
  { from: "bayes", to: "evidence", strength: "structural", claim: "Evidence enters only through how expected it was under each hypothesis." },
  { from: "prior", to: "canon", strength: "analogical", claim: "Both are starting positions that shape how new material is read.", caveat: "A prior is an explicit distribution over a stated hypothesis space. A canon is not numerical, not normalised, and has no agreed hypothesis space. The analogy is about the role played, not the object." },
  { from: "canon", to: "icarus", strength: "structural", claim: "The hubris reading is the inherited default that any other reading of Icarus has to argue against." },
  { from: "canon", to: "achilles", strength: "structural", claim: "What the poem leaves unnamed, successive canons have named differently." },
  { from: "icarus", to: "counterfactual", strength: "structural", claim: "Changing the stated motive changes the meaning of the fall without changing a single event." },
  { from: "achilles", to: "fanfiction", strength: "historical", claim: "Retelling this material is continuous with what Greek tragedy already did to Homer." },
  { from: "fanfiction", to: "counterfactual", strength: "structural", claim: "A retelling is a premise change with its consequences worked out in narrative form." },
  { from: "counterfactual", to: "underdetermination", strength: "structural", claim: "If several premise-sets survive the text, the text underdetermines the reading." },
  { from: "underdetermination", to: "hermeneutics", strength: "analogical", claim: "Both describe situations where the object does not fix a single correct reading.", caveat: "Underdetermination in philosophy of science is a claim about evidence and theory choice; hermeneutics is a claim about the interpreter's situatedness. They diagnose different sources of the same difficulty." },
  { from: "hermeneutics", to: "canon", strength: "structural", claim: "Gadamer's account makes the inherited reading a condition of understanding rather than an obstacle to it." },
  { from: "llm", to: "prior", strength: "analogical", claim: "Training distribution functions as a starting point that new context adjusts.", caveat: "It is implicit, unnormalised over any stated hypothesis space, and not reportable by the model. Calling it a prior is a description of its role, not of its mathematics." },
  { from: "llm", to: "confidence", strength: "structural", claim: "A model's stated probability and its accuracy are separate quantities; the relation between them is what calibration measures." },
  { from: "confidence", to: "ambiguity", strength: "structural", claim: "Ambiguous input is exactly where confident output stops being evidence of anything." },
  { from: "ambiguity", to: "evidence", strength: "structural", claim: "A case is ambiguous when the available evidence does not separate the candidate readings." },
  { from: "ambiguity", to: "llm", strength: "structural", claim: "Both humans and models must produce a reading from input that does not determine one." },
  { from: "measurement", to: "evidence", strength: "analogical", claim: "What you set up to observe constrains what you can learn.", caveat: "In quantum mechanics this is a physical fact about the system; in interpretation it is a fact about attention. Do not read the first as explaining the second." },
  { from: "perception", to: "prior", strength: "analogical", claim: "Perception is standardly described as expectation adjusted by incoming signal.", caveat: "Whether the brain performs anything like Bayesian inference is an open and contested empirical question; the resemblance is a research programme, not a settled result." },
  { from: "perception", to: "llm", strength: "analogical", claim: "Both produce an interpretation by combining a learned expectation with present input.", caveat: "The mechanisms are unrelated. This is a similarity of description, and the site treats it as nothing more." },
  { from: "law", to: "evidence", strength: "structural", claim: "Legal procedure is an explicit, adversarial protocol for deciding how much a piece of evidence should move a conclusion." },
  { from: "law", to: "underdetermination", strength: "structural", claim: "The requirement to reach a verdict is precisely the requirement to decide when the evidence is enough — which is a question underdetermination poses and does not answer." },
  { from: "icarus", to: "ambiguity", strength: "structural", claim: "The same four-way motive ambiguity is what the language-track scenarios reproduce in miniature." },
];

export const clusterLabels: Record<MapNode["cluster"], { label: string; color: string }> = {
  physics: { label: "Physics", color: "#263A66" },
  inference: { label: "Inference", color: "#A33B2C" },
  myth: { label: "Myth & reading", color: "#8A6620" },
  machine: { label: "Machines", color: "#4A6146" },
};
