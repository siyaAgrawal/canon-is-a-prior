# Design document — third architecture

## What changed, and why

The site could measure whether an interpretation moved. It could not measure
whether the move was *warranted*. That gap is the whole project, and until now the
instruments were not built to reach it.

Three levels, kept apart everywhere:

| Level | Question | Where it lives |
|---|---|---|
| **I · Construction** | Where does a hypothesis come from at all? | `/sure` (free hypothesis), `/versions` |
| **II · Revision** | What happens when new evidence arrives? | `/sure`, `/versions`, `/machines` |
| **III · Justification** | How would we know the new model is *better*? | `/discriminate`, `/criteria`, `/categories`, `/shape` |

Bayesian updating lives entirely in Level II. It presupposes the hypothesis set —
which is why the project cannot be *about* Bayes. Level I is Peirce's territory and
Level III is where the actual difficulty is.

## The flagship addition: discriminating evidence

Two models. Both fit every observation so far. Neither is wrong yet.

The participant is not asked which they prefer — that measures taste. They are
asked to **design an observation that would tell the two apart**, then to predict
what each model implies about it. Only then is the outcome revealed.

This measures something no other instrument here reaches: whether a person
understands that more evidence is not the same as *discriminating* evidence. It
turns participants from interpreters into experiment designers, and it produces a
gradable response — a proposed test either separates the models or does not.

## Prediction, not post-hoc fit

Every interpretive instrument now asks for a prediction **before** the next
observation. A reading that explains everything after the fact and predicts
nothing is exactly the failure mode the project is about, and it is invisible
unless you make people commit first.

## Parameter / model / category

Three kinds of revision that the previous build collapsed into one:

- **Parameter** — same model, different weights.
- **Model** — different model, same categories.
- **Category** — the options themselves were the wrong shape.

The physics room now presents a classification task where the third becomes
necessary, before de Broglie is mentioned at all.

## Free-text reasoning — a reversal, logged

Until now the site stored nothing typed, and said so proudly. That is now wrong:
*why* someone answered is more informative than what they answered, and no
closed vocabulary recovers it.

So reasoning is collected — optional, capped, explicitly labelled at the point of
entry, never required, with a warning not to include identifying detail. The old
claim is retracted in the log rather than quietly edited out, which is the
discipline the rest of the project demands.

## Hypothesis status

`/shape` gains a state machine that has no terminal success:

`OPEN → SUPPORTED ⇄ WEAKENED → CONTRADICTED → ABANDONED`

There is no `PROVEN`. A hypothesis that has survived every attempt is
`SUPPORTED`, which is a statement about the attempts made.

## The deliverable

Not a website. A dataset with a stated schema, a pre-registered set of
predictions, an export that loads into a notebook unreshaped, and a paper
skeleton that fills itself from live data and says "insufficient" wherever the
data is insufficient.

If the project succeeds, what exists at the end is: **evidence about which
criterion people actually use when the evidence does not decide — and whether a
language model uses the same one.** That is a real finding or a real null result,
and both are publishable.
