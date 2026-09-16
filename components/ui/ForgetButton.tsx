"use client";

import { useState } from "react";
import { forgetSession } from "@/lib/session";

/** Clears the anonymous identifier this browser holds. Nothing else exists to clear. */
export function ForgetButton() {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        className="btn"
        onClick={() => {
          forgetSession();
          setDone(true);
        }}
      >
        Clear my session identifier
      </button>
      {done && (
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-evidence" role="status">
          Cleared. A new one is generated if you submit again.
        </span>
      )}
    </div>
  );
}
