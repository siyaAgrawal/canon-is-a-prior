/**
 * Sources.
 *
 * Rules applied: nothing is listed that was not consulted; nothing is described as
 * supporting a claim it does not make; and where this project uses an idea more
 * loosely than its source does, the `useNote` says so. Links are to stable,
 * freely-readable locations where one exists (arXiv, the Stanford Encyclopedia,
 * DOI resolvers, Perseus for classical texts).
 */

export type SourceKind = "primary" | "secondary" | "background";

export interface Source {
  id: string;
  kind: SourceKind;
  authors: string;
  year: string;
  title: string;
  where: string;
  url?: string;
  /** How this project actually uses it — including where it uses it loosely. */
  useNote: string;
}

export const sourceSections: { id: string; title: string; blurb: string; sources: Source[] }[] = [
  {
    id: "physics",
    title: "Quantum mechanics and the category problem",
    blurb:
      "The physics section of this site makes a modest historical claim and a philosophical one. The historical claim is sourced here; the philosophical one is the project's own.",
    sources: [
      {
        id: "debroglie-1924",
        kind: "primary",
        authors: "Louis de Broglie",
        year: "1924",
        title: "Recherches sur la théorie des quanta",
        where: "Doctoral thesis, University of Paris; reprinted in Annales de Physique, 10th series, vol. 3 (1925), 22–128",
        url: "https://tel.archives-ouvertes.fr/tel-00006807",
        useNote:
          "The source of the matter-wave hypothesis, λ = h/p. This site uses it for one point only: the proposal required applying a description previously reserved for radiation to matter. It does not use de Broglie as an authority on interpretation, reading, or anything outside physics.",
      },
      {
        id: "davisson-germer",
        kind: "primary",
        authors: "Clinton Davisson and Lester Germer",
        year: "1927",
        title: "Diffraction of Electrons by a Crystal of Nickel",
        where: "Physical Review 30(6), 705–740",
        url: "https://doi.org/10.1103/PhysRev.30.705",
        useNote:
          "The experimental confirmation. Cited so that the hypothesis is not presented as having been accepted on elegance alone; G. P. Thomson's independent electron-diffraction work the same year is the other half of that record.",
      },
      {
        id: "bohr-1928",
        kind: "primary",
        authors: "Niels Bohr",
        year: "1928",
        title: "The Quantum Postulate and the Recent Development of Atomic Theory",
        where: "Nature 121, 580–590",
        url: "https://doi.org/10.1038/121580a0",
        useNote:
          "Bohr's complementarity: wave and particle descriptions are both required and are not simultaneously applicable. This site presents complementarity as one influential interpretation, not as the settled meaning of the formalism — interpretations of quantum mechanics remain genuinely disputed.",
      },
    ],
  },
  {
    id: "inference",
    title: "Probability and belief revision",
    blurb: "Where the formal apparatus in the experiment comes from, and what it is entitled to claim.",
    sources: [
      {
        id: "bayes-1763",
        kind: "primary",
        authors: "Thomas Bayes (communicated by Richard Price)",
        year: "1763",
        title: "An Essay towards solving a Problem in the Doctrine of Chances",
        where: "Philosophical Transactions of the Royal Society of London 53, 370–418",
        url: "https://doi.org/10.1098/rstl.1763.0053",
        useNote: "The original. Cited for provenance; the modern odds form used on this site is later.",
      },
      {
        id: "kullback-leibler",
        kind: "primary",
        authors: "Solomon Kullback and Richard Leibler",
        year: "1951",
        title: "On Information and Sufficiency",
        where: "Annals of Mathematical Statistics 22(1), 79–86",
        url: "https://doi.org/10.1214/aoms/1177729694",
        useNote:
          "The divergence used in the analysis pages. This site always reports it as a smoothed estimate, because participants assign zero probabilities and the unsmoothed quantity would be infinite.",
      },
      {
        id: "jaynes",
        kind: "background",
        authors: "E. T. Jaynes",
        year: "2003",
        title: "Probability Theory: The Logic of Science",
        where: "Cambridge University Press",
        useNote:
          "The strongest statement of the view that probability is extended logic. Included as background, and as a position this project does not simply assume: Jaynes would take the framing further than anything here claims.",
      },
      {
        id: "sep-bayes",
        kind: "secondary",
        authors: "James Joyce",
        year: "2021",
        title: "Bayes' Theorem",
        where: "Stanford Encyclopedia of Philosophy",
        url: "https://plato.stanford.edu/entries/bayes-theorem/",
        useNote: "The reference used when writing the explanatory sections, and the recommended next step for a reader who wants the formal treatment.",
      },
      {
        id: "sep-bayes-epist",
        kind: "secondary",
        authors: "William Talbott",
        year: "2016",
        title: "Bayesian Epistemology",
        where: "Stanford Encyclopedia of Philosophy",
        url: "https://plato.stanford.edu/entries/epistemology-bayesian/",
        useNote: "Includes the standard objections — the problem of the priors, old evidence, logical omniscience — which this project's limitations page relies on.",
      },
      {
        id: "tversky-kahneman",
        kind: "primary",
        authors: "Amos Tversky and Daniel Kahneman",
        year: "1974",
        title: "Judgment under Uncertainty: Heuristics and Biases",
        where: "Science 185(4157), 1124–1131",
        url: "https://doi.org/10.1126/science.185.4157.1124",
        useNote:
          "Relevant because this experiment asks humans for numerical probabilities, and this literature is the reason those numbers must be treated as reports rather than as measurements of belief. Anchoring, in particular, is a known risk in the design used here.",
      },
      {
        id: "brier",
        kind: "primary",
        authors: "Glenn W. Brier",
        year: "1950",
        title: "Verification of Forecasts Expressed in Terms of Probability",
        where: "Monthly Weather Review 78(1), 1–3",
        url: "https://doi.org/10.1175/1520-0493(1950)078<0001:VOFEIT>2.0.CO;2",
        useNote:
          "The standard proper scoring rule. Noted on the limitations page as the reason this project cannot score interpretations for accuracy: a Brier score needs a ground truth, and these scenarios do not have one.",
      },
    ],
  },
  {
    id: "philosophy-of-science",
    title: "Theory change and underdetermination",
    blurb: "The four positions the philosophy section works through, in their own words where possible.",
    sources: [
      {
        id: "kuhn-1962",
        kind: "primary",
        authors: "Thomas S. Kuhn",
        year: "1962",
        title: "The Structure of Scientific Revolutions",
        where: "University of Chicago Press",
        useNote:
          "Used for normal science, anomaly and crisis. This site does not claim Kuhn held that theory choice is irrational — he explicitly denied it in the 1969 postscript — and says so on the philosophy page.",
      },
      {
        id: "popper-1959",
        kind: "primary",
        authors: "Karl Popper",
        year: "1959 (German original 1934)",
        title: "The Logic of Scientific Discovery",
        where: "Hutchinson; original as Logik der Forschung, Springer",
        useNote:
          "Used for falsifiability as a demarcation criterion. Note that Popper rejected the idea that induction or confirmation supports theories — so the Bayesian framing on this site is one he would have opposed. The site states this rather than blending them.",
      },
      {
        id: "peirce-cp",
        kind: "primary",
        authors: "Charles Sanders Peirce",
        year: "1903",
        title: "Lectures on Pragmatism (Collected Papers 5.189)",
        where: "Collected Papers of Charles Sanders Peirce, Harvard University Press, 1931–1958",
        useNote:
          "The canonical statement of the abductive schema: a surprising fact is observed; if H were true, it would be a matter of course; hence reason to suspect H. Used to make the point that Bayesian updating cannot generate the hypotheses it distributes belief over.",
      },
      {
        id: "duhem",
        kind: "primary",
        authors: "Pierre Duhem",
        year: "1906",
        title: "La Théorie physique: son objet et sa structure",
        where: "English: The Aim and Structure of Physical Theory, trans. P. Wiener, Princeton, 1954",
        useNote: "The origin of the point that hypotheses meet evidence in bundles, so a failed prediction does not identify the guilty assumption.",
      },
      {
        id: "quine-1951",
        kind: "primary",
        authors: "W. V. O. Quine",
        year: "1951",
        title: "Two Dogmas of Empiricism",
        where: "The Philosophical Review 60(1), 20–43",
        url: "https://doi.org/10.2307/2181906",
        useNote: "The stronger holist version of the same point, and the source of the 'web of belief' image used on the philosophy page.",
      },
      {
        id: "sep-underdetermination",
        kind: "secondary",
        authors: "Kyle Stanford",
        year: "2023",
        title: "Underdetermination of Scientific Theory",
        where: "Stanford Encyclopedia of Philosophy",
        url: "https://plato.stanford.edu/entries/scientific-underdetermination/",
        useNote: "Distinguishes the varieties of underdetermination that this site deliberately keeps separate from mere 'we don't know yet'.",
      },
      {
        id: "sep-abduction",
        kind: "secondary",
        authors: "Igor Douven",
        year: "2021",
        title: "Abduction",
        where: "Stanford Encyclopedia of Philosophy",
        url: "https://plato.stanford.edu/entries/abduction/",
        useNote: "Covers the relationship between inference to the best explanation and Bayesian confirmation, which the philosophy page summarises.",
      },
      {
        id: "sep-models",
        kind: "secondary",
        authors: "Roman Frigg and Stephan Hartmann",
        year: "2020",
        title: "Models in Science",
        where: "Stanford Encyclopedia of Philosophy",
        url: "https://plato.stanford.edu/entries/models-science/",
        useNote: "The source for the site's distinction between a model and the thing modelled.",
      },
      {
        id: "gadamer",
        kind: "primary",
        authors: "Hans-Georg Gadamer",
        year: "1960",
        title: "Wahrheit und Methode (Truth and Method)",
        where: "Mohr Siebeck; English trans. Weinsheimer and Marshall, Continuum, 1989",
        useNote:
          "The account of 'prejudice' as an enabling condition of understanding, which is the closest thing in the hermeneutic tradition to this project's use of 'prior'. The comparison is the project's own and Gadamer would have resisted the quantification.",
      },
      {
        id: "sep-hermeneutics",
        kind: "secondary",
        authors: "Bjørn Ramberg and Kristin Gjesdal",
        year: "2021",
        title: "Hermeneutics",
        where: "Stanford Encyclopedia of Philosophy",
        url: "https://plato.stanford.edu/entries/hermeneutics/",
        useNote: "Background reading for the interpretation section.",
      },
    ],
  },
  {
    id: "machines",
    title: "Language models, uncertainty and calibration",
    blurb:
      "The empirical literature the human-versus-model comparison has to be read against. None of these papers is about literary interpretation; that is precisely the gap this experiment sits in.",
    sources: [
      {
        id: "guo-2017",
        kind: "primary",
        authors: "Chuan Guo, Geoff Pleiss, Yu Sun, Kilian Q. Weinberger",
        year: "2017",
        title: "On Calibration of Modern Neural Networks",
        where: "ICML 2017",
        url: "https://arxiv.org/abs/1706.04599",
        useNote: "The standard reference for the finding that accuracy and confidence come apart in modern networks. Establishes that 'confident' is not a synonym for 'likely to be right'.",
      },
      {
        id: "kadavath-2022",
        kind: "primary",
        authors: "Saurav Kadavath et al.",
        year: "2022",
        title: "Language Models (Mostly) Know What They Know",
        where: "arXiv:2207.05221",
        url: "https://arxiv.org/abs/2207.05221",
        useNote:
          "Evidence that self-evaluation in large models carries real signal on tasks with verifiable answers. Cited with the caveat that the tasks studied have ground truth and the scenarios on this site do not, so the result does not transfer directly.",
      },
      {
        id: "lin-2022",
        kind: "primary",
        authors: "Stephanie Lin, Jacob Hilton, Owain Evans",
        year: "2022",
        title: "Teaching Models to Express Their Uncertainty in Words",
        where: "arXiv:2205.14334",
        url: "https://arxiv.org/abs/2205.14334",
        useNote: "Directly relevant to the method used here, which asks a model for verbalised probabilities rather than reading token likelihoods.",
      },
      {
        id: "tian-2023",
        kind: "primary",
        authors: "Katherine Tian et al.",
        year: "2023",
        title: "Just Ask for Calibration: Strategies for Eliciting Calibrated Confidence Scores from Language Models",
        where: "EMNLP 2023; arXiv:2305.14975",
        url: "https://arxiv.org/abs/2305.14975",
        useNote:
          "The finding that elicited confidence is sensitive to how you ask is the reason this site pins a prompt version to every stored model response, and the reason results across prompt versions must not be pooled.",
      },
    ],
  },
  {
    id: "interpretation",
    title: "How people read each other",
    blurb: "The pragmatics behind the language track.",
    sources: [
      {
        id: "grice-1975",
        kind: "primary",
        authors: "H. P. Grice",
        year: "1975",
        title: "Logic and Conversation",
        where: "In Cole and Morgan (eds.), Syntax and Semantics 3: Speech Acts, Academic Press, 41–58",
        useNote: "Implicature: how a speaker means more than they say, and why a hearer is entitled to infer it. The language scenarios are built on Gricean ambiguity.",
      },
      {
        id: "sperber-wilson",
        kind: "primary",
        authors: "Dan Sperber and Deirdre Wilson",
        year: "1986",
        title: "Relevance: Communication and Cognition",
        where: "Blackwell",
        useNote: "The successor account, in which interpretation is the search for the reading that repays processing effort. Relevant to why the 'effort' evidence items in the scenario set discriminate as well as they do.",
      },
      {
        id: "kruger-2005",
        kind: "primary",
        authors: "Justin Kruger, Nicholas Epley, Jason Parker, Zhi-Wen Ng",
        year: "2005",
        title: "Egocentrism over E-Mail: Can We Communicate as Well as We Think?",
        where: "Journal of Personality and Social Psychology 89(6), 925–936",
        url: "https://doi.org/10.1037/0022-3514.89.6.925",
        useNote: "Experimental evidence that senders systematically overestimate how clearly tone is conveyed in text. Part of the motivation for the language track.",
      },
      {
        id: "clark-brennan",
        kind: "primary",
        authors: "Herbert H. Clark and Susan E. Brennan",
        year: "1991",
        title: "Grounding in Communication",
        where: "In Resnick, Levine and Teasley (eds.), Perspectives on Socially Shared Cognition, APA, 127–149",
        useNote: "Meaning as something established between participants rather than transmitted. Background for why the scenarios include the interpreter's history as evidence.",
      },
    ],
  },
  {
    id: "brains",
    title: "Prediction in the brain",
    blurb:
      "One node on the original map was 'neuroscience'. It is included here with a warning: this is the connection the project is least sure of.",
    sources: [
      {
        id: "clark-2013",
        kind: "primary",
        authors: "Andy Clark",
        year: "2013",
        title: "Whatever Next? Predictive Brains, Situated Agents, and the Future of Cognitive Science",
        where: "Behavioral and Brain Sciences 36(3), 181–204",
        url: "https://doi.org/10.1017/S0140525X12000477",
        useNote:
          "The accessible statement of predictive processing. Published with peer commentary, much of it critical, which is the honest form in which to cite it.",
      },
      {
        id: "friston-2010",
        kind: "primary",
        authors: "Karl Friston",
        year: "2010",
        title: "The Free-Energy Principle: A Unified Brain Theory?",
        where: "Nature Reviews Neuroscience 11, 127–138",
        url: "https://doi.org/10.1038/nrn2787",
        useNote:
          "The most ambitious version of the claim. This site does not assert that the brain performs Bayesian inference; the map edge for this connection is marked analogical for that reason.",
      },
      {
        id: "tenenbaum-2011",
        kind: "primary",
        authors: "Joshua Tenenbaum, Charles Kemp, Thomas Griffiths, Noah Goodman",
        year: "2011",
        title: "How to Grow a Mind: Statistics, Structure, and Abstraction",
        where: "Science 331(6022), 1279–1285",
        url: "https://doi.org/10.1126/science.1192788",
        useNote: "Bayesian models of human learning at the computational level — a weaker and better-supported claim than the mechanistic one.",
      },
    ],
  },
  {
    id: "texts",
    title: "The primary texts",
    blurb:
      "Every narrative scenario on this site is our own paraphrase of material long in the public domain. Line references are given so that anyone can check the paraphrase against the source.",
    sources: [
      {
        id: "ovid",
        kind: "primary",
        authors: "Ovid",
        year: "c. 8 CE",
        title: "Metamorphoses, Book VIII (Daedalus and Icarus, lines 183–235); Book X (Orpheus)",
        where: "Perseus Digital Library",
        url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0028",
        useNote: "Source for the Icarus and Orpheus scenarios. The detail of Icarus playing in the air, and of Daedalus's shaking hands, are Ovid's.",
      },
      {
        id: "homer",
        kind: "primary",
        authors: "Homer",
        year: "c. 8th century BCE",
        title: "Iliad, Books IX (the embassy), XVI (Patroclus), XVIII (the news), XXIV (Priam)",
        where: "Perseus Digital Library",
        url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0133",
        useNote: "Source for both Achilles scenarios, including the two-fates speech in Book IX that the 'nothing left to protect' reading depends on.",
      },
      {
        id: "plato-symposium",
        kind: "primary",
        authors: "Plato",
        year: "c. 385–370 BCE",
        title: "Symposium 179e–180b",
        where: "Perseus Digital Library",
        url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0173",
        useNote:
          "Phaedrus's speech, which treats Achilles and Patroclus as lovers and disagrees with Aeschylus about which was which. Cited as evidence that antiquity itself argued about this — not as evidence for any particular modern reading.",
      },
      {
        id: "aeschylus",
        kind: "primary",
        authors: "Aeschylus",
        year: "458 BCE / c. 460s BCE",
        title: "Agamemnon (the Cassandra scene, lines 1072–1330); Prometheus Bound",
        where: "Perseus Digital Library",
        url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0003",
        useNote: "Sources for the Cassandra and Prometheus scenarios, including the chorus's stated comprehension of Cassandra's words.",
      },
      {
        id: "sophocles",
        kind: "primary",
        authors: "Sophocles",
        year: "c. 441 BCE",
        title: "Antigone",
        where: "Perseus Digital Library",
        url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0185",
        useNote: "Source for the Antigone scenario, including her lament for the marriage she will not have.",
      },
      {
        id: "virgil",
        kind: "primary",
        authors: "Virgil",
        year: "c. 29 BCE",
        title: "Georgics IV (Orpheus and Eurydice)",
        where: "Perseus Digital Library",
        url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0059",
        useNote: "The second classical account of the turn, which assigns a different cause from Ovid's. The disagreement between them is the evidence the Orpheus scenario uses.",
      },
      {
        id: "hesiod",
        kind: "primary",
        authors: "Hesiod",
        year: "c. 700 BCE",
        title: "Theogony; Works and Days (Prometheus)",
        where: "Perseus Digital Library",
        url: "https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0129",
        useNote: "The earlier and less sympathetic account of Prometheus, included so the Aeschylean version is not treated as the only one.",
      },
    ],
  },
];

export const allSources = sourceSections.flatMap((s) => s.sources);
