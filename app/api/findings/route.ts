import { NextResponse } from "next/server";
import { getStoreOrNull, storageStatus } from "@/lib/db";
import { computeFindings } from "@/lib/analysis";

export const dynamic = "force-dynamic";

/**
 * The live conclusions. Computed on every request from whatever is stored, with
 * the decision rule returned alongside each result so the threshold is visibly
 * not chosen after the fact.
 */
export async function GET() {
  const store = getStoreOrNull();
  const [traces, responses, ai] = store
    ? await Promise.all([store.listTraces(), store.listResponses(), store.listAIResponses()])
    : [[], [], []];

  const findings = computeFindings(traces, responses, ai);
  const sessions = new Set([...traces, ...responses].map((r) => r.sessionId)).size;

  return NextResponse.json({
    storage: storageStatus(),
    totals: {
      traces: traces.length,
      responses: responses.length,
      aiRuns: ai.length,
      sessions,
    },
    findings,
    computedAt: new Date().toISOString(),
  });
}
