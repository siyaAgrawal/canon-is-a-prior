import type { CanonModule } from "@/types";

/**
 * Counterfactual modules.
 *
 * A canon supplies a model: a set of defaults about motive, blame, and meaning that
 * you bring to a text before reading it. These modules let you change exactly one
 * default and watch which other readings move — which is the narrative version of
 * changing one assumption in a model and seeing which predictions survive.
 *
 * Each premise carries a `resists` field. That field is the honesty valve: it names
 * what the altered premise does NOT license, so the module cannot be read as
 * claiming that any premise change makes any reading available. Interpretations are
 * constrained by the text even when the text does not fix a single one.
 */

export const canonModules: CanonModule[] = [
  {
    id: "icarus",
    title: "Icarus",
    attribution:
      "Paraphrased from Ovid, Metamorphoses VIII (public domain). The wording here is ours; no modern retelling is quoted or summarised.",
    canonicalFrame: [
      "Daedalus builds wings from feathers and wax so that he and his son can leave Crete.",
      "He warns Icarus to hold a middle course: the sea will weigh the feathers, the sun will loosen the wax.",
      "They fly. Icarus leaves the middle course and climbs.",
      "The wax gives way. He falls into the sea, and the sea takes his name.",
    ],
    dimensions: [
      "What the fall means",
      "What kind of person Icarus is",
      "What Daedalus did",
      "What the warning was",
      "What the story is for",
    ],
    baseline: [
      { dimension: "What the fall means", reading: "A punishment that fits the offence — the standard reading, in which height and pride are the same movement." },
      { dimension: "What kind of person Icarus is", reading: "Young and overreaching; a boy who thought the rule did not apply to him." },
      { dimension: "What Daedalus did", reading: "Everything he could. He gave a clear instruction and it was not followed." },
      { dimension: "What the warning was", reading: "A command, issued by a father with authority, and disobeyed." },
      { dimension: "What the story is for", reading: "A warning against exceeding your limits." },
    ],
    premises: [
      {
        id: "curiosity",
        label: "Curiosity, not defiance",
        statement: "Icarus climbs because he wants to know what is up there, not because he is answering his father.",
        consequences: [
          { dimension: "What the fall means", reading: "The cost of finding something out. It stops being a punishment and becomes a price — which is how we usually describe experiment, not sin." },
          { dimension: "What kind of person Icarus is", reading: "An investigator with insufficient instruments. His error is epistemic, not moral." },
          { dimension: "What Daedalus did", reading: "Built an instrument whose operating envelope he understood and handed it to someone who had never tested it." },
          { dimension: "What the warning was", reading: "A specification. Specifications constrain; they do not motivate." },
          { dimension: "What the story is for", reading: "A story about the gap between knowing a limit and having felt one." },
        ],
        resists:
          "This does not make Icarus blameless. The text still has him told the limit and still has him exceed it. Curiosity explains the motive; it does not remove the fact that the constraint was known.",
      },
      {
        id: "freedom",
        label: "Freedom, not curiosity",
        statement: "Icarus has lived his life inside a confinement he did not choose. Altitude is the felt opposite of that, and he takes it.",
        consequences: [
          { dimension: "What the fall means", reading: "The cost of the only unconstrained act available to him. The story's centre of gravity moves from the fall to the climb." },
          { dimension: "What kind of person Icarus is", reading: "Someone for whom the middle course is itself a version of the labyrinth." },
          { dimension: "What Daedalus did", reading: "Offered escape on terms that preserved the constraint. The wings free him from Crete and not from instruction." },
          { dimension: "What the warning was", reading: "A smaller cage, reasonably built." },
          { dimension: "What the story is for", reading: "A story about what confinement does to the people who leave it." },
        ],
        resists:
          "Ovid gives Icarus no speech about freedom and no stated grievance. This premise is doing interpretive work the text permits but does not supply. It is a reading, and it should be labelled as one.",
      },
      {
        id: "misunderstanding",
        label: "He does not intend to disobey",
        statement: "Icarus misjudges the height, or misreads what the warning was about. There is no decision to exceed the limit.",
        consequences: [
          { dimension: "What the fall means", reading: "An accident. Accidents do not carry morals, which is why this premise is the most disruptive of the four." },
          { dimension: "What kind of person Icarus is", reading: "Ordinary. Anyone who has never had an altimeter would do the same." },
          { dimension: "What Daedalus did", reading: "Under-specified a safety-critical instruction and provided no way to measure compliance." },
          { dimension: "What the warning was", reading: "Insufficient information, delivered once, in the air, over water." },
          { dimension: "What the story is for", reading: "A story about design and communication under conditions where a single error is fatal." },
        ],
        resists:
          "The text describes a boy drawn upward, not a boy who miscalculates. To hold this premise you must treat the ascent as unnoticed, which strains the account you were given.",
      },
      {
        id: "warning",
        label: "The warning is engineering, not authority",
        statement: "Daedalus's instruction is a fact about wax, not a command about obedience. Nothing in it is about the relationship.",
        consequences: [
          { dimension: "What the fall means", reading: "What happens when a material constraint is treated as a social one. Icarus violates physics while thinking about his father, or about nothing." },
          { dimension: "What kind of person Icarus is", reading: "Not a rebel — a user who did not believe the manual." },
          { dimension: "What Daedalus did", reading: "Communicated a constraint accurately and failed to convey its seriousness, which is a different failure from not saying it." },
          { dimension: "What the warning was", reading: "True, checkable, and delivered in the register of a father, where it could be heard as a rule." },
          { dimension: "What the story is for", reading: "A story about what happens when the same sentence can be heard as a rule or as a fact, and it matters enormously which." },
        ],
        resists:
          "Ovid's Daedalus is not a neutral engineer: he weeps, his hands shake, he repeats himself. The premise cleans the scene of emotion that the source puts there deliberately.",
      },
    ],
  },
  {
    id: "achilles",
    title: "Achilles and Patroclus",
    attribution:
      "Paraphrased from Homer, Iliad IX, XI, XVI–XXIV (public domain). The wording here is ours. The Iliad does not use a word for the relationship that maps onto any modern category, and this module does not pretend otherwise.",
    canonicalFrame: [
      "Achilles withdraws from the fighting after Agamemnon takes Briseis from him.",
      "The Greeks lose ground. An embassy offers restitution; Achilles refuses it.",
      "Patroclus asks to fight in Achilles' armour. Achilles agrees, and sets a limit: the ships, and no further.",
      "Patroclus crosses the limit and is killed by Hector.",
      "Achilles returns, kills Hector, and refuses to release the body until Priam comes to him in person.",
    ],
    dimensions: [
      "What the withdrawal is about",
      "What the armour means",
      "What the return is about",
      "What Patroclus is to Achilles",
      "What the poem is about",
    ],
    baseline: [
      { dimension: "What the withdrawal is about", reading: "Honour. A public insult from a lesser man, answered with absence." },
      { dimension: "What the armour means", reading: "A tactical device: the appearance of Achilles does the work of Achilles." },
      { dimension: "What the return is about", reading: "Vengeance — the heroic code reasserting itself over the quarrel." },
      { dimension: "What Patroclus is to Achilles", reading: "His closest companion, and the older of the two in most ancient accounts." },
      { dimension: "What the poem is about", reading: "The wrath of Achilles, which is what it says in its first line." },
    ],
    premises: [
      {
        id: "grief-first",
        label: "Read the return as grief rather than vengeance",
        statement: "Achilles goes back because the loss reorganises what he wants, not because the code demands an answer.",
        consequences: [
          { dimension: "What the withdrawal is about", reading: "Less about honour and more about what he was protecting: a long life he had explicitly said he preferred." },
          { dimension: "What the armour means", reading: "The thing he could give when he could not give himself." },
          { dimension: "What the return is about", reading: "Not restoration but collapse. He returns because the reason for staying out has been removed." },
          { dimension: "What Patroclus is to Achilles", reading: "The condition of the life he was choosing over glory." },
          { dimension: "What the poem is about", reading: "What a person does when the thing their choices were organised around is gone." },
        ],
        resists:
          "The poem's own framing device is wrath, announced in the first word. A grief reading has to explain why the poem foregrounds anger, not replace the anger with something more comfortable.",
      },
      {
        id: "guilt",
        label: "Centre the fact that he sent him",
        statement: "Achilles agreed to the plan and set the limit. When the limit is crossed, his part in the death is not zero.",
        consequences: [
          { dimension: "What the withdrawal is about", reading: "Retrospectively, the cause of everything that follows — which is how Achilles himself comes to describe it." },
          { dimension: "What the armour means", reading: "An instrument of his own making, used exactly as designed and fatally." },
          { dimension: "What the return is about", reading: "Addressed partly at himself. Hector is available; the other target is not." },
          { dimension: "What Patroclus is to Achilles", reading: "Someone he calculated with, once, and could not stop calculating about afterwards." },
          { dimension: "What the poem is about", reading: "Responsibility under conditions where you controlled some of the causes and none of the outcome." },
        ],
        resists:
          "Homer supplies divine causation too — Apollo strikes Patroclus before Hector does. A guilt reading that ignores this is reading a nineteenth-century novel's causal structure into an epic that does not share it.",
      },
      {
        id: "strategy",
        label: "Take the tactical explanation at face value",
        statement: "The substitution is a sound plan. The relationship supplies the trust, not the motive.",
        consequences: [
          { dimension: "What the withdrawal is about", reading: "A negotiating position, sustained as long as it was working." },
          { dimension: "What the armour means", reading: "Exactly what it appears to be: an information operation against the Trojan line." },
          { dimension: "What the return is about", reading: "The plan's failure, and the removal of the person the withdrawal was costing him." },
          { dimension: "What Patroclus is to Achilles", reading: "The only person he trusted to execute inside a limit — which is itself a statement about the relationship." },
          { dimension: "What the poem is about", reading: "Decision-making under a code that prices honour, life and friendship in the same currency." },
        ],
        resists:
          "If the reason were purely tactical, other commanders were available and asking. That he lends it to one person and not to them is evidence the premise has to absorb.",
      },
      {
        id: "modern",
        label: "Read it through a modern category",
        statement: "Apply a contemporary relational category — romantic, fraternal, or otherwise — to a text that has none of them.",
        consequences: [
          { dimension: "What the withdrawal is about", reading: "Unchanged. This is a reading about one relationship, not about the quarrel with Agamemnon." },
          { dimension: "What the armour means", reading: "Intimacy: your own skin lent out." },
          { dimension: "What the return is about", reading: "Bereavement in a form the reader recognises, which is part of why the reading is attractive." },
          { dimension: "What Patroclus is to Achilles", reading: "A category the Iliad does not name and later antiquity argued about at length — Aeschylus and Plato's Symposium both take positions, and disagree with each other." },
          { dimension: "What the poem is about", reading: "Changes with the reader, which is the honest thing to say about it." },
        ],
        resists:
          "This is the premise that most needs its own label. The ancient debate is real and documented, and so is the absence of a settled term in Homer. A reading can be well-motivated, historically situated, and still not the text's own — and pretending otherwise would be the exact error this project is about.",
      },
    ],
  },
];

export function getCanonModule(id: string): CanonModule | undefined {
  return canonModules.find((m) => m.id === id);
}
