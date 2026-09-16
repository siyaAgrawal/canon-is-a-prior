"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Route-level error boundary. Says what failed rather than showing a blank page,
 * and always offers a way out that does not depend on the broken route.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="shell py-28">
      <div className="max-w-column">
        <p className="kicker">Something on this page failed</p>
        <h1 className="mt-5 font-display text-d2">That is not supposed to happen.</h1>
        <p className="say mt-6 max-w-measure">
          The rest of the site is unaffected — every page here loads on its own, so nothing is
          blocked by this one.
        </p>
        <p className="mt-6 font-mono text-[0.72rem]" style={{ color: "rgb(var(--faint))" }}>
          {error.message}
          {error.digest ? ` · ${error.digest}` : ""}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button type="button" className="btn" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="btn-quiet">
            Back to the start
          </Link>
        </div>
      </div>
    </div>
  );
}
