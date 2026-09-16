import Link from "next/link";

/**
 * What this instrument just wrote down.
 *
 * Shown wherever an instrument records, in the instrument's own words, at the
 * moment it records. This component has now been wrong twice: it once said
 * "nothing here is recorded", and then it said nothing typed was stored. Both
 * were true when written and false after the dataset grew. Keeping the wording
 * in one place is the only reason the second correction took minutes.
 */
export function Recorded({ what }: { what: string }) {
  return (
    <p className="max-w-measure text-[0.8rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
      <span
        className="mr-2 font-mono text-[0.56rem] uppercase tracking-[0.16em]"
        style={{ color: "rgb(var(--accent))" }}
      >
        Recorded
      </span>
      {what} Plus a random identifier and how long you took. No name, no account, no IP address,
      no analytics. Where a box invites you to write, what you write is stored verbatim — that
      field is optional and is labelled at the point of entry.{" "}
      <Link href="/lab#ethics" className="underline decoration-dotted underline-offset-2">
        All of it, in detail.
      </Link>
    </p>
  );
}
