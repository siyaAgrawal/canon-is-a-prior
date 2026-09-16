import type { AIResponse, ParticipantResponse } from "@/types";

/**
 * Persistence contract for the experiment.
 *
 * Two implementations ship: a file-backed store (default, zero configuration, real
 * data, good for local runs and small deployments with a persistent disk) and a
 * Postgres store (set DATABASE_URL). Both are append-only by design: a participant
 * response is an observation, and observations are not edited after the fact.
 */
export interface ExperimentStore {
  readonly kind: "file" | "postgres";
  init(): Promise<void>;
  saveResponse(r: ParticipantResponse): Promise<void>;
  listResponses(scenarioId?: string): Promise<ParticipantResponse[]>;
  saveAIResponse(r: AIResponse): Promise<void>;
  listAIResponses(scenarioId?: string): Promise<AIResponse[]>;
  counts(): Promise<{ responses: number; aiResponses: number; sessions: number }>;
}
