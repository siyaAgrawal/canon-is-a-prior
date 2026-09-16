/**
 * Underdetermination, made operational.
 *
 * Each case supplies a body of evidence and two models that both account for all
 * of it. Neither is wrong. Neither is a straw man — that is the design constraint
 * that took longest to meet, because it is very easy to write a "rival" that is
 * obviously worse and thereby measures nothing.
 *
 * Then a set of candidate observations. Some separate the models; some are simply
 * more evidence, consistent with both, and feel informative because they are
 * vivid or specific. `discriminates` records which is which, and the reasoning
 * field says why — it is the gradable part of the instrument.
 *
 * `outcome` is what the world does. It is stipulated by the case, disclosed as
 * stipulated, and exists so that a prediction can fail.
 */

export interface Candidate {
  id: string;
  text: string;
  /** Does observing this separate the two models? */
  discriminates: boolean;
  /** Why. Shown only after the participant has chosen. */
  note: string;
}

export interface Model {
  id: string;
  name: string;
  claim: string;
  /** What this model says you should expect from the stipulated outcome test. */
  expects: string;
}

export interface DiscriminateCase {
  id: string;
  title: string;
  situation: string;
  evidence: string[];
  models: [Model, Model];
  candidates: Candidate[];
  /** The one that gets run, and what happened. Stipulated by the case. */
  resolution: {
    testId: string;
    outcome: string;
    /** Which model the outcome favours, or null when it genuinely favours neither. */
    favours: string | null;
    reading: string;
  };
}

export const criteria = [
  { id: "simplicity", label: "It's simpler" },
  { id: "fit", label: "It fits the evidence more closely" },
  { id: "plausibility", label: "People behave like that" },
  { id: "scope", label: "It explains more" },
  { id: "predictive", label: "It says what happens next" },
  { id: "causal", label: "It gives a mechanism" },
] as const;

export const cases: DiscriminateCase[] = [
  {
    id: "seminar",
    title: "The quiet student",
    situation:
      "A student who was talkative in the first four weeks of a seminar has said almost nothing since.",
    evidence: [
      "The change is abrupt — week four to week five, not a gradual decline.",
      "Their written work over the same period is unchanged in quality and length.",
      "They still arrive early and sit in the same seat.",
      "In week four, a contribution of theirs was corrected by another student, at some length.",
    ],
    models: [
      {
        id: "chilled",
        name: "The correction did it",
        claim:
          "Being corrected in public made speaking costly. They still prepare, still attend, and now they weigh contributing against the risk of that happening again.",
        expects: "Silence should be specific to this room and this format.",
      },
      {
        id: "external",
        name: "Something outside the seminar",
        claim:
          "Something changed in week five that has nothing to do with the seminar. Attendance and written work are unaffected because those are habits; speaking takes energy that is currently going elsewhere.",
        expects: "Silence should show up wherever speaking costs energy, not only here.",
      },
    ],
    candidates: [
      {
        id: "more-weeks",
        text: "Watch four more weeks of the same seminar and confirm they stay quiet.",
        discriminates: false,
        note: "Both models predict continued silence. More of the same observation is more evidence and no information — it cannot come out differently under the two models, so it cannot separate them.",
      },
      {
        id: "other-seminar",
        text: "Find out whether they speak in their other seminars.",
        discriminates: true,
        note: "The models diverge here. Room-specific silence favours the correction; silence everywhere favours something external. This is the cheapest discriminating observation available.",
      },
      {
        id: "ask-corrector",
        text: "Ask the student who corrected them what they remember about week four.",
        discriminates: false,
        note: "Establishes that the correction happened, which is already in the evidence. Both models accept it; they disagree about its effect, and this does not touch the effect.",
      },
      {
        id: "written-format",
        text: "Introduce a written-contribution channel where nobody sees who wrote what.",
        discriminates: true,
        note: "Sharply discriminating, and better than the seminar comparison because it separates two things the comparison confounds: the cost of speaking and the cost of being identified.",
      },
      {
        id: "grades",
        text: "Check whether their grades dropped after week four.",
        discriminates: false,
        note: "The evidence already says written work is unchanged. Vivid, specific, and asks a question that has been answered.",
      },
    ],
    resolution: {
      testId: "other-seminar",
      outcome: "They speak normally in their other two seminars — as much as they ever did.",
      favours: "chilled",
      reading:
        "Room-specific, which is hard for the external model to absorb without an extra assumption it did not previously need. It does not establish that the correction caused it: something else specific to this room changed in week five too, and nobody looked.",
    },
  },
  {
    id: "throughput",
    title: "The system that got slower",
    situation:
      "A service that responded in about 100 ms for a year now takes about 400 ms. Nothing was deployed.",
    evidence: [
      "The change appeared over roughly a week rather than at a single moment.",
      "Request volume is flat.",
      "The slowdown is present at every hour, including the quietest.",
      "A database table involved in the hot path has grown steadily since launch.",
    ],
    models: [
      {
        id: "index",
        name: "A query stopped using its index",
        claim:
          "Past a size threshold, the planner switched to a scan. Gradual onset, load-independent, and tied to the table that grew.",
        expects: "Cost should track table size, and be fixable without touching load.",
      },
      {
        id: "neighbour",
        name: "Something else on the same hardware",
        claim:
          "A co-tenant process began consuming shared I/O over that week. Gradual, load-independent, and nothing to do with the code.",
        expects: "Cost should track the host, not the table.",
      },
    ],
    candidates: [
      {
        id: "more-traces",
        text: "Collect a week of additional latency traces at higher resolution.",
        discriminates: false,
        note: "More measurements of the thing you already measured. Both models predict the same distribution, so no amount of it separates them. This is the most common move in practice and it is not an experiment.",
      },
      {
        id: "explain",
        text: "Ask the database for the query plan it is currently using.",
        discriminates: true,
        note: "Decisive and almost free. A sequential scan where an index scan used to be is exactly what one model predicts and the other has no reason to expect.",
      },
      {
        id: "restore",
        text: "Restore last year's data volume into an identical staging host and measure.",
        discriminates: true,
        note: "Discriminating, and expensive. It varies table size while holding hardware fixed — the right shape of experiment, at roughly a hundred times the cost of asking for the query plan.",
      },
      {
        id: "restart",
        text: "Restart the service and see whether latency recovers.",
        discriminates: false,
        note: "Neither model predicts recovery from a restart, so both survive either result. A common instinct that produces no information.",
      },
      {
        id: "move-host",
        text: "Move the service to a different physical host, changing nothing else.",
        discriminates: true,
        note: "Also discriminating, from the other direction: it varies the hardware while holding the data fixed.",
      },
    ],
    resolution: {
      testId: "explain",
      outcome:
        "The planner is using a sequential scan on the grown table. It was using an index scan in a plan captured nine months ago.",
      favours: "index",
      reading:
        "Strong for the index model. Note what it does not establish: a noisy neighbour could be present as well, and this observation would look identical. Ruling one explanation in is not ruling the other out.",
    },
  },
];

export function getCase(id: string): DiscriminateCase | undefined {
  return cases.find((c) => c.id === id);
}
