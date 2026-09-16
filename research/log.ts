/**
 * The researcher's log.
 *
 * Format is fixed: question, what I expected, what happened, what surprised me,
 * what changed, next question. The point of the fixed format is that the
 * 'what happened' field cannot be quietly skipped when the answer is 'nothing yet'.
 *
 * Entries are added when work actually happens. There is no backdated history here.
 */

export interface LogEntry {
  date: string;
  displayDate: string;
  question: string;
  expected: string;
  happened: string | null;
  surprised: string | null;
  changed: string | null;
  next: string;
}

export const logEntries: LogEntry[] = [
  {
    date: "2026-09-16",
    displayDate: "16 September 2026",
    question:
      "Is the connection between belief revision in science and reinterpretation in reading a real structural similarity, or only a nice sentence?",
    expected:
      "That it would survive being made precise. Both involve a starting position, incoming evidence, and a revised position — and in both cases the revision is constrained but not determined by what arrives.",
    happened:
      "Partly. Making it precise cost the strong version of the claim. A Bayesian prior is a normalised distribution over a stated hypothesis space; a canonical reading is none of those things. What actually survives is narrower: both are starting positions that determine how much work new evidence has to do, and in both cases the starting position is not itself the output of evidence. That is a real structural similarity and it is smaller than the sentence I started with.",
    surprised:
      "That the honest version is more interesting. 'The canon is a prior' as a slogan is a claim about equivalence and is false. As a claim about the role a canon plays in an interpretive update, it is checkable, and it generates an experiment — which the slogan never did.",
    changed:
      "Every edge on the connection map now has to declare whether it is structural, analogical or historical, and analogical edges have to state their own disanalogy. Several connections I was sure about turned out to be analogies, including the one the project is named after.",
    next: "Collect the first responses and find out whether the scenarios underdetermine in practice or only on paper.",
  },
  {
    date: "2026-09-16",
    displayDate: "16 September 2026",
    question:
      "Do people update interpretations substantially when contextual evidence changes, and does disagreement shrink as evidence accumulates?",
    expected:
      "Large movement on the first evidence item, smaller movement afterwards, and disagreement that falls but does not vanish. Written down before any data exists so it can be wrong in public.",
    happened: null,
    surprised: null,
    changed: null,
    next: "Open the experiment. Nothing after this line can be written until the dataset stops being empty.",
  },
];

/** Fields left null render as an explicit empty state, never as prose. */
export const logNote =
  "Empty fields on this page are empty because the work has not happened yet, not because it went badly. They will be filled in as the dataset grows, and the entries above them will not be edited to match.";
