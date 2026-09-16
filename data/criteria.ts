/**
 * Two cases, three explanations each, arranged so that no single explanation is
 * best on every property.
 *
 * The profiles are the design, not a measurement: each explanation was written to
 * be strong on one property and weak on another. What the instrument detects is
 * whether the reader applies the same criterion twice, which is a fact about them
 * and not about the cases.
 *
 * `beauty`, `support`, `falsifiable` and `useful` are the author's own
 * assessments of explanations the author wrote. They are not scores of anything.
 */

export type Property = "beauty" | "support" | "falsifiable" | "useful";

export interface Explanation {
  id: string;
  text: string;
  profile: Record<Property, "high" | "mid" | "low">;
  /** Shown after choosing. Says what this one is and what it costs. */
  note: string;
}

export interface Case {
  id: string;
  situation: string;
  evidence: string[];
  explanations: Explanation[];
}

export const cases: Case[] = [
  {
    id: "silence",
    situation: "Someone you work closely with stops replying to you. Only to you.",
    evidence: [
      "Three messages over two weeks, all read, none answered.",
      "In the same period they reply to the group thread within minutes.",
      "The last thing you sent them was a correction to something they'd written.",
      "They have been visibly exhausted since a project changed scope in March.",
    ],
    explanations: [
      {
        id: "narrative",
        text: "The correction landed badly. They have decided you think they're incompetent, and every day of not replying makes replying harder, so the silence is now sustaining itself.",
        profile: { beauty: "high", support: "mid", falsifiable: "mid", useful: "high" },
        note: "The satisfying one. It has a mechanism, an arc and a cause you can act on. Notice that the entire interior — what they decided, what it made harder — is supplied by you. The evidence contains a correction and a silence. It does not contain a reaction to a correction.",
      },
      {
        id: "boring",
        text: "They are behind on everything that isn't the group thread, and your messages are in the category of things that need a considered reply rather than a fast one.",
        profile: { beauty: "low", support: "high", falsifiable: "high", useful: "mid" },
        note: "The dull one, and the best supported. It accounts for the group thread, the exhaustion and the selectivity without inventing anyone's inner life. It is also checkable: look at whether other people who send them considered messages are waiting too. Almost nobody picks it.",
      },
      {
        id: "unfalsifiable",
        text: "They're avoiding you. If they reply, it's because avoidance became untenable. If they don't, that's the avoidance. If they're warm in person, that's the discomfort being managed.",
        profile: { beauty: "mid", support: "low", falsifiable: "low", useful: "low" },
        note: "This one absorbs everything. Reply, silence, warmth, coldness — all of it confirms. That is not strength. An explanation that forbids nothing has told you nothing, and it feels like certainty because nothing can dent it.",
      },
    ],
  },
  {
    id: "drift",
    situation: "A model that was accurate in testing is noticeably worse three months after deployment.",
    evidence: [
      "Accuracy on the original test set is unchanged when re-run today.",
      "The people using it say the kinds of cases they send it have changed.",
      "Nobody has retrained it or altered the code.",
      "Two of the input fields are now filled in by a different team, in a different format.",
    ],
    explanations: [
      {
        id: "drift-boring",
        text: "The input distribution moved. The model is doing exactly what it always did, to cases it was never fitted on — and two fields changing format is a specific, checkable instance of that.",
        profile: { beauty: "low", support: "high", falsifiable: "high", useful: "high" },
        note: "Here the well-supported explanation is also the useful one, which is why this case is the second one. Distribution shift is boring, textbook, and fits all four pieces of evidence including the unchanged test-set score.",
      },
      {
        id: "drift-beautiful",
        text: "The model changed the behaviour of the people feeding it. They learned what it handled well and started sending it those cases, until the easy cases were exhausted and only the hard ones were left.",
        profile: { beauty: "high", support: "mid", falsifiable: "mid", useful: "mid" },
        note: "A genuinely elegant feedback story, and it is consistent with the evidence. But 'the users' behaviour changed' is the same observation the boring explanation uses, dressed in a mechanism nobody has looked for. It is more interesting and not better supported.",
      },
      {
        id: "drift-unfalsifiable",
        text: "The problem is that the metric was never measuring the thing that matters. It looked fine before because the metric was wrong then too.",
        profile: { beauty: "mid", support: "low", falsifiable: "low", useful: "low" },
        note: "Might be true. Also survives every possible observation, since any evidence of improvement or decline can be attributed to the metric. Deployed early it stops inquiry; deployed after the specific causes are ruled out it is a real position.",
      },
    ],
  },
];

export const PROPERTY_LABEL: Record<Property, string> = {
  beauty: "Satisfying",
  support: "Supported by this evidence",
  falsifiable: "Could be shown wrong",
  useful: "Tells you what to do",
};
