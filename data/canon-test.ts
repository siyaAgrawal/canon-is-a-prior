/**
 * The Canon Test.
 *
 * A protocol for interrogating a pattern you think you have found. It produces a
 * status, never a score — a number here would be the exact error the project is
 * about, dressed up as its cure.
 *
 * Seven of the eight steps have no right answer. One does: a proposed
 * discriminating observation either produces different expectations under the
 * competing models or it does not, and that is a fact about the observation. It
 * is the only step this instrument can grade, and the only one whose output is
 * research data rather than a record of what somebody wrote.
 */

export interface Step {
  id: string;
  n: string;
  question: string;
  /** The distinction the step exists to force. One line. */
  why: string;
  placeholder: string;
  /** Shown under the field. Concrete, and drawn from the site's own material. */
  example: { bad: string; good: string };
  optional?: boolean;
}

export const steps: Step[] = [
  {
    id: "observation",
    n: "01",
    question: "What did you actually see?",
    why: "Not what it means. The part a camera would have caught.",
    placeholder: "Write only the thing itself.",
    example: {
      bad: "Fanfiction writers understand characters differently.",
      good: "Two stories use the same scenes and describe the same character as cruel and as frightened.",
    },
  },
  {
    id: "prior",
    n: "02",
    question: "What did you expect before you looked?",
    why: "A prior is not a bias. It is what makes evidence mean anything — the danger is only in not knowing you have one.",
    placeholder: "What you already believed.",
    example: {
      bad: "I had no expectations.",
      good: "I expected a character's actions to fix what kind of person they are.",
    },
  },
  {
    id: "pattern",
    n: "03",
    question: "State the pattern precisely.",
    why: "Vague enough and it cannot be wrong. That is not a strength.",
    placeholder: "X and Y both … under …",
    example: {
      bad: "These two things are deeply similar.",
      good: "Both fix a body of evidence, alter one antecedent, and evaluate the result by downstream coherence rather than by observation.",
    },
  },
  {
    id: "alternatives",
    n: "04",
    question: "What else would produce the same observation?",
    why: "If nothing else could, the pattern is doing no work. Usually something else could.",
    placeholder: "One per line.",
    example: {
      bad: "Nothing — it's obviously the same structure.",
      good: "Both descriptions are abstract enough to fit anything. / I read them both looking for the same shape.",
    },
  },
  {
    id: "discriminator",
    n: "05",
    question: "What observation would come out differently depending on which is right?",
    why: "Not more evidence. Evidence whose result the rivals disagree about.",
    placeholder: "One observation.",
    example: {
      bad: "Look at more examples of both.",
      good: "Take a domain where the abstraction fits but nobody claims the structure, and see whether the pattern still predicts anything there.",
    },
  },
  {
    id: "counterexample",
    n: "06",
    question: "What would make you wrong?",
    why: "If you cannot name it, you are not holding a claim.",
    placeholder: "The case that would end it.",
    example: {
      bad: "I'd need a lot of evidence against it.",
      good: "A retelling that keeps the events fixed and produces a character nobody recognises.",
    },
  },
  {
    id: "prediction",
    n: "07",
    question: "What does it predict that you have not already seen?",
    why: "A pattern that explains everything afterwards and forecasts nothing has not been tested — it has been fitted.",
    placeholder: "Something checkable, in principle.",
    example: {
      bad: "It explains a lot of things.",
      good: "Retellings that change a stated motive should preserve more plot events than ones that change a relationship.",
    },
    optional: true,
  },
];

/** No PROVEN. A protocol that can conclude 'true' is not this protocol. */
export const statuses = [
  { id: "supported", label: "Supported so far", note: "Survived what you threw at it. A statement about what you threw." },
  { id: "analogical", label: "Analogical", note: "A real resemblance with a named disanalogy. Useful, not structural." },
  { id: "underdetermined", label: "Underdetermined", note: "Rivals remain and nothing available separates them." },
  { id: "weakened", label: "Weakened", note: "It had to absorb something, and it cost." },
  { id: "contradicted", label: "Contradicted", note: "Something it forbade happened." },
  { id: "open", label: "Open", note: "Stated, untested, honest about it." },
  { id: "abandoned", label: "Abandoned", note: "Given up. Worth keeping visible." },
] as const;

export type StatusId = (typeof statuses)[number]["id"];

/**
 * Heuristic check on step 5, used only to prompt — never to grade the person.
 * A discriminating observation almost always contrasts conditions; a
 * non-discriminating one usually just asks for more of the same.
 */
export function looksGradable(text: string): boolean {
  const t = text.toLowerCase();
  if (t.trim().length < 25) return false;
  const moreOfTheSame = /\b(more|another|further|additional|again|keep looking|collect more)\b/.test(t);
  const contrastive =
    /\b(whether|if .* but|compare|versus|vs\b|instead|differ|unlike|without|absent|control|holding|while|would not|wouldn't)\b/.test(
      t,
    );
  return contrastive && !moreOfTheSame;
}
