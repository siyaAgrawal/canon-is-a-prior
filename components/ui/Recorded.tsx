import Link from "next/link";

/**
 * What this instrument just wrote down.
 *
 * Shown wherever an instrument records, in the instrument's own words, at the
 * moment it records. An earlier version of these pages said "nothing here is
 * recorded" — true when it was written, false once the dataset was extended, and
 * exactly the kind of stale claim this project has no business making.
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
      {what} Plus a random identifier and how long you took. No name, no account, no IP, no
      analytics — and nothing you typed, because there is nowhere here to type.{" "}
      <Link href="/lab#ethics" className="underline decoration-dotted underline-offset-2">
        All of it, in detail.
      </Link>
    </p>
  );
}
