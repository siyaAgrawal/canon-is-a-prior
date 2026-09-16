"use client";

import { line as d3line, curveMonotoneX } from "d3-shape";
import { scaleLinear } from "d3-scale";
import type { Distribution, Interpretation } from "@/types";
import { colorAt } from "@/lib/palette";

/**
 * How each interpretation moved, stage by stage.
 *
 * Stage 0 is the prior; every later stage is belief after one more piece of evidence.
 * Drawn with d3 scales and path generators but rendered by React, so there is no
 * imperative DOM mutation to get out of sync with state.
 *
 * Accessibility: the SVG is labelled, and the same numbers are emitted as a real
 * <table> that is visually hidden — a line chart is not describable in one sentence,
 * so the fallback is the data itself.
 */
export function BeliefTrajectory({
  interpretations,
  stages,
  stageLabels,
  height = 240,
}: {
  interpretations: Interpretation[];
  stages: Distribution[];
  stageLabels: string[];
  height?: number;
}) {
  const w = 720;
  const h = height;
  const m = { top: 16, right: 16, bottom: 34, left: 34 };

  const x = scaleLinear()
    .domain([0, Math.max(1, stages.length - 1)])
    .range([m.left, w - m.right]);
  const y = scaleLinear().domain([0, 100]).range([h - m.bottom, m.top]);

  const path = d3line<number>()
    .x((_, i) => x(i))
    .y((v) => y(v))
    .curve(curveMonotoneX);

  /**
   * Series labels sit at each line's final value, which collide whenever two
   * interpretations end level — and ending level is common, since a participant who
   * does not move leaves all of them at the same number. Positions are spread apart
   * here so every label stays readable.
   */
  const labelPositions = (() => {
    const gap = 13;
    const entries = interpretations
      .map((interp, idx) => ({
        idx,
        value: stages[stages.length - 1]?.[interp.id] ?? 0,
      }))
      .sort((a, b) => b.value - a.value);

    const placed: Record<number, number> = {};
    let previous = -Infinity;
    entries.forEach((e) => {
      const wanted = y(e.value) - 8;
      const resolved = Math.max(wanted, previous + gap);
      placed[e.idx] = Math.min(resolved, h - m.bottom - 2);
      previous = placed[e.idx];
    });
    return placed;
  })();

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Belief trajectory across ${stages.length} stages for ${interpretations.length} interpretations.`}
      >
        {[0, 25, 50, 75, 100].map((t) => (
          <g key={t}>
            <line
              x1={m.left}
              x2={w - m.right}
              y1={y(t)}
              y2={y(t)}
              stroke="rgba(23,24,26,0.09)"
              strokeWidth={1}
              strokeDasharray={t === 0 ? undefined : "2 4"}
            />
            <text x={m.left - 8} y={y(t) + 4} textAnchor="end" className="fill-ink-ghost font-mono" fontSize={9}>
              {t}
            </text>
          </g>
        ))}

        {stages.map((_, i) => (
          <g key={i}>
            <line
              x1={x(i)}
              x2={x(i)}
              y1={m.top}
              y2={h - m.bottom}
              stroke={i === 0 ? "rgba(23,24,26,0.18)" : "rgba(23,24,26,0.07)"}
              strokeWidth={1}
            />
            <text
              x={x(i)}
              y={h - m.bottom + 18}
              textAnchor={i === 0 ? "start" : i === stages.length - 1 ? "end" : "middle"}
              className="fill-ink-faint font-mono"
              fontSize={9}
            >
              {stageLabels[i] ?? `stage ${i}`}
            </text>
          </g>
        ))}

        {interpretations.map((interp, idx) => {
          const c = colorAt(idx);
          const values = stages.map((s) => s[interp.id] ?? 0);
          const d = path(values) ?? undefined;
          return (
            <g key={interp.id}>
              <path d={d} fill="none" stroke={c.stroke} strokeWidth={1.75} strokeLinecap="round" />
              {values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 3.4 : 2.4} fill={c.stroke} />
              ))}
              <text
                x={w - m.right}
                y={labelPositions[idx]}
                textAnchor="end"
                fill={c.stroke}
                fontSize={11}
                className="font-sans"
              >
                {interp.label}
              </text>
            </g>
          );
        })}
      </svg>

      <table className="sr-only">
        <caption>Belief trajectory: percentage assigned to each interpretation at each stage.</caption>
        <thead>
          <tr>
            <th scope="col">Interpretation</th>
            {stageLabels.map((l, i) => (
              <th key={i} scope="col">
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {interpretations.map((interp) => (
            <tr key={interp.id}>
              <th scope="row">{interp.label}</th>
              {stages.map((s, i) => (
                <td key={i}>{Math.round(s[interp.id] ?? 0)}%</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
