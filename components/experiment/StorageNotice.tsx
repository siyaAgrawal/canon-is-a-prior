"use client";

import { useEffect, useState } from "react";

/**
 * Tells a participant up front when this deployment cannot collect responses.
 *
 * Finding out after doing the whole experiment would be a worse experience and a worse
 * ethic: someone spending five minutes on a scenario deserves to know beforehand that
 * it will not be recorded. Renders nothing when storage is working, which is the
 * normal case.
 */
export function StorageNotice() {
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        if (!live || !body) return;
        if (body.storage === "none") setNote(body.storageNote ?? "This deployment can't store responses.");
      })
      .catch(() => {
        /* A failed status check is not itself evidence that storage is broken. */
      });
    return () => {
      live = false;
    };
  }, []);

  if (!note) return null;

  return (
    <div role="status" className="mb-8 border-l-2 border-rust bg-rust/[0.04] px-5 py-4">
      <p className="eyebrow text-rust">Not collecting right now</p>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-ink">
        {note} You can still do the experiment and see your own trajectory — nothing about it
        changes — but your response will not be added to the dataset, and the site will say so
        rather than pretending otherwise.
      </p>
    </div>
  );
}
