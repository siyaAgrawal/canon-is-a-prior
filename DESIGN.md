# Design document — rebuild

Written before the rebuild. Kept in the repo because the reasoning should be
inspectable, and because a later version of me should be able to see what this
version believed.

## What was wrong with the first build

It worked. Every instrument functioned, the statistics were correct, the data
integrity held. And it read like a course: twelve numbered chapters, each opening
with a standfirst that told you what you were about to understand.

Three specific failures:

1. **It explained the interesting part before the reader could find it.** Chapter
   00 stated the thesis. Everything after was elaboration. The reader was never
   in a position to notice anything.
2. **The origin was hidden.** The project came from reading and rewriting
   fanfiction. That was buried in an About page as a sentence about "connecting
   ideas that were not supposed to belong together" — which is the sanitised
   version, and the sanitised version is less interesting and less true.
3. **It pattern-matched without prosecuting itself.** It found the same shape in
   myth, physics, inference and machines, and declared the shape real. The map
   labelled edges "analogical" and stated a disanalogy, which was a start. But
   nothing in the project seriously entertained the possibility that the whole
   thing is apophenia with good typography.

## The central question, restated

Not "how do humans and machines revise interpretations under incomplete
evidence." That is a real question and it is the *second* question.

The first one:

> **How do you tell a structural connection you found from one you imposed?**

This project keeps finding the same shape — inherited model, incomplete evidence,
interpretation, revision — in places that have nothing to do with each other. The
shape might be real. It might also be what a sufficiently determined reader finds
anywhere, the way constellations are real patterns of light and not real objects.

That makes the project recursive. It studies how models get built while being a
model of its own. So the self-critique cannot be an appendix. It has to be an
instrument the reader operates.

## Secondary questions

- Why does changing one assumption sometimes change an entire world, while the
  events stay identical?
- How much of an interpretation came from the evidence, and how much was already
  there before the evidence arrived?
- When does a model help us see, and when does it stop us seeing?
- What does it cost to protect a reading, and do we notice paying it?
- When is a coherent story a trap?

## The recursion, made operable

`/shape` is the new core: an instrument that presents structural claims — some
this project defends, some it has abandoned, some invented as controls — and asks
the reader to judge which are found and which are imposed. Then it shows the
project's own verdict and reasoning.

The reader performs the discrimination the project is about, on the project's own
claims, including the ones it got wrong. Nothing else on the site makes the
recursion felt rather than asserted.

## Architecture

No numbered sequence. Five territories, and a homepage that is an entry rather
than a menu.

- `/` — the entry. One word of evidence. You interpret it. Then you find out you
  were interpreting before any evidence arrived, and that the options you chose
  between were themselves someone's prior. Then the scale breaks: the same
  operation on a character, a myth, a measurement, a dataset, a person.
- `/rewrite` — counterfactual laboratory. Same events, changed premise, watch the
  model reorganise. Icarus, plus an original character scenario built the way
  fanfiction builds one.
- `/versions` — the character lab. Fixed evidence, revealed in order. Measures
  what you discount, what you accommodate, and what it costs to keep a reading.
- `/person` — the quiet one. The model of a person is not the person. One page,
  one diagram, very little text.
- `/categories` — de Broglie. What happens when inherited categories stop fitting.
- `/criteria` — coherent, plausible, supported, true, useful. Not synonyms. The
  reader is made to choose and then shown which criterion they actually used.
- `/machines` — the same ambiguous evidence given to people and to a model.
- `/shape` — is the shape really there. The self-prosecution, as an instrument.
- `/map` — the graph, with break edges drawn as breaks.
- `/lab` — method, data, limits. `/log` — the human record. `/about`, `/ethics`.

## Preserved

Every instrument that worked: simplex elicitation, belief trajectories, the
complementarity model, the aggregate threshold, the storage honesty guard, the
statistics module and its tests, the scenario corpus, real sources.

## Removed

The twelve-chapter sequence. Every standfirst that announced what the page would
teach. The `/bayes` explainer page — Bayes stays, distributed through the site as
the formal spine, not as a lesson. `/underdetermination` as a standalone concept
page. `/end` as a summary. Most connective prose.

## Labels

An epistemic apparatus used everywhere, as small monospace tags:

`OBSERVED` `MODEL` `INTERPRETATION` `ANALOGY` `HYPOTHESIS` `ILLUSTRATION`
`OPEN` `ABANDONED`

If a claim has no label it is prose, not a claim.

## Voice

Short. Specific. No standfirsts. No "this project seeks to explore." Fragments
where a fragment is the honest unit. A page may be one sentence if the sentence
earns it. The creator appears through what she notices and what she refuses to
let go, not through autobiography.

## What the reader should experience, in order

1. Something small and uncomfortable.
2. The realisation they brought the interpretation with them.
3. A second realisation: the options were a prior too.
4. Scale break — the same move on a myth, a particle, a dataset, a person.
5. "Are those actually the same thing?"
6. "No. Here is where each one breaks."
7. "But something is going on."
8. "She knows it might be nothing. She built the test anyway."
