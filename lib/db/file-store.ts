import { promises as fs } from "node:fs";
import path from "node:path";
import type { AIResponse, ParticipantResponse, Trace } from "@/types";
import type { ExperimentStore } from "./store";

/**
 * Append-only JSON-lines store under ./.data.
 *
 * Chosen over SQLite so the dataset is trivially inspectable and exportable by hand:
 * one line per observation, and a corrupt line can be removed without losing the rest.
 */
export class FileStore implements ExperimentStore {
  readonly kind = "file" as const;
  private dir: string;

  constructor(dir = process.env.DATA_DIR ?? path.join(process.cwd(), ".data")) {
    this.dir = dir;
  }

  private file(name: string) {
    return path.join(this.dir, name);
  }

  async init() {
    await fs.mkdir(this.dir, { recursive: true });
  }

  private async append(name: string, row: unknown) {
    await this.init();
    await fs.appendFile(this.file(name), JSON.stringify(row) + "\n", "utf8");
  }

  private async readAll<T>(name: string): Promise<T[]> {
    try {
      const raw = await fs.readFile(this.file(name), "utf8");
      return raw
        .split("\n")
        .filter((l) => l.trim().length > 0)
        .map((l) => {
          try {
            return JSON.parse(l) as T;
          } catch {
            return null;
          }
        })
        .filter((v): v is T => v !== null);
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return [];
      throw err;
    }
  }

  saveResponse(r: ParticipantResponse) {
    return this.append("responses.jsonl", r);
  }

  async listResponses(scenarioId?: string) {
    const all = await this.readAll<ParticipantResponse>("responses.jsonl");
    return scenarioId ? all.filter((r) => r.scenarioId === scenarioId) : all;
  }

  saveTrace(t: Trace) {
    return this.append("traces.jsonl", t);
  }

  async listTraces(instrument?: Trace["instrument"]) {
    const all = await this.readAll<Trace>("traces.jsonl");
    return instrument ? all.filter((t) => t.instrument === instrument) : all;
  }

  saveAIResponse(r: AIResponse) {
    return this.append("ai-responses.jsonl", r);
  }

  async listAIResponses(scenarioId?: string) {
    const all = await this.readAll<AIResponse>("ai-responses.jsonl");
    return scenarioId ? all.filter((r) => r.scenarioId === scenarioId) : all;
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
