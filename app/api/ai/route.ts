import { NextResponse } from "next/server";
import { getStore, getStoreOrNull, storageStatus } from "@/lib/db";
import { getScenario } from "@/data";
import { defaultModel, isAIConfigured, runScenario, PROMPT_VERSION } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Running a model costs money, so this route requires the same token as data export. */
function authorised(req: Request): boolean {
  const token = process.env.RESEARCH_TOKEN;
  if (!token) return false;
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${token}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scenarioId = searchParams.get("scenario");
  const store = getStoreOrNull();
  const ai = store ? await store.listAIResponses().catch(() => []) : [];

  if (scenarioId) {
    // Model outputs are not personal data, so they are returned in full — including
    // the model's own reasoning, which is the most interesting part to read.
    return NextResponse.json({
      configured: isAIConfigured(),
      scenarioId,
      runs: ai.filter((a) => a.scenarioId === scenarioId),
    });
  }

  return NextResponse.json({
    configured: isAIConfigured(),
    tokenRequired: true,
    tokenConfigured: Boolean(process.env.RESEARCH_TOKEN),
    model: defaultModel(),
    promptVersion: PROMPT_VERSION,
    stored: ai.length,
    storage: storageStatus(),
    models: Array.from(new Set(ai.map((a) => a.model))),
    promptVersions: Array.from(new Set(ai.map((a) => a.promptVersion))),
  });
}

export async function POST(req: Request) {
  if (!authorised(req)) {
    return NextResponse.json(
      { error: "Not authorised. Set RESEARCH_TOKEN and send it as a bearer token." },
      { status: 401 },
    );
  }

  if (!isAIConfigured()) {
    return NextResponse.json(
      {
        error:
          "No model API key is configured on this deployment, so no model run can be performed. Nothing has been stored, and no simulated result is returned.",
      },
      { status: 501 },
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const scenario = getScenario(body?.scenarioId);
  if (!scenario) return NextResponse.json({ error: "unknown scenarioId" }, { status: 400 });

  const model = typeof body?.model === "string" && body.model.trim() ? body.model.trim() : defaultModel();

  try {
    const result = await runScenario(scenario, model);
    await getStore().saveAIResponse(result);
    return NextResponse.json({ ok: true, response: result }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "model run failed";
    // Failed runs are reported, not retried silently and not partially stored.
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
