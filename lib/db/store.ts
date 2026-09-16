import type { AIResponse, ParticipantResponse, Trace } from "@/types";

/**
 * Persistence contract for the experiment.
 *
 * Two implementations ship: a file-backed store (default, zero configuration, real
 * data, good for local runs and small deployments with a persistent disk) and a
 * Postgres store (set DATABASE_URL). Both are append-only by design: a participant
 * response is an observation, and observations are not edited after the fact.
 */
export interface ExperimentStore {
  readonly kind: "file" | "postgres" | "blob";
  init(): Promise<void>;
  saveResponse(r: ParticipantResponse): Promise<void>;
  listResponses(scenarioId?: string): Promise<ParticipantResponse[]>;
  saveTrace(t: Trace): Promise<void>;
  listTraces(instrument?: Trace["instrument"]): Promise<Trace[]>;
  saveAIResponse(r: AIResponse): Promise<void>;
  listAIResponses(scenarioId?: string): Promise<AIResponse[]>;
  counts(): Promise<{ responses: number; aiResponses: number; sessions: number }>;
}
