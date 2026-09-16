import type { AIResponse, ParticipantResponse } from "@/types";
import type { ExperimentStore } from "./store";

/**
 * Postgres implementation, used when DATABASE_URL is set (Supabase, Neon, RDS, …).
 *
 * `pg` is imported dynamically so the file store keeps working with no database
 * driver installed at all. If DATABASE_URL is set and the driver is missing we fail
 * loudly rather than silently dropping data on the floor.
 */
export class PostgresStore implements ExperimentStore {
  readonly kind = "postgres" as const;
  private pool: any;
  private ready: Promise<void> | null = null;

  constructor(private url: string) {}

  private async pg() {
    if (this.pool) return this.pool;
    let mod: any;
    try {
      // Optional peer dependency. The specifier is a variable so TypeScript does not
      // require the driver's types to be installed, and webpackIgnore keeps the
      // bundler from trying to resolve it at build time.
      const spec = "pg";
      mod = await import(/* webpackIgnore: true */ spec);
    } catch {
      throw new Error(
        "DATABASE_URL is set but the 'pg' driver is not installed. Run `npm i pg` or unset DATABASE_URL to use the file store.",
      );
    }
    const Pool = mod.Pool ?? mod.default?.Pool;
    this.pool = new Pool({
      connectionString: this.url,
      ssl: this.url.includes("localhost") ? undefined : { rejectUnauthorized: false },
      max: 3,
    });
    return this.pool;
  }

  init() {
    if (!this.ready) {
      this.ready = (async () => {
        const pool = await this.pg();
        await pool.query(`
          CREATE TABLE IF NOT EXISTS participant_response (
            id           TEXT PRIMARY KEY,
            session_id   TEXT NOT NULL,
            scenario_id  TEXT NOT NULL,
            track        TEXT NOT NULL,
            steps        JSONB NOT NULL,
            duration_ms  INTEGER NOT NULL,
            schema       INTEGER NOT NULL DEFAULT 1,
            created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
          );
          CREATE INDEX IF NOT EXISTS participant_response_scenario_idx
            ON participant_response (scenario_id);
          CREATE TABLE IF NOT EXISTS ai_response (
            id              TEXT PRIMARY KEY,
            scenario_id     TEXT NOT NULL,
            model           TEXT NOT NULL,
            steps           JSONB NOT NULL,
            rationales      JSONB NOT NULL,
            origin          TEXT NOT NULL,
            prompt_version  TEXT NOT NULL,
            schema          INTEGER NOT NULL DEFAULT 1,
            created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
          );
          CREATE INDEX IF NOT EXISTS ai_response_scenario_idx ON ai_response (scenario_id);
        `);
      })();
    }
    return this.ready;
  }

  async saveResponse(r: ParticipantResponse) {
    await this.init();
    const pool = await this.pg();
    await pool.query(
      `INSERT INTO participant_response (id, session_id, scenario_id, track, steps, duration_ms, schema, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
      [r.id, r.sessionId, r.scenarioId, r.track, JSON.stringify(r.steps), r.durationMs, r.schema, r.createdAt],
    );
  }

  async listResponses(scenarioId?: string): Promise<ParticipantResponse[]> {
    await this.init();
    const pool = await this.pg();
    const res = scenarioId
      ? await pool.query(`SELECT * FROM participant_response WHERE scenario_id = $1 ORDER BY created_at`, [scenarioId])
      : await pool.query(`SELECT * FROM participant_response ORDER BY created_at`);
    return res.rows.map((row: any) => ({
      id: row.id,
      sessionId: row.session_id,
      scenarioId: row.scenario_id,
      track: row.track,
      steps: row.steps,
      durationMs: row.duration_ms,
      schema: row.schema,
      createdAt: new Date(row.created_at).toISOString(),
    }));
  }

  async saveAIResponse(r: AIResponse) {
    await this.init();
    const pool = await this.pg();
    await pool.query(
      `INSERT INTO ai_response (id, scenario_id, model, steps, rationales, origin, prompt_version, schema, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO NOTHING`,
      [r.id, r.scenarioId, r.model, JSON.stringify(r.steps), JSON.stringify(r.rationales), r.origin, r.promptVersion, r.schema, r.createdAt],
    );
  }

  async listAIResponses(scenarioId?: string): Promise<AIResponse[]> {
    await this.init();
    const pool = await this.pg();
    const res = scenarioId
      ? await pool.query(`SELECT * FROM ai_response WHERE scenario_id = $1 ORDER BY created_at`, [scenarioId])
      : await pool.query(`SELECT * FROM ai_response ORDER BY created_at`);
    return res.rows.map((row: any) => ({
      id: row.id,
      scenarioId: row.scenario_id,
      model: row.model,
      steps: row.steps,
      rationales: row.rationales,
      origin: row.origin,
      promptVersion: row.prompt_version,
      schema: row.schema,
      createdAt: new Date(row.created_at).toISOString(),
    }));
  }

  async counts() {
    const [responses, ai] = await Promise.all([this.listResponses(), this.listAIResponses()]);
    return {
      responses: responses.length,
      aiResponses: ai.length,
      sessions: new Set(responses.map((r) => r.sessionId)).size,
    };
  }
}
