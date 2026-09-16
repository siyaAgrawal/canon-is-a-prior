"use client";

import { useState } from "react";

/**
 * Five properties a story can have, kept apart.
 *
 * The device here is that "true" is almost always unknown, and the interface refuses
 * to fill it in. That refusal is the argument: the other four properties are things
 * you can assess from where you are standing, and they are routinely mistaken for the
 * fifth one, which you usually cannot.
 */

type Verdict = "yes" | "no" | "partly" | "unknown";

const CRITERIA = [
  { id: "coherent", label: "Coherent", q: "Do the parts hang together without contradicting each other?" },
  { id: "plausible", label: "Plausible", q: "Does it describe people behaving in ways people behave?" },
  { id: "supported", label: "Supported", q: "Does the surviving evidence actually favour it over the alternatives?" },
  { id: "true", label: "True", q: "Is it what was the case?" },
  { id: "useful", label: "Useful", q: "Does holding it let you notice or do something you otherwise couldn't?" },
] as const;

const CLAIMS = [
  {
    id: "hubris",
    claim: "Icarus flew too high because he overrated himself. The story is a warning against pride.",
    verdicts: {
      coherent: "yes",
      plausible: "yes",
      supported: "partly",
      true: "unknown",
      useful: "yes",
    } as Record<string, Verdict>,
    notes: {
      supported:
        "Ovid does not say this. The text gives the ascent, the delight and the fall; pride is supplied by a long tradition of reading, most of it post-classical. It is compatible with the text rather than drawn from it.",
      true: "Icarus is not a person who did or did not have a motive. There is nothing for this column to be about.",
      useful:
        "Extremely. It is memorable, transmissible, and it is why the story survived at all. Usefulness is doing most of the work that people mistake for support.",
    },
  },
  {
    id: "misunderstood",
    claim: "Icarus misjudged the height. There is no moral content; it is an accident.",
    verdicts: {
      coherent: "yes",
      plausible: "yes",
      supported: "no",
      true: "unknown",
      useful: "partly",
    } as Record<string, Verdict>,
    notes: {
      supported:
        "This one the text actively resists. Ovid describes a boy drawn upward by the open sky, not a boy miscalculating. A reading can be perfectly coherent and still be the one the evidence goes against.",
      useful:
        "It makes the story about design and communication rather than character, which is a genuinely productive move — but it buys that by contradicting the source.",
    },
  },
  {
    id: "patroclus",
    claim: "Achilles returns to the war out of grief rather than the demands of honour.",
    verdicts: {
      coherent: "yes",
      plausible: "yes",
      supported: "yes",
      true: "unknown",
      useful: "yes",
    } as Record<string, Verdict>,
    notes: {
      supported:
        "The poem gives real evidence: his first words are about his own absence, not about Hector; he had already said he preferred a long life; and what follows violates the code rather than satisfying it.",
      true:
        "Achilles is a character in a poem. What is true here is a fact about the text, and the text is not univocal — its own first word is 'wrath'.",
    },
  },
  {
    id: "duality",
    claim: "An electron is sometimes a wave and sometimes a particle, depending on how you look at it.",
    verdicts: {
      coherent: "partly",
      plausible: "yes",
      supported: "partly",
      true: "no",
      useful: "yes",
    } as Record<string, Verdict>,
    notes: {
      coherent:
        "Only loosely. 'Sometimes one, sometimes the other' suggests two states it switches between, and the relation V² + D² ≤ 1 says otherwise — you can have partial amounts of both at once.",
      supported:
        "The experiments it points at are real. The description it gives of them is a simplification that goes wrong precisely where the physics is interesting.",
      true:
        "The one row on this page that can be filled in, because here there is a formalism to check against. The popular sentence is not what quantum mechanics says.",
      useful:
        "Genuinely — it gets a beginner to the right neighbourhood. This is the case worth sitting with: a story can be useful, widely repeated, roughly evidence-shaped, and still false.",
    },
  },
];

const VERDICT_STYLE: Record<Verdict, { label: string; className: string }> = {
  yes: { label: "yes", className: "text-moss border-moss/40 bg-moss/[0.07]" },
  partly: { label: "partly", className: "text-gold border-gold/40 bg-gold/[0.07]" },
  no: { label: "no", className: "text-rust border-rust/40 bg-rust/[0.06]" },
  unknown: { label: "unknown", className: "text-ink-ghost border-rule bg-transparent" },
};

export function FiveKinds() {
  const [id, setId] = useState(CLAIMS[0].id);
  const claim = CLAIMS.find((c) => c.id === id)!;

  return (
    <div className="card p-6 sm:p-8">
      <p className="eyebrow">Five things a story can be</p>
      <h3 className="mt-2 font-display text-2xl leading-tight">They are not the same property</h3>

      <div className="mt-6 flex flex-wrap gap-2">
        {CLAIMS.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={c.id === id}
            onClick={() => setId(c.id)}
            className={`border px-3 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.12em] transition-colors ${
              c.id === id ? "border-ink bg-ink text-paper" : "border-rule text-ink-faint hover:border-ink hover:text-ink"
            }`}
          >
            {c.id}
          </button>
        ))}
      </div>

      <p className="mt-6 border-l-2 border-ink/25 pl-4 font-display text-[1.14rem] leading-[1.5]">{claim.claim}</p>

      <ul className="mt-8 space-y-5">
        {CRITERIA.map((crit) => {
          const v = claim.verdicts[crit.id];
          const note = (claim.notes as Record<string, string | undefined>)[crit.id];
          const style = VERDICT_STYLE[v];
          return (
            <li key={crit.id} className="grid gap-2 sm:grid-cols-[7.5rem_1fr] sm:gap-5">
              <div>
                <p className="font-display text-[1.02rem]">{crit.label}</p>
                <span
                  className={`mt-1 inline-block border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] ${style.className}`}
                >
                  {style.label}
                </span>
              </div>
              <div>
                <p className="text-[0.82rem] leading-relaxed text-ink-ghost">{crit.q}</p>
                {note && <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-soft">{note}</p>}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 border-t border-rule-soft pt-5 text-[0.88rem] leading-relaxed text-ink-soft">
        The column that is almost always &ldquo;unknown&rdquo; is the one people think they are
        discussing. Most arguments about interpretation are actually arguments about the third row,
        conducted in the vocabulary of the fourth.
      </p>
    </div>
  );
}
