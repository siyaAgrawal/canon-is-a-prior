/**
 * The log.
 *
 * Fixed format, kept awkward on purpose: question, what I thought, what broke,
 * what changed, what I still don't know. The fourth field is the one that makes
 * it worth keeping — a log where nothing ever breaks is a press release.
 *
 * Entries are added when something actually happens. No backdated history.
 */

export interface LogEntry {
  date: string;
  displayDate: string;
  question: string;
  thought: string;
  broke: string | null;
  changed: string | null;
  unknown: string;
}

export const logEntries: LogEntry[] = [
  {
    date: "2026-09-16",
    displayDate: "16 September",
    question:
      "Why does a different interpretation of a character sometimes feel like a different person, when nothing in the evidence has moved?",
    thought:
      "That stories give us stable character categories, and a retelling swaps one category for another. Cruel becomes frightened; the label does the work.",
    broke:
      "The same character stays recognisable across retellings that disagree completely about what he is. If the label were doing the work, he would not survive the swap. Something else is holding the identity together and it is not the interpretation.",
    changed:
      "I stopped looking for what makes a reading correct and started looking at what it costs to keep one. That is the experiment in the character lab: not which reading you end on, but how many facts you absorbed to stay where you were.",
    unknown:
      "Whether accommodation is distinguishable from being right, from the inside, at the time. I do not think it is, and I do not know what follows from that.",
  },
  {
    date: "2026-09-16",
    displayDate: "16 September",
    question: "Is the same structure really present in myth, physics, inference and machines?",
    thought:
      "Yes — and the more places I found it, the more convinced I got. Each new domain felt like confirmation.",
    broke:
      "That is precisely what it feels like to be wrong about a pattern. So I wrote three fake connections, in the same voice, using the same method. Then I could not reliably tell them from my own after a week away.",
    changed:
      "The self-critique stopped being a section at the end and became the instrument on the claims page. Every connection now carries a verdict, and three fabrications are mixed in. If my real claims are indistinguishable from my inventions, the reader should find that out by failing to distinguish them, not by being told.",
    unknown:
      "Whether two surviving connections out of ten is a real finding or a small enough number to be noise in my own judgement.",
  },
  {
    date: "2026-09-16",
    displayDate: "16 September",
    question: "Does reinterpreting yourself work the way reinterpreting a character does?",
    thought:
      "That it does, and that this was the most interesting thing in the project. Same events, changed assumption, different person — applied to a life.",
    broke:
      "In a retelling the events are fixed and public. In autobiography they are neither. Every time I have genuinely changed my reading of something I did, I also remembered different things about it, weighted them differently, or found details I had not been carrying. The thing I claimed was held constant is the thing that moves.",
    changed:
      "Dropped it. It is on the map as a severed line and on the claims page as abandoned, because deleting it would have been the exact behaviour the project is about.",
    unknown:
      "Whether the memory shift causes the reinterpretation or follows it. There is a literature on this and I have not read enough of it to have a position I would defend.",
  },
  {
    date: "2026-09-16",
    displayDate: "16 September",
    question: "Do people update interpretations substantially when contextual evidence changes?",
    thought:
      "Large movement on the first piece of evidence, less afterwards, and disagreement that narrows without closing.",
    broke: null,
    changed: null,
    unknown: "Everything. Nothing has been collected. This entry is here to be answered later.",
  },
];

export const logNote =
  "Empty fields are empty because the work has not happened, not because it went badly. Earlier entries are not edited when later ones contradict them.";
