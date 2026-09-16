"use client";

import type { Instrument } from "@/types";
import { getSessionId } from "./session";

/**
 * Send a completed interaction to the dataset.
 *
 * Fire-and-forget by design: an instrument must never block, stall or show an
 * error because recording failed. The participant came to think about something,
 * not to submit a form. Failures are returned so a caller can show a quiet note
 * if it wants one, and are otherwise swallowed.
 *
 * The one thing this must not do is claim success it did not get — see the 503
 * path, which is what a deployment with no database returns.
 */
export async function recordTrace(
  instrument: Instrument,
  payload: Record<string, unknown>,
  durationMs: number,
): Promise<{ stored: boolean; reason?: string }> {
  try {
    const res = await fetch("/api/trace", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        instrument,
        payload,
        durationMs: Math.max(0, Math.round(durationMs)),
      }),
    });
    if (res.ok) return { stored: true };
    const body = await res.json().catch(() => ({}));
    return { stored: false, reason: body?.error ?? `HTTP ${res.status}` };
  } catch (err) {
    return { stored: false, reason: err instanceof Error ? err.message : "network error" };
  }
}
