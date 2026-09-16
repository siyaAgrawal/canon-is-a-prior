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

---

# Fourth architecture — the Canon Test, and my objections to it

## The strongest version of the question

Not "how do people revise interpretations" (measurable, and a bit inert), and not
"can we tell real patterns from imposed ones" (as stated, unfalsifiable). The
sharpest version this project can actually reach:

> When a structural claim cannot be settled by the evidence available, which
> features of the claim do people treat as decisive — and are those the features
> that predict whether it survives adversarial testing?

That is answerable here, because `/shape` already contains a kind of ground
truth: three claims are fabricated and I know which. So acceptance can be
regressed against claim features rather than merely tallied.

## The most important confound, and it is severe

**The controls and the real claims share an author, and the author knew which was
which while writing them.** So "participants accept the fabrications" may measure
nothing about human reasoning and everything about one person writing fluent
fakes.

Partial remedy, implemented: participants rate each claim on two surface features
— *does it name a mechanism?* and *could you state what would falsify it?* — and
acceptance is modelled against those ratings as well as against true status. If
acceptance tracks the surface features equally for real and fabricated claims,
the confound is doing the work and the page must say so.

It is a partial remedy. The real fix is a second author writing controls blind,
and that is on the open-questions list rather than pretended away.

## The experiment that was missing

The brief proposes Group A without the framework, Group B with it. Between-subject
assignment on a self-selecting website gives arms that differ by who chose to
arrive, and the outcome measures are soft.

**Better: within-subject, pre/post, with a control arm that gets the same time
on task.** A participant judges claim set α cold. Then either works through the
Canon Test on one claim (*test arm*) or does an unrelated matched task (*control
arm*). Then judges claim set β, matched to α in composition. Change in behaviour
from α to β is compared across arms, so practice and fatigue are controlled
rather than assumed away.

## The measure that makes this worth doing

Almost every "critical thinking intervention" that reports success has moved a
**threshold**, not improved **discrimination**. People become more sceptical of
everything, reject more of both kinds, and the accuracy on fabrications rises
purely as a side effect of rejecting more overall.

So the analysis separates two quantities, borrowed from signal detection:

- **Sensitivity** — can you tell fabricated from defended claims at all? Measured
  as the gap between acceptance of real claims and acceptance of controls.
- **Bias** — how willing are you to accept anything? Overall acceptance rate.

A protocol that raises sensitivity is useful. A protocol that only lowers bias
has made people harder to convince without making them better at judging, which
is a *worse* outcome than no protocol, and the most likely one.

**This is the project's actual contribution, and I expect the null.** If the
Canon Test moves bias and not sensitivity, that is a real finding about a whole
genre of thinking tools.

## The most dangerous way this fools itself

Treating "participants accepted my fabrication" as a fact about people when the
item sample is **three**. Item-level effects will masquerade as person-level
effects, and one unusually good control could carry the entire result.

Remedy, implemented: acceptance is reported **per item** as well as per person,
and the item n is stated as 3 wherever the finding appears. If one control does
all the work, the page says which.

## What is not built, and is therefore not claimed

- Controls written by a second author who does not know the project's real claims.
- Any outcome measure beyond judgement of this claim set — no transfer test.
- Long-run retention. Everything here is within one session.
