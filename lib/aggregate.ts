import type { AggregateCell, Distribution, ParticipantResponse, Scenario, ScenarioAggregate } from "@/types";
import { mean, meanPairwiseDisagreement, median, totalVariation } from "./stats";

/**
 * Turn raw responses into the numbers the dashboard displays.
 *
 * Responses whose stage count does not match the scenario are excluded rather than
 * padded — a partial trajectory is not a short trajectory, and silently filling the
 * gap would invent data.
 */
export function aggregateScenario(scenario: Scenario, responses: ParticipantResponse[]): ScenarioAggregate {
  const expectedStages = scenario.evidence.length + 1;
  const usable = responses.filter((r) => r.steps.length === expectedStages);

  const stages = Array.from({ length: expectedStages }, (_, stage) => {
    const dists = usable.map((r) => r.steps[stage].distribution);
    const cells: AggregateCell[] = scenario.interpretations.map((interp) => {
      const values = dists.map((d) => d[interp.id] ?? 0);
      return {
        interpretationId: interp.id,
        mean: mean(values) ?? 0,
        median: median(values) ?? 0,
        values,
      };
    });
    return { evidenceId: stage === 0 ? null : scenario.evidence[stage - 1].id, cells };
  });

  const disagreement = Array.from({ length: expectedStages }, (_, stage) => {
    const dists = usable.map((r) => r.steps[stage].distribution);
    return meanPairwiseDisagreement(dists) ?? 0;
  });

  const updateMagnitude = scenario.evidence.map((e, i) => {
    const moves = usable.map((r) => totalVariation(r.steps[i].distribution, r.steps[i + 1].distribution));
    return { evidenceId: e.id, mean: mean(moves) ?? 0, median: median(moves) ?? 0 };
  });

  return { scenarioId: scenario.id, n: usable.length, stages, disagreement, updateMagnitude };
}

/** The mean distribution at a stage, as percentages. Null when there is nothing to average. */
export function stageMean(agg: ScenarioAggregate, stage: number): Distribution | null {
  if (agg.n === 0 || !agg.stages[stage]) return null;
  return Object.fromEntries(agg.stages[stage].cells.map((c) => [c.interpretationId, c.mean]));
}
