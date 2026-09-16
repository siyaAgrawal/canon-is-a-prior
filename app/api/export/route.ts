import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Data export for the project owner.
 *
 * Requires RESEARCH_TOKEN as a bearer token or ?token=. If RESEARCH_TOKEN is not set
 * the route refuses everything rather than defaulting to open, because the dataset
 * would otherwise be downloadable by anyone who guessed the path.
 */
function authorised(req: Request, url: URL): boolean {
  const token = process.env.RESEARCH_TOKEN;
  if (!token) return false;
  const header = req.headers.get("authorization") ?? "";
  if (header === `Bearer ${token}`) return true;
  return url.searchParams.get("token") === token;
}

function csvEscape(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!authorised(req, url)) {
    return NextResponse.json(
      { error: process.env.RESEARCH_TOKEN ? "invalid token" : "RESEARCH_TOKEN is not configured; export is disabled" },
      { status: 401 },
    );
  }

  const format = url.searchParams.get("format") ?? "json";
  const kind = url.searchParams.get("kind") ?? "responses";
  let rows: any[];
  try {
    const store = getStore();
    rows =
      kind === "ai"
        ? await store.listAIResponses()
        : kind === "traces"
          ? await store.listTraces()
          : await store.listResponses();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "storage unavailable" },
      { status: 503 },
    );
  }

  if (format === "json") {
    return new NextResponse(JSON.stringify(rows, null, 2), {
      headers: {
        "content-type": "application/json",
        "content-disposition": `attachment; filename="canon-${kind}-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  }

  if (format !== "csv") return NextResponse.json({ error: "format must be json or csv" }, { status: 400 });

  // Traces are heterogeneous by instrument, so the CSV is long-format with the
  // payload flattened one key per row. Anything nested is JSON-encoded in place
  // rather than dropped.
  if (kind === "traces") {
    const lines = ["trace_id,session_id,instrument,field,value,duration_ms,created_at"];
    for (const t of rows) {
      Object.entries(t.payload ?? {}).forEach(([field, value]) => {
        lines.push(
          [
            t.id,
            t.sessionId,
            t.instrument,
            field,
            typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? ""),
            t.durationMs,
            t.createdAt,
          ]
            .map(csvEscape)
            .join(","),
        );
      });
    }
    return new NextResponse(lines.join("\n"), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="canon-traces-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  // Long format: one row per (response, stage, interpretation). This is the shape that
  // goes straight into pandas or R without reshaping.
  const header = [
    "response_id",
    "session_id",
    "scenario_id",
    "track",
    "stage",
    "evidence_id",
    "interpretation_id",
    "probability",
    "confidence",
    "duration_ms",
    "created_at",
    kind === "ai" ? "model" : "",
    kind === "ai" ? "prompt_version" : "",
  ].filter(Boolean);

  const lines = [header.join(",")];

  for (const r of rows as any[]) {
    r.steps.forEach((step: any, stage: number) => {
      Object.entries(step.distribution).forEach(([interpretationId, probability]) => {
        const row = [
          r.id,
          kind === "ai" ? "" : r.sessionId,
          r.scenarioId,
          kind === "ai" ? "" : r.track,
          stage,
          step.evidenceId ?? "",
          interpretationId,
          probability,
          step.confidence ?? "",
          kind === "ai" ? "" : r.durationMs,
          r.createdAt,
          ...(kind === "ai" ? [r.model, r.promptVersion] : []),
        ];
        lines.push(row.map(csvEscape).join(","));
      });
    });
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="canon-${kind}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
