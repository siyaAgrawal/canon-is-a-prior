import { get, list, put } from "@vercel/blob";
import type { AIResponse, ParticipantResponse, Trace } from "@/types";
import type { ExperimentStore } from "./store";

/**
 * Vercel Blob as an append-only research store.
 *
 * Chosen because it is the one durable backend that can be provisioned without a
 * separate account, and because the access model fits: the store is **private**,
 * so rows are reachable only with the project's credentials, never by URL.
 *
 * Shape: one object per row, at `<kind>/<id>.json`. One object per row rather
 * than one appended file because concurrent writes to a single object would race
 * and silently drop responses — which is the failure this project least wants,
 * since a lost response is indistinguishable from a response never given.
 *
 * Reads list the prefix and fetch bodies with bounded concurrency. That is fine
 * into the low thousands; past that the right move is a compaction pass, and the
 * ceiling is noted on the method page rather than discovered later.
 */
export class BlobStore implements ExperimentStore {
  readonly kind = "blob" as const;

  /** Per-invocation cache. Lambdas are short-lived, so this only ever helps. */
  private cache = new Map<string, unknown[]>();

  async init() {
    /* Nothing to create: the store exists or the credentials do not. */
  }

  private async write(prefix: string, id: string, row: unknown) {
    await put(`${prefix}/${id}.json`, JSON.stringify(row), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    this.cache.delete(prefix);
  }

  private async readAll<T>(prefix: string): Promise<T[]> {
    const cached = this.cache.get(prefix);
    if (cached) return cached as T[];

    const paths: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: `${prefix}/`, cursor, limit: 1000 });
      paths.push(...page.blobs.map((b) => b.pathname));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    // Bounded concurrency: a research dataset is small, but an unbounded fan-out
    // of a few thousand fetches will exhaust the runtime's socket pool.
    const out: T[] = [];
    const CONCURRENCY = 24;
    for (let i = 0; i < paths.length; i += CONCURRENCY) {
      const slice = paths.slice(i, i + CONCURRENCY);
      const rows = await Promise.all(
        slice.map(async (pathname) => {
          try {
            // A private store is not readable by URL: the body has to be fetched
            // through the SDK, which authenticates the request. That is the whole
            // reason for choosing private access.
            const blob = await get(pathname, { access: "private" });
            if (!blob || blob.statusCode !== 200 || !blob.stream) return null;
            const text = await new Response(blob.stream).text();
            return JSON.parse(text) as T;
          } catch {
            // One unreadable row must not take down the whole read. It is
            // dropped, so a reported count is a floor rather than a claim.
            return null;
          }
        }),
      );
      rows.forEach((r) => r !== null && out.push(r));
    }

    out.sort((a, b) =>
      String((a as { createdAt?: string }).createdAt ?? "").localeCompare(
        String((b as { createdAt?: string }).createdAt ?? ""),
      ),
    );
    this.cache.set(prefix, out);
    return out;
  }

  saveResponse(r: ParticipantResponse) {
    return this.write("responses", r.id, r);
  }

  async listResponses(scenarioId?: string) {
    const all = await this.readAll<ParticipantResponse>("responses");
    return scenarioId ? all.filter((r) => r.scenarioId === scenarioId) : all;
  }

  saveTrace(t: Trace) {
    return this.write("traces", t.id, t);
  }

  async listTraces(instrument?: Trace["instrument"]) {
    const all = await this.readAll<Trace>("traces");
    return instrument ? all.filter((t) => t.instrument === instrument) : all;
  }

  saveAIResponse(r: AIResponse) {
    return this.write("ai", r.id, r);
  }

  async listAIResponses(scenarioId?: string) {
    const all = await this.readAll<AIResponse>("ai");
    return scenarioId ? all.filter((a) => a.scenarioId === scenarioId) : all;
  }

  async counts() {
    const [responses, ai, traces] = await Promise.all([
      this.listResponses(),
      this.listAIResponses(),
      this.listTraces(),
    ]);
    return {
      responses: responses.length,
      aiResponses: ai.length,
      sessions: new Set([...responses, ...traces].map((r) => r.sessionId)).size,
    };
  }
}

/** True when a Blob store is attached to this deployment. */
export function blobConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL_OIDC_TOKEN,
  );
}
