import { NextResponse } from "next/server";
import { getStoreOrNull, storageStatus } from "@/lib/db";
import { allScenarios } from "@/data";
import { aggregateScenario } from "@/lib/aggregate";
import { MIN_N_FOR_AGGREGATE } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Dataset-wide summary for the dashboard.
 *
 * Every number here is computed from stored responses. When there are none, the
 * counts are zero and the arrays are empty — the client renders empty states from
 * that rather than being handed anything to draw.
 */
export async function GET() {
  try {
    const store = getStoreOrNull();
    const [responses, aiResponses, traces] = store
      ? await Promise.all([store.listResponses(), store.listAIResponses(), store.listTraces()])
      : [[], [], []];

    const perScenario = allScenarios
      .map((s) => {
        const agg = aggregateScenario(s, responses.filter((r) => r.scenarioId === s.id));
        return {
          scenarioId: s.id,
          title: s.title,
          track: s.track,
          n: agg.n,
          ready: agg.n >= MIN_N_FOR_AGGREGATE,
          disagreement: agg.n >= MIN_N_FOR_AGGREGATE ? agg.disagreement : null,
          updateMagnitude: agg.n >= MIN_N_FOR_AGGREGATE ? agg.updateMagnitude : null,
          aiRuns: aiResponses.filter((a) => a.scenarioId === s.id).length,
        };
      })
      .sort((a, b) => b.n - a.n);

    return NextResponse.json({
      storage: store?.kind ?? "none",
      storageNote: storageStatus().reason ?? null,
      storageDetail: storageStatus().detail ?? null,
      threshold: MIN_N_FOR_AGGREGATE,
      totals: {
        /**
         * Two different things, kept apart on purpose. `responses` counts only
         * scenario distributions, because the per-scenario charts cannot be drawn
         * without them. `traces` counts every other instrument. An earlier version
         * reported only the first and therefore called a dataset with real sessions
         * in it empty.
         */
        responses: responses.length,
        traces: traces.length,
        allResponses: responses.length + traces.length,
        sessions: new Set([...responses, ...traces].map((r) => r.sessionId)).size,
        scenariosAttempted: new Set(responses.map((r) => r.scenarioId)).size,
        scenariosTotal: allScenarios.length,
        aiResponses: aiResponses.length,
        aiModels: Array.from(new Set(aiResponses.map((a) => a.model))),
        // Drawn from every instrument, not just distributions — the same conflation
        // that made the dashboard report an empty dataset.
        firstResponseAt:
          [...responses, ...traces].map((r) => r.createdAt).sort()[0] ?? null,
        lastResponseAt:
          [...responses, ...traces].map((r) => r.createdAt).sort().slice(-1)[0] ?? null,
      },
      perScenario,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "storage failure";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
