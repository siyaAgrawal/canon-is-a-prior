import { NextResponse } from "next/server";
import { getStore, getStoreOrNull, storageStatus } from "@/lib/db";
import { getScenario } from "@/data";
import { defaultModel, isAIConfigured, runScenario, PROMPT_VERSION } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * Two ways to run a model, with different gates.
 *
 * Using the deployment's own key costs the project money, so that path needs the
 * research token. Supplying your own key costs the project nothing, so that path
 * is open — anyone with an Anthropic key can contribute runs to the dataset
 * without the owner being involved at all.
 *
 * The open path is not a general proxy to the model API. Prompts are built
 * server-side from a fixed template and a fixed scenario, nothing from the
 * request reaches the prompt, replies are parsed into a schema before storage,
 * and the batch is capped. There is no input through which arbitrary text could
 * be sent to the model.
 */
function hasToken(req: Request): boolean {
  const token = process.env.RESEARCH_TOKEN;
  if (!token) return false;
  return (req.headers.get("authorization") ?? "") === `Bearer ${token}`;
}

/** Batch cap for runs on a visitor's own key. Their money, but not unbounded. */
const BYO_BATCH_CAP = 6;

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
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  /**
   * A key may travel with the request so runs can happen without a redeploy. It
   * is used for this call only: never stored, never attached to the response row,
   * and scrubbed out of upstream error text.
   */
  const overrideKey = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";
  const withToken = hasToken(req);

  // Without your own key you are spending the project's, which needs the token.
  if (!overrideKey && !withToken) {
    return NextResponse.json(
      {
        error:
          "Runs on this deployment's key need the research token. To contribute a run without it, supply your own model API key — it is used for the request and never stored.",
      },
      { status: 401 },
    );
  }

  if (!isAIConfigured() && !overrideKey) {
    return NextResponse.json(
      {
        error:
          "No model API key available — none configured on this deployment and none supplied with the request. Nothing has been stored, and no simulated result is returned.",
      },
      { status: 501 },
    );
  }

  const scenario = getScenario(body?.scenarioId);
  if (!scenario && !Array.isArray(body?.scenarioIds)) {
    return NextResponse.json({ error: "unknown scenarioId" }, { status: 400 });
  }

  const model = typeof body?.model === "string" && body.model.trim() ? body.model.trim() : defaultModel();

  // Optional batch: run several scenarios in one request, so a session's worth of
  // runs does not need one click each.
  const requested = Array.isArray(body?.scenarioIds)
    ? body.scenarioIds
        .map((id: unknown) => getScenario(String(id)))
        .filter((s: unknown): s is NonNullable<typeof scenario> => Boolean(s))
    : [scenario];
  const batch = withToken ? requested : requested.slice(0, BYO_BATCH_CAP);

  try {
    const store = getStore();
    const done: string[] = [];
    for (const s of batch) {
      const result = await runScenario(s, model, overrideKey || undefined);
      await store.saveAIResponse(result);
      done.push(result.id);
    }
    return NextResponse.json({ ok: true, ran: done.length, ids: done }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "model run failed";
    // Failed runs are reported, not retried silently and not partially stored.
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
