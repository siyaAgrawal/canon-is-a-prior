# The Canon Is a Prior

> Change one assumption and the person changes, though nothing they did has.

**Live:** https://canon-is-a-prior.vercel.app

---

## The three levels

The project separates three problems that get collapsed routinely, and the separation is
the architecture:

| | Question | Where |
|---|---|---|
| **I · Construction** | Where does a hypothesis come from at all? | `/versions`, `/rewrite` |
| **II · Revision** | What does evidence do to it? | `/sure`, `/machines` |
| **III · Justification** | How would we know the new model is *better*? | `/discriminate`, `/criteria`, `/categories`, `/shape` |

Bayes' rule lives entirely in Level II and describes it completely — which is why the project
cannot be *about* Bayes. Level I is where hypotheses are generated, which no updating rule
does. Level III is where the difficulty is.

## What this is

It started in fanfiction. The same character, the same scenes, the same lines — and one
writer makes the cruelty load-bearing while another makes it fear wearing a uniform. Both
are recognisably him. If the evidence is fixed and the person changes, the person was never
only the evidence.

The same move turns up in a myth, a statute, a measurement, a dataset, and someone you know.

So there are two questions here, and the second one is the project:

1. When evidence is incomplete, how do we build the version of it we then call reality?
2. **How do you tell a structural connection you found from one you imposed?**

The second makes this recursive. It studies how models get built while being one. A person
who has found a real pattern and a person who is seeing things report the same experience:
it gets clearer with every example, examples are easy to add, and adding them feels like
evidence.

Which is why the self-critique is not an appendix. It is the instrument at `/shape`.

See [DESIGN.md](DESIGN.md) for why the first version of this site was scrapped.

---

## The dataset

**Every instrument records.** Finishing with any of them writes one row:

| Instrument | What it stores |
|---|---|
| `entry` | The "Sure." reading held at each stage, how often you moved, confidence before any evidence |
| `discriminate` | Preferred model and criterion, proposed test and whether it discriminates, prediction and confidence, revision, reasoning |
| `category` | Where each specimen went, what was done with the anomaly, any category named, reasoning |
| `character` | Which assumptions about Draco you tried, in order |
| `rewrite` | Which Icarus premises you opened, and dwell time |
| `versions` | The reading held at each fact, what you did with it, switches and accommodations |
| `shape` | Your ten judgements, and how many of the three controls passed |
| `criteria` | Which explanation you picked in each case, and whether one property decided both |
| `map` | Which nodes you opened |

Plus the scenario experiment on `/machines`, which stores a fully typed
`ParticipantResponse` because its statistics depend on the shape.

Payloads are **closed**, not merely validated: `lib/trace-schema.ts` declares the permitted
keys per instrument and the API strips everything else before writing. A field the schema does
not know is dropped rather than kept as a blob, asserted in `npm test`.

**Free-text reasoning is collected**, and this reverses an earlier position. The site used to
store nothing typed and said so as a feature. That was wrong: *why* someone answered is more
informative than what they answered, and no fixed vocabulary recovers a reason. Reasoning
boxes are optional, capped at 600 characters, stripped of control characters, and labelled
*stored verbatim* where they appear. The retraction is in `/log` rather than edited away.

### The deliverable

Not this site. Token-protected:

| Endpoint | What |
|---|---|
| `/api/export?kind=traces&format=csv` | Long format — one row per response, per field |
| `/api/export?kind=responses&format=csv` | Scenario distributions |
| `/api/export?kind=ai&format=json` | Model runs with pinned prompt version |
| `/api/paper` | Draft manuscript, results generated from storage at request time |

The manuscript prints **insufficient data** wherever n is below 30 rather than omitting the
section — an absent section reads as an oversight; "insufficient" reads as a fact about the
state of the work.

If this succeeds, what exists at the end is evidence about **which criterion people reach for
when the evidence runs out**, whether it is stable across domains, whether people distinguish
confirming from discriminating observations, and whether a language model reaches for the
same one. A clear null on any of those is a result.

## The rule everything else depends on

**No fabricated data.** No invented participant counts, results, accuracy figures, model
performance numbers, significance claims, citations, endorsements or awards.

- Empty dataset → every page renders an explicit empty state showing zero.
- Group aggregates are withheld below **n = 5**, so a group statistic is never one person's
  answer wearing a disguise.
- No model API key → the comparison says so and shows nothing. There is no demo mode.
- Filesystem that doesn't persist → submissions are **refused with an explanation** rather
  than accepted and silently lost.

Every claim that does work carries an epistemic tag:

`OBSERVED` · `MODEL` · `INTERPRETATION` · `ANALOGY` · `HYPOTHESIS` · `ILLUSTRATION` · `OPEN` · `ABANDONED`

Untagged text is prose, not a finding.

### The one deliberate invention

Three of the ten claims on `/shape` are fabrications I wrote myself, in the same voice, by
the same method I use for real ones. They are controls. The page reveals them as controls on
the same screen it reveals everything else, and if they pass, that is the result.

They are load-bearing. Do not "fix" them into real claims.

---

## Routes

Fifteen routes in eight rooms. **Every route loads standalone, survives a refresh, and is
reachable from the index (or the `I` key) on every page.** No page requires another to have
been visited, and every URL this project has ever published still redirects somewhere useful.

| Route | Room | What you do there |
|---|---|---|
| `/` | night library | **"Sure."** — one word, five readings. Commit, say how certain you are, then three facts arrive *after* the commitment. Then the same move on a character, a myth, and four other things. |
| `/sure` | night library | The full version: forty-two scenarios, a hundred points spread across readings, evidence one piece at a time, then what everyone else did. |
| `/versions` | night library | Why fanfiction is the original laboratory, then seven facts about an invented person — measuring what it costs to keep your first reading. |
| `/rewrite` | ground → sun | Scroll and he climbs. The sky lightens, the figure rises, and changing why he climbed re-reads all four fixed events. |
| `/shape` | forensic | Ten structural claims. Some defended, one abandoned, **three written as controls**. Judge before the reveal. |
| `/categories` | cold bench | Sort six specimens, then meet the seventh, which has the defining property of both kinds. de Broglie is named only afterwards. |
| `/person` | the quiet room | The model of a person is not the person. One diagram, almost no text. |
| `/criteria` | graphite | Coherent, plausible, supported, predictive, useful, satisfying, true. Two cases where you cannot have them all — it reports which property you treated as decisive. |
| `/discriminate` | graphite | **The flagship.** Two models, both fitting everything. Design the observation that would tell them apart, predict its result, then see it. Proposed tests are graded: a candidate either separates the models or it does not. |
| `/discovery` | forensic | Every candidate finding with its status, what would move it, and the rival that would explain the same data. No `proven` column, ever. |
| `/machines` | graphite | The same ambiguous evidence, given to people and to a language model. |
| `/map` | deep field | 25 nodes, 38 edges. Severed connections drawn as severed. Ringed nodes are places you can go — the map is also navigation. |
| `/lab` | archive | Live counts, pre-registered predictions, method, limitations. |
| `/ethics` | archive | What is stored, what is not, and the three trade-offs that buys. |
| `/log` | archive | Question / what I thought / what broke / what changed / what I still don't know. |
| `/about` | archive | Fanfiction, plainly. Plus every source with a note on how it is used. |
| `/console` | archive | Model runs. Token-protected, not indexed. |

Five API routes: `/api/trace`, `/api/responses`, `/api/stats`, `/api/export`, `/api/ai`.

### Rooms

The site is one institution with several rooms. A room is a set of CSS custom properties
set on `<body>`; every component reads from them, so a button, a chart or a tag looks native
in the candlelit origin room and on the cold physics bench without being forked. The type
scale, spacing, controls, tags and navigation never change. Colour is semantic —
`evidence` is always the same green, `rupture` always the same crimson.

---

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then http://localhost:3111

```bash
npm test
```

33 assertions in `test/math.test.ts`, run with `tsx`. They cover the statistics against
hand-worked values, the simplex constraint under adversarial input, and dataset integrity —
including that every analogical map edge states its disanalogy and every break edge says
what was cut.

```bash
npm run typecheck && npm run build
```

---

## Configuration

Copy `.env.example` to `.env.local`.

| Variable | If unset |
| --- | --- |
| `DATABASE_URL` | Local runs store responses in `./.data/*.jsonl` (append-only). On a serverless platform, writes are **refused** rather than lost. Set it to use Postgres — Supabase, Neon, RDS. The `pg` driver ships as a dependency; tables are created on first write. |
| `ANTHROPIC_API_KEY` | `/api/ai` returns 501 and the UI says no runs are possible. Nothing is simulated. |
| `AI_MODEL` | Defaults to `claude-sonnet-5`. |
| `RESEARCH_TOKEN` | `/api/export` and model runs refuse every request. There is no open default. |

### Deploying

On Vercel with the GitHub repo connected, so a push to `main` ships.

The filesystem there does not survive a request. Accepting a response, reporting success and
losing it is the exact failure this project is organised against, so `lib/db/index.ts`
detects the platform and refuses: visitors see a notice **before** starting, and a submission
returns 503 with a readable reason. Reads are unaffected — no storage and an empty dataset
look the same to a reader, which is correct.

To start collecting, provision any Postgres and set the connection string. From the CLI this
must run **inside this directory**, since `vercel env` needs the `.vercel` link that lives
here:

```bash
cd "/path/to/philosophy project" && vercel env add DATABASE_URL production
```

Then redeploy. The "not collecting" notice disappears on its own.

---

## Layout

```
app/              14 routes + 4 API routes
components/
  nav/            Chrome (persistent header), Index (the constellation, `I` key)
  ui/             Tag (epistemic apparatus), Recorded (disclosure), primitives, Continue
  experiment/     Entry, BeliefExperiment, SimplexSliders, MachineTrack, AIConsole
  origin/         SameEvidence (the Draco hook), Marginalia (original SVG)
  myth/           IcarusAscent (the vertical climb)
  shape/          ShapeAudit, ScaleBreak
  versions/       CharacterLab
  criteria/       CriteriaTest
  canon/          CounterfactualEngine
  person/         ModelLoop
  physics/        Complementarity
  map/            ConnectionMap
  viz/            trajectories, distributions, dashboard, empty states
data/             scenarios, claims + controls, character, criteria, canon, map, sources
lib/trace-schema  closed per-instrument payload schemas
lib/              stats, simplex, aggregate, validate, session, journey, db adapters
research/         lab.ts (pre-registered), log.ts
test/             math.test.ts
types/            the domain model
```

### Data model

| Entity | Where |
| --- | --- |
| `Scenario`, `Interpretation`, `EvidenceItem` | `types/index.ts`; data in `data/scenarios-*.ts` |
| `ParticipantResponse` | One trajectory: ordered `BeliefStep` distributions + optional confidence |
| `AIResponse` | Same shape plus `model`, `promptVersion`, per-stage rationales |
| `Trace` | Any instrument's interaction: `{sessionId, instrument, payload, durationMs}` |
| `Claim` | `data/claims.ts` — `verdict`, `reasoning`, `wouldChangeIf` |
| `CanonModule`, `CounterfactualPremise` | `data/canon.ts` — each premise carries `resists` |
| `MapNode`, `MapEdge` | `data/connections.ts` — edges declare strength and caveat |

Responses are append-only. An observation is not edited after the fact.

### Export

```bash
curl -H "Authorization: Bearer $RESEARCH_TOKEN" "http://localhost:3111/api/export?kind=responses&format=csv" -o responses.csv
```

`kind` is `responses` or `ai`; `format` is `csv` or `json`. CSV comes out in long format —
one row per response, per stage, per interpretation — which loads into pandas or R without
reshaping.

---

## Statistics

In `lib/stats.ts`, asserted against values worked out by hand.

- **Total variation distance** — movement, and mean pairwise disagreement. Range 0–1.
- **Shannon entropy** — normalised by `log2(n)` so scenarios with different option counts stay
  comparable.
- **KL divergence** — reported only with explicit additive smoothing, because participants
  assign zeroes and the unsmoothed quantity is infinite. Labelled as smoothed wherever shown.
- **Bayes' rule** on a discrete hypothesis space; returns `null` on a zero marginal rather
  than dividing by zero.

No significance tests, and no accuracy scores. The scenarios have no ground truth by
construction, so no proper scoring rule applies. Reporting one would be the most
respectable-looking mistake available here.

---

## Extending it

**A scenario** → `data/scenarios-language.ts`, using the `S()` builder. Three to five
interpretations, at least two evidence items, and a `designNote` per item saying what it was
written to discriminate. Notes are shown only after the participant finishes, so the intent
cannot steer the update it measures. `npm test` enforces shape and minimum prose length.

**An instrument that records** → add a schema *and* an `ALLOWED` key list in
`lib/trace-schema.ts`, then call `recordTrace()` and put a `<Recorded>` disclosure on the
page. An instrument with no schema is refused by the API rather than stored as a blob.

**A claim** → `data/claims.ts`. It needs a `verdict`, `reasoning` readable by someone who
disagrees, and `wouldChangeIf`. A claim that forbids nothing is not a claim. Add its id to
the fixed order in `ShapeAudit.tsx` — controls are interleaved so status cannot be inferred
from position.

**A map edge** → `data/connections.ts`. Declare `structural | analogical | historical | break
| open`. Analogical edges must state their own disanalogy; breaks must say what was cut.
Enforced in tests.

**Hypotheses** in `research/lab.ts` are pre-registered and must not be edited to match
incoming data. Changes go in `research/log.ts` as a dated entry.

---

## Provenance

- **34 language scenarios** — written for this experiment. No real message, email, DM or chat
  log. The reason is on `/ethics`: the person who wrote a message cannot consent to its use,
  and only the recipient would ever be asked.
- **8 myth scenarios** — original paraphrases of Ovid, Homer, Aeschylus, Sophocles, Virgil and
  Hesiod. Public domain, with line references in the sources list.
- **The character in `/versions`** is invented.
- No copyrighted work is quoted or reproduced anywhere. Fanfiction is the origin and the
  method, not the content.

## Privacy

A random identifier in `localStorage`, plus ids and counts from whichever instrument you
finished. No accounts, no email, no IP logging, no analytics, no tracking cookies, and
nothing typed — there is nowhere on the site to type.

The trade-off, stated on `/ethics` rather than buried: anonymity this strong means there is
no way to find and delete an individual response afterwards.

## Accessibility

Real `<input type="range">` elements, so keyboard and screen-reader behaviour is the
platform's rather than reimplemented. Charts carry visually-hidden data tables — a line chart
is not describable in a sentence. Colour is never the only channel; every series is labelled
directly, and the epistemic tags encode status in their *shape* as well as their colour
(open = a box with no right side, abandoned = struck and severed, analogy = two linked
halves). Every fg/muted/faint pairing was checked at 4.5:1 or better against its own room
background. The connection map has a full list view; the Icarus ascent degrades to a static
sky with no scroll dependency. The index traps focus and restores it. `prefers-reduced-motion`
is respected globally in CSS and per-component via `useReducedMotion`.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · d3-scale/shape for
custom charts · `pg` for Postgres · `tsx` for tests. No component library, no chart library,
no analytics.

---

*An investigation, not a conclusion. If a prediction here turns out wrong it stays on the
page marked wrong; if a connection is abandoned it stays on the map drawn as severed.*
