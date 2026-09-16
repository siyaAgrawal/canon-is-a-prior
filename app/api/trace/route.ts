import { NextResponse } from "next/server";
import { getStore, getStoreOrNull, StorageNotConfiguredError } from "@/lib/db";
import { validateTrace, INSTRUMENTS } from "@/lib/trace-schema";
import { validateSessionId } from "@/lib/validate";
import type { Trace } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (!validateSessionId(body?.sessionId)) {
    return NextResponse.json({ error: "invalid sessionId" }, { status: 400 });
  }

  const check = validateTrace(body?.instrument, body?.payload);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });

  const durationMs = Number(body?.durationMs);
  if (!Number.isFinite(durationMs) || durationMs < 0 || durationMs > 1000 * 60 * 60 * 12) {
    return NextResponse.json({ error: "invalid durationMs" }, { status: 400 });
  }

  const trace: Trace = {
    id: `t_${crypto.randomUUID()}`,
    sessionId: body.sessionId,
    instrument: body.instrument,
    payload: check.clean,
    durationMs: Math.round(durationMs),
    createdAt: new Date().toISOString(),
    schema: 1,
  };

  try {
    await getStore().saveTrace(trace);
  } catch (err) {
    const message = err instanceof Error ? err.message : "storage failure";
    const status = err instanceof StorageNotConfiguredError ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ ok: true, id: trace.id }, { status: 201 });
}

/** Counts only. Individual traces are never served to the public. */
export async function GET() {
  const store = getStoreOrNull();
  const traces = store ? await store.listTraces().catch(() => []) : [];
  const byInstrument = Object.fromEntries(
    INSTRUMENTS.map((i) => [i, traces.filter((t) => t.instrument === i).length]),
  );
  return NextResponse.json({
    total: traces.length,
    sessions: new Set(traces.map((t) => t.sessionId)).size,
    byInstrument,
  });
}
