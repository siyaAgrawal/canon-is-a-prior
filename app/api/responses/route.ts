import { NextResponse } from "next/server";
import { getStore, getStoreOrNull, storageStatus, StorageNotConfiguredError } from "@/lib/db";
import { getScenario } from "@/data";
import { validateSteps, validateSessionId } from "@/lib/validate";
import { aggregateScenario } from "@/lib/aggregate";
import { MIN_N_FOR_AGGREGATE } from "@/lib/constants";
import type { ParticipantResponse } from "@/types";

export const dynamic = "force-dynamic";



export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const scenario = getScenario(body?.scenarioId);
  if (!scenario) return NextResponse.json({ error: "unknown scenarioId" }, { status: 400 });

  if (!validateSessionId(body?.sessionId)) {
    return NextResponse.json({ error: "invalid sessionId" }, { status: 400 });
  }

  const validated = validateSteps(scenario, body?.steps);
  if (!validated.ok) return NextResponse.json({ error: validated.error }, { status: 400 });

  const durationMs = Number(body?.durationMs);
  if (!Number.isFinite(durationMs) || durationMs < 0 || durationMs > 1000 * 60 * 60 * 12) {
    return NextResponse.json({ error: "invalid durationMs" }, { status: 400 });
  }

  const response: ParticipantResponse = {
    id: `r_${crypto.randomUUID()}`,
    sessionId: body.sessionId,
    scenarioId: scenario.id,
    track: scenario.track,
    steps: validated.steps,
    durationMs: Math.round(durationMs),
    createdAt: new Date().toISOString(),
    schema: 1,
  };

  try {
    const store = getStore();
    await store.saveResponse(response);
  } catch (err) {
    // Say what actually happened. A response the participant believes was recorded
    // and which was not is worse than an error message.
    const message = err instanceof Error ? err.message : "storage failure";
    const status = err instanceof StorageNotConfiguredError ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ ok: true, id: response.id }, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scenarioId = searchParams.get("scenario");
  if (!scenarioId) return NextResponse.json({ error: "scenario query parameter required" }, { status: 400 });

  const scenario = getScenario(scenarioId);
  if (!scenario) return NextResponse.json({ error: "unknown scenario" }, { status: 404 });

  try {
    const store = getStoreOrNull();
    if (!store) {
      // No storage means no responses, which is what an empty dataset looks like too.
      return NextResponse.json({
        scenarioId,
        n: 0,
        threshold: MIN_N_FOR_AGGREGATE,
        ready: false,
        aggregate: null,
        storage: storageStatus(),
      });
    }
    const responses = await store.listResponses(scenarioId);
    const agg = aggregateScenario(scenario, responses);

    if (agg.n < MIN_N_FOR_AGGREGATE) {
      return NextResponse.json({
        scenarioId,
        n: agg.n,
        threshold: MIN_N_FOR_AGGREGATE,
        ready: false,
        aggregate: null,
      });
    }

    // Individual response values are never returned — only the summary statistics.
    return NextResponse.json({
      scenarioId,
      n: agg.n,
      threshold: MIN_N_FOR_AGGREGATE,
      ready: true,
      aggregate: {
        ...agg,
        stages: agg.stages.map((s) => ({
          evidenceId: s.evidenceId,
          cells: s.cells.map(({ interpretationId, mean, median }) => ({ interpretationId, mean, median })),
        })),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "storage failure";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
