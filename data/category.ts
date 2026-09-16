/**
 * The category-failure task.
 *
 * A classification problem with two categories that work, until they don't. The
 * specimens are invented and abstract on purpose: the moment you use a real
 * domain, people classify from prior knowledge instead of from the evidence in
 * front of them, and the task stops measuring anything.
 *
 * Specimens 1–6 sort cleanly. Specimen 7 does not, and the interesting thing is
 * that it does not sort cleanly *in a specific way*: it is not intermediate
 * between the categories, and it is not a third thing. It has the defining
 * property of both, which is what makes "stretch one of them" and "add a third"
 * both feel wrong.
 *
 * Only after the participant has committed to a response does the page mention
 * de Broglie — and it says explicitly that this toy does not reproduce that
 * history.
 */

export interface Specimen {
  id: string;
  label: string;
  /** Properties as the participant sees them. */
  traits: string[];
  /** Which category this is meant to fall into, or null for the anomaly. */
  fits: "alpha" | "beta" | null;
}

export interface CategoryCase {
  id: string;
  categories: { id: string; name: string; rule: string }[];
  specimens: Specimen[];
  anomalyId: string;
}

export const categoryCase: CategoryCase = {
  id: "kinds",
  categories: [
    {
      id: "alpha",
      name: "Kind A",
      rule: "Responds to a single probe at one location. Never produces a pattern across the detector.",
    },
    {
      id: "beta",
      name: "Kind B",
      rule: "Produces a spread pattern across the detector. Never registers at one location only.",
    },
  ],
  specimens: [
    { id: "s1", label: "Specimen 1", traits: ["Registers at one location", "No spread pattern"], fits: "alpha" },
    { id: "s2", label: "Specimen 2", traits: ["Spread pattern across the detector", "Never a single location"], fits: "beta" },
    { id: "s3", label: "Specimen 3", traits: ["Registers at one location", "Repeatable to within noise"], fits: "alpha" },
    { id: "s4", label: "Specimen 4", traits: ["Spread pattern", "Pattern spacing varies with the aperture"], fits: "beta" },
    { id: "s5", label: "Specimen 5", traits: ["Registers at one location", "Location varies run to run"], fits: "alpha" },
    { id: "s6", label: "Specimen 6", traits: ["Spread pattern", "Disappears if the aperture is closed"], fits: "beta" },
    {
      id: "s7",
      label: "Specimen 7",
      traits: [
        "Registers at one location on every single run",
        "Over many runs, those locations build a spread pattern",
        "Closing the aperture destroys the pattern but not the single registrations",
      ],
      fits: null,
    },
  ],
  anomalyId: "s7",
};

export const RESPONSES = [
  {
    id: "keep",
    label: "Keep the categories. It's one of them and the measurement is noisy.",
    note: "The commonest response, and often correct — most anomalies really are noise, and a field that abandoned its categories at the first one would never build anything. It becomes a problem only at the point where you could not say what would change your mind.",
  },
  {
    id: "stretch",
    label: "Stretch one of them to cover it.",
    note: "This works, and you should notice what it costs. Both category rules contain the word 'never'. Stretching either one deletes the clause that made it a rule, and what remains classifies less than it did before.",
  },
  {
    id: "new",
    label: "Add a third category for things like this.",
    note: "Reasonable, and it defers the problem. A third category built to hold one specimen is a label, not a kind — and if the next specimen also does both, you now have a category scheme where the interesting cases all live in the bin marked 'other'.",
  },
  {
    id: "reject",
    label: "The two categories were the wrong shape to begin with.",
    note: "The expensive answer, and the one nothing in the evidence forces. Specimen 7 has the defining property of both kinds, which is not the same as being between them or being a third thing. If a single object can be both, then 'A or B' was never the exhaustive pair the scheme assumed.",
  },
] as const;

export type ResponseId = (typeof RESPONSES)[number]["id"];
