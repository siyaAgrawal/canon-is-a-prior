import type { Scenario } from "@/types";
import { mythScenarios } from "./scenarios-myth";
import { languageScenarios } from "./scenarios-language";

export const allScenarios: Scenario[] = [...mythScenarios, ...languageScenarios];

export function getScenario(id: string): Scenario | undefined {
  return allScenarios.find((s) => s.id === id);
}

export function scenariosByTrack(track: Scenario["track"]): Scenario[] {
  return allScenarios.filter((s) => s.track === track);
}

/** The scenario the landing experiment opens with. */
export const OPENING_SCENARIO_ID = "icarus-flight";

export { mythScenarios, languageScenarios };
