/**
 * Core domain model.
 *
 * The vocabulary is deliberately shared between the literary and the machine side of
 * the project: a Scenario presents incomplete evidence, an Interpretation is a
 * competing hypothesis, an EvidenceItem is what arrives to move belief, and a
 * Response is one distribution-over-hypotheses trajectory — produced by a human
 * participant or by a language model.
 */

export type Track = "myth" | "language";

export interface Interpretation {
  id: string;
  label: string;
  /** One line unpacking what the label actually commits you to. */
  gloss: string;
}

export interface EvidenceItem {
  id: string;
  /** The evidence itself, as the participant reads it. */
  text: string;
  /**
   * Why this item was written. Shown only after the participant has updated, so the
   * framing cannot contaminate the update itself.
   */
  designNote: string;
}

export interface Scenario {
  id: string;
  track: Track;
  title: string;
  /** Situation before the ambiguous act. */
  context: string;
  /** The ambiguous statement or action being interpreted. */
  stimulus: string;
  /** The question the distribution answers. */
  question: string;
  interpretations: Interpretation[];
  evidence: EvidenceItem[];
  /** Provenance of the material; every scenario is original prose or public domain. */
  source: "original" | "public-domain-myth";
}

/** A probability distribution over interpretation ids. Values are percentages 0..100. */
export type Distribution = Record<string, number>;

export interface BeliefStep {
  /** null for the prior, before any evidence. */
  evidenceId: string | null;
  distribution: Distribution;
  /** Self-reported confidence in this distribution, 0..100. Optional by design. */
  confidence: number | null;
}

export interface ParticipantResponse {
  id: string;
  /** Random, client-generated, non-identifying. Lets one person's trajectory cohere. */
  sessionId: string;
  scenarioId: string;
  track: Track;
  steps: BeliefStep[];
  /** Milliseconds from scenario shown to final submit. Used only to flag non-engagement. */
  durationMs: number;
  createdAt: string;
  /** Schema version, so later analysis can tell response formats apart. */
  schema: 1;
}

export interface AIResponse {
  id: string;
  scenarioId: string;
  model: string;
  steps: BeliefStep[];
  /** The model's own brief justification for each step, in order. */
  rationales: string[];
  /** "live" = produced by this app calling an API. "imported" = loaded from a file. */
  origin: "live" | "imported";
  /** The exact prompt template id used, so runs stay comparable. */
  promptVersion: string;
  createdAt: string;
  schema: 1;
}

export interface CounterfactualPremise {
  id: string;
  label: string;
  /** The altered assumption, stated plainly. */
  statement: string;
  /** What the change does to each interpretive dimension. */
  consequences: { dimension: string; reading: string }[];
  /** What the change does NOT license — the honesty valve. */
  resists: string;
}

export interface CanonModule {
  id: string;
  title: string;
  /** Our own paraphrase of public-domain material. */
  canonicalFrame: string[];
  attribution: string;
  dimensions: string[];
  baseline: { dimension: string; reading: string }[];
  premises: CounterfactualPremise[];
}

export interface AggregateCell {
  interpretationId: string;
  mean: number;
  median: number;
  values: number[];
}

export interface ScenarioAggregate {
  scenarioId: string;
  n: number;
  /** Index 0 is the prior; index i>0 is belief after evidence[i-1]. */
  stages: { evidenceId: string | null; cells: AggregateCell[] }[];
  /** Mean pairwise total-variation distance between participants, per stage. */
  disagreement: number[];
  /** Mean L1/2 movement caused by each evidence item. */
  updateMagnitude: { evidenceId: string; mean: number; median: number }[];
}
