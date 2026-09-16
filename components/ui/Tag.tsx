import type { ReactNode } from "react";

/**
 * The site's epistemic apparatus.
 *
 * Every claim that is doing work carries one of these. The rule is simple and
 * enforced by hand: if something reads like an assertion and has no tag, it is
 * prose and should not be believed as a finding.
 *
 * The distinctions matter. ANALOGY is not MODEL. HYPOTHESIS is not OBSERVED.
 * ILLUSTRATION means the numbers were made up to show a mechanism and describe
 * nobody. ABANDONED means this project believed it and stopped.
 */
export type Epistemic =
  | "observed"
  | "model"
  | "interpretation"
  | "analogy"
  | "hypothesis"
  | "illustration"
  | "open"
  | "abandoned";

const MEANING: Record<Epistemic, string> = {
  observed: "Recorded. Check it against the data page.",
  model: "A formal structure, true of the model and not necessarily of the world.",
  interpretation: "A reading. Defensible, not established.",
  analogy: "A resemblance between domains. It has a boundary and the boundary is stated.",
  hypothesis: "Stated in advance, not yet tested.",
  illustration: "Numbers chosen to show a mechanism. They measure nobody.",
  open: "Unresolved. No answer is being withheld.",
  abandoned: "Believed earlier in this project. Given up, and kept visible.",
};

export function Tag({ kind, children }: { kind: Epistemic; children?: ReactNode }) {
  return (
    <span className={`tag tag-${kind}`} title={MEANING[kind]}>
      <span className="sr-only">Epistemic status: </span>
      {children ?? kind}
      <span className="sr-only">. {MEANING[kind]}</span>
    </span>
  );
}

export const tagMeanings = MEANING;
