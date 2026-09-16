/**
 * The research state.
 *
 * Every candidate finding the project holds, with a status drawn from a machine
 * that has no terminal success:
 *
 *   OPEN → SUPPORTED ⇄ WEAKENED → CONTRADICTED → ABANDONED
 *
 * There is no PROVEN. A hypothesis that has survived everything thrown at it is
 * SUPPORTED, which is a statement about what was thrown.
 *
 * `needs` is the discriminating observation — what would have to be collected to
 * move the status. Without it a candidate is not a hypothesis, it is a mood.
 */

export type Status = "open" | "supported" | "weakened" | "contradicted" | "abandoned";

export const STATUS_LABEL: Record<Status, string> = {
  open: "Open",
  supported: "Supported so far",
  weakened: "Weakened",
  contradicted: "Contradicted",
  abandoned: "Abandoned",
};

export const STATUS_NOTE: Record<Status, string> = {
  open: "Stated. Nothing collected that bears on it yet.",
  supported: "Has survived the attempts made on it. Not the same as true — a statement about the attempts.",
  weakened: "Something came in that it had to absorb. It did, at a cost.",
  contradicted: "An observation it forbade happened.",
  abandoned: "Given up. Kept visible on purpose.",
};

export interface Candidate {
  id: string;
  level: "construction" | "revision" | "justification";
  claim: string;
  status: Status;
  /** Why it is at that status right now. */
  standing: string;
  /** The observation that would move it. Required. */
  needs: string;
  /** The rival that would explain the same data. Required — a candidate with no rival is not a finding. */
  rival: string;
  /** Which instrument produces the data. */
  instrument: string;
}

export const candidates: Candidate[] = [
  {
    id: "c-first-reading",
    level: "revision",
    claim:
      "A reading taken before any evidence arrives survives more contrary evidence than a reading taken after it.",
    status: "open",
    standing:
      "Nothing collected. The instrument exists — the homepage records the reading held on the word alone and at each fact after it.",
    needs:
      "Enough paired trajectories to compare movement after an early commitment against movement by participants who were shown the facts first. The second condition is not built yet, which makes this currently untestable rather than merely untested.",
    rival:
      "Order effects: people move most on the first fact whenever it arrives, and early commitment has nothing to do with it.",
    instrument: "/sure",
  },
  {
    id: "c-accommodation",
    level: "revision",
    claim:
      "When a reading is kept in the face of evidence marked as complicating it, the keeping is not usually accompanied by a stated cost.",
    status: "open",
    standing: "Nothing collected. The character lab records both the stance and the reading held.",
    needs:
      "Trajectories where a participant marked an item 'complicates' and kept the reading, with the free-text reason attached. The reasoning field was only added in this build.",
    rival:
      "People are perfectly aware of the cost and simply do not write it down unless asked directly.",
    instrument: "/versions",
  },
  {
    id: "c-discriminating",
    level: "justification",
    claim:
      "People reliably choose confirming observations over discriminating ones when both are available and the confirming option is more vivid.",
    status: "open",
    standing:
      "Nothing collected. This is the prediction the project most wants to be wrong about, because it is the one with a cheap patronising reading.",
    needs:
      "Proposed-test choices across both cases. The instrument grades them automatically — a candidate either separates the two models or it does not.",
    rival:
      "The non-discriminating options are simply written to be more attractive, and the effect is an artefact of one author writing all ten.",
    instrument: "/discriminate",
  },
  {
    id: "c-criterion-stability",
    level: "justification",
    claim:
      "The property a person treats as decisive — simplicity, fit, mechanism, predictive reach — is stable across domains rather than chosen per case.",
    status: "open",
    standing:
      "Nothing collected. Two cases deliberately differ in domain (a person, a system) so that a switch is visible.",
    needs: "Paired criterion choices from the same session across both cases.",
    rival:
      "Domain-appropriate switching, which would be good reasoning rather than inconsistency, and would look identical in the data.",
    instrument: "/criteria, /discriminate",
  },
  {
    id: "c-category",
    level: "justification",
    claim:
      "Category revision is chosen far less often than stretching an existing category, even when stretching deletes the clause that made the category a rule.",
    status: "open",
    standing: "Nothing collected.",
    needs: "Anomaly responses, with reasoning, from the sorting task.",
    rival:
      "Participants read 'the categories were wrong' as the answer the page wants, and pick it more often than they otherwise would — the opposite artefact.",
    instrument: "/categories",
  },
  {
    id: "c-model-confidence",
    level: "revision",
    claim:
      "A language model given the same ambiguous evidence commits harder than the human group average, and additional context narrows it further while humans stay divided.",
    status: "open",
    standing:
      "Nothing collected on either side. No model API is configured on this deployment, so there are no runs at all.",
    needs:
      "Matched human and model distributions on the same scenarios under a single pinned prompt version.",
    rival:
      "Verbalised confidence from a model is an artefact of the elicitation format and does not correspond to anything that could be called commitment.",
    instrument: "/machines",
  },
  {
    id: "c-self",
    level: "justification",
    claim:
      "The structural connections this project draws between domains are, in the main, found rather than imposed.",
    status: "weakened",
    standing:
      "Weakened by the project's own audit before any participant saw it. Of ten claims examined, two survive with a stated structure, four survive only as descriptions of a shared role, one was abandoned, and three were fabrications written to test whether the author could tell the difference.",
    needs:
      "Judgements from people who did not write the claims. If readers cannot separate the fabrications from the defended ones, that is evidence the defended ones are held for reasons other than their structure.",
    rival:
      "The controls are simply worse than the real claims and anyone would catch them — in which case the audit shows nothing.",
    instrument: "/shape",
  },
  {
    id: "c-canontest-sensitivity",
    level: "justification",
    claim:
      "Working through the Canon Test improves sensitivity — the gap between accepting a defended connection and accepting a fabricated one.",
    status: "open",
    standing:
      "Nothing collected. This is the claim the protocol has to earn, and the one I expect to fail.",
    needs:
      "Paired pre/post judgements from sessions in both arms, so the change in sensitivity under the protocol can be compared against the change under a matched unrelated task.",
    rival:
      "The protocol moves only bias: people become warier of everything, reject more of both kinds, and accuracy on the fabrications rises purely because they are rejecting more overall. This is what most critical-thinking interventions turn out to do, and the analysis reports both quantities separately for exactly that reason.",
    instrument: "/canon-test, /shape",
  },
  {
    id: "c-fluency",
    level: "justification",
    claim:
      "Acceptance of a structural claim tracks its surface features — whether it names a mechanism, whether you could say what would falsify it — more closely than whether it is one I defend or one I fabricated.",
    status: "open",
    standing:
      "Nothing collected. If this holds, the headline result of the audit is a fact about my prose rather than about anyone's reasoning, and the audit has to be reported that way.",
    needs:
      "Per-claim feature ratings alongside judgements, so acceptance can be compared against features and against true status on the same items.",
    rival:
      "Features and status are confounded in the item set itself, because I wrote the fabrications to have good features. With three controls this may be unresolvable from inside this design.",
    instrument: "/shape",
  },
  {
    id: "c-identity",
    level: "construction",
    claim:
      "Rewriting your own past works the way rewriting a character does: same events, changed assumption, different person.",
    status: "abandoned",
    standing:
      "Abandoned before data collection. In a retelling the events are fixed and public; in autobiography they are neither. What feels like changing an assumption about yourself is normally accompanied by remembering different events — so the thing claimed to be held constant is exactly what moves.",
    needs:
      "Longitudinal evidence that recalled facts stay stable across genuine reinterpretation of one's own motives would reopen it. I expect the opposite and have not looked properly.",
    rival:
      "None needed — the claim is dead. If it were revived, the rival would be that recalled facts feel unstable during reinterpretation without actually changing, which is a measurement problem rather than a fact about memory.",
    instrument: "—",
  },
];

export const researchQuestion = {
  headline:
    "What makes one model more justified than another when the evidence does not decide?",
  second:
    "And how would we know whether a structure we keep seeing was discovered or imposed?",
  outcome:
    "If this works, what exists at the end is evidence about which criterion people actually reach for when the evidence runs out — whether that criterion is stable across domains, whether people distinguish confirming from discriminating observations, and whether a language model given the same material reaches for the same one. A clear null result on any of those is a result.",
};
