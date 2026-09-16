import type { Scenario } from "@/types";

/**
 * Myth track.
 *
 * Every scenario below is our own paraphrase of material that has been in the public
 * domain for roughly three thousand years (Ovid's Metamorphoses VIII for Icarus and
 * Daedalus; the Iliad for Achilles and Patroclus; Sophocles and Aeschylus elsewhere).
 * No modern retelling is quoted, and no modern retelling's reading is smuggled in as
 * if it were the ancient text's.
 *
 * The interpretations are written so that no single option is obviously "the right
 * answer". If one of them starts collecting 80% of the mass across participants, that
 * is a finding about the scenario's design, not about the myth.
 */

export const mythScenarios: Scenario[] = [
  {
    id: "icarus-flight",
    track: "myth",
    title: "The flight of Icarus",
    source: "public-domain-myth",
    context:
      "Daedalus, an inventor held on Crete, builds two sets of wings from feathers and wax so that he and his son can leave. Before they launch he tells Icarus to hold a middle course: too low and sea spray will weigh the feathers down, too high and the sun will loosen the wax.",
    stimulus:
      "In the air, Icarus leaves the middle course and climbs.",
    question: "What is driving Icarus?",
    interpretations: [
      { id: "curiosity", label: "Curiosity", gloss: "He climbs to find out what is up there. The height is an experiment, not a statement." },
      { id: "rebellion", label: "Rebellion", gloss: "The climb is aimed at his father. The instruction is the thing he is answering." },
      { id: "freedom", label: "Freedom", gloss: "He has been confined; altitude is the felt opposite of confinement, and he takes it." },
      { id: "hubris", label: "Hubris", gloss: "He overrates himself against the limits of his materials — the reading the tradition most often assigns." },
    ],
    evidence: [
      {
        id: "e1",
        text: "Ovid's telling has Icarus playing in the air on the way — reaching after the open sky as if it were something to be handled.",
        designNote:
          "Written to pull toward curiosity and freedom and away from rebellion: play is not usually directed at anyone. It does not by itself rule hubris out, since delight and overconfidence are compatible.",
      },
      {
        id: "e2",
        text: "The wings were built for one purpose: escaping a place neither of them chose to be. Icarus had spent his whole life inside his father's confinement.",
        designNote:
          "Written to strengthen freedom. Note that it is background, not an observation of the moment of climbing — evidence about a standing condition rather than about an act.",
      },
      {
        id: "e3",
        text: "The warning was not a rule about obedience. It was a fact about wax: it softens near heat. Daedalus gave his son an engineering constraint, not a command.",
        designNote:
          "Written to cut against rebellion (there is less to rebel against) and to complicate hubris (ignoring physics you understand differs from ignoring a father you resent). Watch whether participants move hubris at all here.",
      },
    ],
  },
  {
    id: "daedalus-silence",
    track: "myth",
    title: "What Daedalus knew",
    source: "public-domain-myth",
    context:
      "Daedalus designed the labyrinth that held the Minotaur, and later helped defeat it. He is an engineer who has already watched his own work be used in ways he did not intend.",
    stimulus:
      "He gives his son wings whose failure mode he understands exactly, and a single verbal instruction.",
    question: "How should we read Daedalus's choice?",
    interpretations: [
      { id: "trust", label: "Trust", gloss: "He treats Icarus as someone capable of holding a line, and the instruction is enough because it is true." },
      { id: "necessity", label: "Necessity", gloss: "There was no safer design available. A risky exit beat a certain captivity." },
      { id: "blindspot", label: "A designer's blind spot", gloss: "He models the wax correctly and the boy not at all — a failure of the human part of the system." },
      { id: "grief", label: "Foreknowledge", gloss: "He suspects how it ends and flies anyway, which is a different kind of story about him." },
    ],
    evidence: [
      {
        id: "e1",
        text: "Ovid describes Daedalus fitting the wings to his son's shoulders with his hands shaking, and his cheeks wet.",
        designNote:
          "Ambiguous on purpose. Fear is compatible with trust, with necessity, and with foreknowledge. Only 'blind spot' is really strained by it. A good test of whether participants move everything when evidence discriminates weakly.",
      },
      {
        id: "e2",
        text: "He repeats the instruction in the air, and keeps looking back to check.",
        designNote:
          "Mildly against 'trust' — the checking behaviour suggests the instruction was not felt to be sufficient — and mildly toward blind spot or foreknowledge.",
      },
    ],
  },
  {
    id: "patroclus-armour",
    track: "myth",
    title: "Patroclus in the armour",
    source: "public-domain-myth",
    context:
      "In the Iliad, Achilles has withdrawn from the fighting after a quarrel with Agamemnon. The Greeks are losing badly. Patroclus, Achilles' closest companion, comes to him in tears and asks to be sent out wearing Achilles' own armour so the Trojans will believe Achilles has returned.",
    stimulus: "Achilles agrees, and tells him to drive the Trojans from the ships and then come back.",
    question: "What is Achilles doing when he agrees?",
    interpretations: [
      { id: "compromise", label: "Holding the quarrel", gloss: "He keeps his grievance against Agamemnon intact while still saving the fleet. The armour is a loophole." },
      { id: "love", label: "Yielding to Patroclus", gloss: "He cannot refuse this person, and the conditions are an attempt to make yielding survivable." },
      { id: "strategy", label: "A calculated substitution", gloss: "The plan is sound: the appearance of Achilles is worth as much as Achilles." },
      { id: "denial", label: "Not believing in the risk", gloss: "He does not seriously model his friend dying in his place." },
    ],
    evidence: [
      {
        id: "e1",
        text: "Achilles' instruction is specific and limiting: win at the ships, do not pursue toward the city. He names the boundary twice.",
        designNote:
          "Supports strategy and love (a boundary is a protection) and cuts against denial, since naming a limit implies modelling a danger.",
      },
      {
        id: "e2",
        text: "He does not lend the armour to any of the other Greek commanders who had come to plead with him earlier, and who were also losing.",
        designNote:
          "The comparison case. If the reason were tactical, other bodies would do. This pulls toward love and away from pure strategy.",
      },
      {
        id: "e3",
        text: "Patroclus crosses the boundary, reaches the wall of Troy, and is killed. Achilles' grief when the news arrives is described as total, and immediately redirects the entire war.",
        designNote:
          "Evidence about the aftermath, not the decision. Included precisely to see whether participants let a consequence revise their reading of an intention — a live question in both narrative and causal inference.",
      },
    ],
  },
  {
    id: "achilles-return",
    track: "myth",
    title: "Why Achilles returns",
    source: "public-domain-myth",
    context:
      "Achilles has refused every offer: gifts, restored honour, the entreaties of the embassy. Nothing moves him back into the war. Then Patroclus dies wearing his armour.",
    stimulus: "He returns to the fighting immediately, knowing from prophecy that doing so shortens his own life.",
    question: "What changed?",
    interpretations: [
      { id: "grief", label: "Grief", gloss: "The loss reorganises what he wants; the war becomes the only available shape for it." },
      { id: "guilt", label: "Guilt", gloss: "He sent him. The return is addressed to his own part in it." },
      { id: "honour", label: "Honour", gloss: "The old code reasserts itself — a companion's death demands an answer, and the quarrel becomes irrelevant." },
      { id: "identity", label: "Nothing left to protect", gloss: "His refusal was a way of holding onto a long life worth having. That life is gone, so the cost of returning has fallen to nearly zero." },
    ],
    evidence: [
      {
        id: "e1",
        text: "In the embassy scene, before Patroclus dies, Achilles describes a choice between a long obscure life at home and a short glorious one at Troy, and says he is inclined to go home.",
        designNote:
          "Establishes the prior state. Strengthens 'nothing left to protect' by showing what he was protecting.",
      },
      {
        id: "e2",
        text: "His first words on hearing the news are about his own failure to be there, not about Hector.",
        designNote: "Direct support for guilt; mild pressure against a purely code-driven honour reading.",
      },
      {
        id: "e3",
        text: "What follows is not only a duel but the desecration of Hector's body over many days — behaviour the poem itself frames as excessive, through the reactions of gods and men.",
        designNote:
          "Cuts against 'honour', since the code is what he violates. Consistent with grief and guilt. A case where more evidence narrows the field without picking a single winner.",
      },
    ],
  },
  {
    id: "cassandra",
    track: "myth",
    title: "The problem of Cassandra",
    source: "public-domain-myth",
    context:
      "Cassandra is given true prophecy and the curse that no one will believe her. In Aeschylus she stands outside the house at Argos and describes, accurately, the murder about to happen inside.",
    stimulus: "The chorus hears her clearly, understands the words, and does not act.",
    question: "What is the failure being dramatised?",
    interpretations: [
      { id: "curse", label: "The curse, straightforwardly", gloss: "A supernatural fact overrides ordinary reasoning. There is nothing to explain." },
      { id: "prior", label: "An unbearable prior", gloss: "The claim is so far outside what they expect that no testimony could outweigh it — a limit case of belief revision." },
      { id: "register", label: "A failure of register", gloss: "She speaks in a mode that reads as raving, so the content never gets evaluated at all." },
      { id: "power", label: "Motivated disbelief", gloss: "Believing her would require action that is costly and dangerous. Disbelief is convenient." },
    ],
    evidence: [
      {
        id: "e1",
        text: "The chorus repeatedly says they understand the words but not the meaning, and ask her to speak more plainly.",
        designNote: "Strong support for the register reading; weak against the curse, which need not operate through comprehension.",
      },
      {
        id: "e2",
        text: "Her earlier, equally accurate prophecies to the Trojans were also disbelieved — by a different population, in a different city, with different interests.",
        designNote:
          "The controlled comparison. Different audiences and stakes, same outcome, which is hard to explain by local motivation and easier to explain by a constant — the curse, or something structural about the claim itself.",
      },
    ],
  },
  {
    id: "orpheus-turn",
    track: "myth",
    title: "Orpheus turns around",
    source: "public-domain-myth",
    context:
      "Orpheus is allowed to lead Eurydice out of the underworld on one condition: he must not look back at her until both are in the upper world. She follows behind him in silence.",
    stimulus: "A few steps from the exit, he turns.",
    question: "Why does he turn?",
    interpretations: [
      { id: "doubt", label: "Doubt", gloss: "He cannot verify she is there, and the uncertainty becomes unbearable before the condition expires." },
      { id: "love", label: "Wanting to see her", gloss: "The looking is the point. The condition asked him to postpone the only thing he came for." },
      { id: "care", label: "Care", gloss: "He turns to check she is safe — a protective act that destroys what it protects." },
      { id: "design", label: "A condition built to fail", gloss: "The underworld sets a term it expects a living person to break. The turn is the predicted output of the system." },
    ],
    evidence: [
      {
        id: "e1",
        text: "Ovid's version says he turned in a moment of fear for her, and Virgil's says a sudden madness took him. The two surviving classical accounts assign different internal causes.",
        designNote:
          "The underdetermination case made explicit: the primary sources disagree about the mental state, so the evidence cannot settle between 'care' and the others. Participants who collapse onto one reading here are worth looking at.",
      },
      {
        id: "e2",
        text: "Eurydice makes no sound behind him for the entire ascent. Shades do not necessarily make footfalls.",
        designNote: "Supports doubt by supplying a concrete reason the absence of evidence would feel like evidence of absence.",
      },
    ],
  },
  {
    id: "prometheus",
    track: "myth",
    title: "Prometheus and the cost of the gift",
    source: "public-domain-myth",
    context:
      "Prometheus takes fire — in Hesiod and in Aeschylus, alongside the crafts and the knowledge of number and medicine — and gives it to humans, knowing what Zeus will do to him for it.",
    stimulus: "He gives it anyway.",
    question: "What best explains the act?",
    interpretations: [
      { id: "compassion", label: "Compassion", gloss: "Humans were freezing and helpless; the reason is simply their condition." },
      { id: "defiance", label: "Defiance", gloss: "The act is aimed at Zeus. Humanity is the instrument of a quarrel among gods." },
      { id: "foresight", label: "Foresight", gloss: "His name means forethought. He is optimising a long horizon in which the punishment is a survivable cost." },
      { id: "craft", label: "A craftsman's conviction", gloss: "He believes knowledge belongs with whoever can use it, independent of who suffers for moving it." },
    ],
    evidence: [
      {
        id: "e1",
        text: "In Aeschylus he lists what he gave — fire, but also writing, astronomy, medicine, the domestication of animals — as a single continuous act of equipping.",
        designNote: "Supports craft and compassion over a narrowly anti-Zeus defiance reading.",
      },
      {
        id: "e2",
        text: "The same play has him say he knew precisely what he was doing and chose it with open eyes, and also that he cannot bear the sight of what is being done to him.",
        designNote:
          "Foresight and suffering coexist. Included because participants often treat 'he knew the cost' as evidence that the cost did not matter to him.",
      },
    ],
  },
  {
    id: "antigone",
    track: "myth",
    title: "Antigone at the grave",
    source: "public-domain-myth",
    context:
      "Creon forbids the burial of Polynices on pain of death. Antigone, his sister, buries him — and when the body is uncovered by the guards, she returns and does it again in daylight.",
    stimulus: "The second burial, performed where she can be seen.",
    question: "What is the second burial for?",
    interpretations: [
      { id: "rite", label: "Completing the rite", gloss: "The first was undone; the obligation is unmet until it is done. Visibility is incidental." },
      { id: "public", label: "Making the claim public", gloss: "A secret burial satisfies the rite but not the argument. She wants the law contradicted in the open." },
      { id: "death", label: "Choosing the outcome", gloss: "She intends to be caught. The burial is also a way of ending." },
      { id: "kin", label: "An obligation that does not negotiate", gloss: "She does not experience it as a choice between competing claims at all." },
    ],
    evidence: [
      {
        id: "e1",
        text: "When Creon asks whether she knew the decree, she answers immediately that she did, and does not attempt any defence based on ignorance or necessity.",
        designNote: "Supports 'public' and 'kin'; ambiguous between them, which is the point.",
      },
      {
        id: "e2",
        text: "Sophocles has her later grieve, at length and bitterly, for the marriage and the life she will not have.",
        designNote:
          "Substantial pressure against the 'choosing death' reading. Whether participants actually move on it is exactly the sort of thing this experiment is for; we have not assumed an answer.",
      },
    ],
  },
];
