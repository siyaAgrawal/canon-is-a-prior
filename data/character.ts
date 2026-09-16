/**
 * The character lab.
 *
 * Wren is invented. There is no fact of the matter about Wren, and the
 * experiment says so before it starts — because the measurement is not whether
 * you read the character correctly. It is what you did when the evidence stopped
 * cooperating.
 *
 * The item order is fixed and deliberate. Items 1–4 are readable as a single
 * coherent person. Item 5 costs the cheapest reading something. Items 6 and 7 are
 * built to underdetermine: 6 is a fact that supports whatever you already think,
 * and 7 contains two testimonies that cannot both be weighted heavily.
 *
 * `cuts` records what each item was written to press on. Shown only afterwards.
 */

export interface Reading {
  id: string;
  label: string;
  gloss: string;
}

export interface Item {
  id: string;
  text: string;
  /** Which readings this was written to support (+) and press on (−). */
  cuts: string;
}

export const readings: Reading[] = [
  {
    id: "cold",
    label: "Cold",
    gloss: "They don't especially care how things land on people. The work is the point.",
  },
  {
    id: "frightened",
    label: "Frightened",
    gloss: "Something is being managed. What reads as coldness is a defence with a job to do.",
  },
  {
    id: "principled",
    label: "Principled",
    gloss: "They're applying a standard consistently, including to themselves, and it costs them.",
  },
  {
    id: "careless",
    label: "Careless",
    gloss: "There's no model behind it. They simply don't think about how any of it registers.",
  },
];

export const items: Item[] = [
  {
    id: "i1",
    text: "In their first week, Wren rewrote a colleague's work overnight and sent it to the whole team. No note, no warning, no mention of the colleague.",
    cuts: "Written to open on the cheapest reading. Almost everyone starts at cold or careless here, and almost nothing in the sentence distinguishes those two.",
  },
  {
    id: "i2",
    text: "The rewrite was better. Not marginally — it caught a failure mode nobody else had seen.",
    cuts: "Presses on careless: carelessness does not usually produce that. Supports cold and principled equally, which is the point of putting it second.",
  },
  {
    id: "i3",
    text: "Wren doesn't come to the Friday thing. Never has, at any of the places they've worked.",
    cuts: "Deliberately weak. It is consistent with all four readings and adds essentially nothing. Included to see whether people treat a vivid social fact as though it discriminated.",
  },
  {
    id: "i4",
    text: "When a junior made an error that would have shipped, Wren took it to the manager the same afternoon.",
    cuts: "Supports cold and principled. Most readers find this one confirms whatever they already had, which is the behaviour worth noticing rather than the item.",
  },
  {
    id: "i5",
    text: "And then spent two evenings that week teaching them the thing they'd got wrong.",
    cuts: "The first real cost to cold. Cold can survive this — you can say it was about the work, not the junior — but surviving it requires an extra assumption, and that assumption is not in the evidence.",
  },
  {
    id: "i6",
    text: "Wren has worked at four places in six years.",
    cuts: "A pure projection test. It supports whichever reading you already hold, and it is the item most often described afterwards as important. It contains no information about Wren that you did not already supply.",
  },
  {
    id: "i7",
    text: "Leaving the last job, three colleagues independently used the word \"difficult\". A fourth said Wren was the only person there who ever told them the truth.",
    cuts: "Built so that no reading can take both testimonies at full weight. Whichever you discount is the more informative fact about your model, and it is not a fact about Wren.",
  },
];

export type Stance = "fits" | "complicates" | "breaks";

export const STANCE_LABEL: Record<Stance, string> = {
  fits: "Fits what I thought",
  complicates: "Complicates it, but I can hold both",
  breaks: "This doesn't work with my reading",
};
