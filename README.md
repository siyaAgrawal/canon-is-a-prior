# The Canon Is a Prior

> How do we decide what a story means when the evidence is incomplete?

**Live:** https://canon-is-a-prior.vercel.app

An open, unfinished experiment on how humans and language models revise interpretations
when evidence changes — and what makes one interpretation more justified than another.

Live pieces:

- **The experiment** — assign probabilities to competing readings of a myth, then revise
  them as evidence arrives. Sliders are constrained to the probability simplex.
- **The counterfactual engine** — change one premise in Icarus or the Iliad and watch which
  other readings have to move with it. Every premise declares what it *cannot* absorb.
- **Humans vs machines** — 34 original ambiguous-communication scenarios given to people and,
  under identical constraints, to a language model.
- **The data** — live from storage, including when storage is empty.
- **The lab** — question, pre-registered hypotheses, method, failures, limitations.
- **The connection map** — the handwritten sheet this started from, with every edge required
  to declare whether it is structural, analogical or historical.

## The rule this project is built around

**No fabricated data, ever.** No invented participant counts, results, accuracy figures,
model performance numbers, significance claims, citations, endorsements or awards. If the
dataset is empty, every page says zero and renders an empty state. If a model API key is not
configured, the comparison says so and shows nothing rather than a simulated run.

The one place stipulated numbers appear is the illustration on the landing page, which is
labelled *Illustration* and says in the interface that the numbers are not measurements.

## Running it

```bash
npm install
npm run dev      # http://localhost:3111
```

```bash
npm test         # statistics, simplex constraint, and data-integrity assertions
npm run typecheck
npm run build
```

## Configuration

Copy `.env.example` to `.env.local`. Everything in it is optional except where noted.

| Variable | Effect if unset |
| --- | --- |
| `DATABASE_URL` | Responses are stored in `./.data/*.jsonl` (append-only JSON lines) when running locally, and refused outright on a serverless platform — see Deploying. Set it to use Postgres (Supabase, Neon, RDS); the `pg` driver ships as a dependency and tables are created on first write. |
| `ANTHROPIC_API_KEY` | The model-evaluation route returns 501 and the UI says no runs are possible. Nothing is simulated. |
| `AI_MODEL` | Defaults to `claude-sonnet-5`. |
| `RESEARCH_TOKEN` | `/api/export` and model runs refuse every request. Required — there is no open default. |

### Deploying

Deployed on Vercel, with the GitHub repository connected, so a push to `main` ships.

On a serverless platform the filesystem does not survive a request. Rather than accept a
response, report success and lose it, the site detects that case and **refuses to store
anything** until `DATABASE_URL` is set: visitors see a notice before starting, and a
submission returns 503 with a readable reason. Reads are unaffected, since no storage and
an empty dataset look the same to a reader.

To start collecting, provision any Postgres (Vercel Storage, Neon, Supabase) and set the
connection string — from the project's Settings → Environment Variables, or from the CLI
**inside this directory**, since `vercel env` needs the `.vercel` link that lives here:

```bash
vercel env add DATABASE_URL production
```

Then redeploy so the new variable is picked up. Tables are created on first write, and the
"not collecting" notice disappears on its own.

## Data model

| Entity | Where |
| --- | --- |
| `Scenario`, `Interpretation`, `EvidenceItem` | `types/index.ts`, data in `data/scenarios-*.ts` |
| `ParticipantResponse` | one trajectory: an ordered list of `BeliefStep` distributions |
| `AIResponse` | the same shape plus `model`, `promptVersion` and per-stage rationales |
| `CanonModule`, `CounterfactualPremise` | `data/canon.ts` |

Responses are append-only. An observation is not edited after the fact.

### Export

```bash
curl -H "Authorization: Bearer $RESEARCH_TOKEN" \
  "http://localhost:3111/api/export?kind=responses&format=csv" -o responses.csv
```

`kind` is `responses` or `ai`; `format` is `csv` or `json`. CSV comes out in long format —
one row per response, per stage, per interpretation — which loads into pandas or R unreshaped.

## Layout

```
app/            routes; 12 journey chapters plus log, sources, about, ethics, console
  api/          responses, stats, export, ai
components/     ui/ viz/ experiment/ canon/ physics/ map/ philosophy/
data/           42 scenarios, canon modules, connection map, sources
lib/            stats, simplex, aggregate, validate, session, db adapters
research/       lab content and the researcher's log
test/           assertions on the numerical core and the dataset
types/          the domain model
```

## Statistics

Implemented in `lib/stats.ts`, asserted in `test/math.test.ts` against hand-worked values.

- **Total variation distance** — movement and pairwise disagreement. Range 0–1.
- **Shannon entropy**, normalised by `log2(n)` so scenarios with different option counts compare.
- **KL divergence** — reported only with explicit additive smoothing, because participants
  assign zeroes and the unsmoothed quantity would be infinite. Labelled as smoothed everywhere
  it appears.
- **Bayes' rule** on a discrete hypothesis space; returns `null` on a zero marginal rather
  than dividing by zero.

No significance tests, and no accuracy scores. The scenarios have no ground truth by
construction, so no proper scoring rule applies.

## Content provenance

- 34 language scenarios: written for this experiment. No real message, email, DM or chat log.
- 8 myth scenarios: our own paraphrases of Ovid, Homer, Aeschylus, Sophocles, Virgil and
  Hesiod — public domain, with line references on the sources page.
- No modern retelling is quoted or summarised.

## Privacy

A random session identifier in `localStorage`, the scenario id, the distributions, optional
confidence, and elapsed time. No accounts, no email, no IP logging, no analytics, no tracking
cookies. See `/ethics`, which also states the trade-off: anonymity this strong means there is
no way to find and delete an individual response afterwards.

## Accessibility

Real `<input type="range">` elements so keyboard and screen-reader behaviour is the
platform's. Charts carry visually-hidden data tables rather than a one-line summary. Colour
is never the only channel — every series is labelled directly. `prefers-reduced-motion` is
respected globally in CSS and per-component through `useReducedMotion`.
