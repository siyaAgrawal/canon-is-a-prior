"use client";

/**
 * A small diagram of the operation being performed: one model, one altered premise,
 * a set of consequences that were not individually chosen.
 *
 * Drawn rather than described because the shape is the argument — the fan is what
 * "changing one thing reorganises many things" looks like.
 */
export function PremiseTree({ branches }: { branches: string[] }) {
  const w = 620;
  const h = 210;
  const rootY = 34;
  const leafY = 168;
  const spread = (w - 90) / Math.max(1, branches.length);

  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Diagram: one changed assumption fanning into several interpretive consequences.">
        <text x={w / 2} y={rootY - 12} textAnchor="middle" fontSize={10} className="fill-ink-faint font-mono">
          ORIGINAL MODEL
        </text>
        <rect x={w / 2 - 88} y={rootY} width={176} height={26} fill="none" stroke="rgba(23,24,26,0.35)" />
        <text x={w / 2} y={rootY + 17} textAnchor="middle" fontSize={11} className="fill-ink">
          the inherited reading
        </text>

        <line x1={w / 2} y1={rootY + 26} x2={w / 2} y2={rootY + 52} stroke="#A33B2C" strokeWidth={1.2} />
        <polygon points={`${w / 2 - 3.5},${rootY + 52} ${w / 2 + 3.5},${rootY + 52} ${w / 2},${rootY + 59}`} fill="#A33B2C" />

        <rect x={w / 2 - 88} y={rootY + 62} width={176} height={26} fill="rgba(163,59,44,0.07)" stroke="#A33B2C" />
        <text x={w / 2} y={rootY + 79} textAnchor="middle" fontSize={11} className="fill-rust">
          one premise changed
        </text>

        {branches.map((b, i) => {
          const x = 45 + spread * i + spread / 2;
          const topY = rootY + 88;
          return (
            <g key={b}>
              <path
                d={`M ${w / 2} ${topY} C ${w / 2} ${topY + 26}, ${x} ${leafY - 40}, ${x} ${leafY - 16}`}
                fill="none"
                stroke="rgba(38,58,102,0.45)"
                strokeWidth={1}
              />
              <circle cx={x} cy={leafY - 14} r={2.6} fill="#263A66" />
              <text x={x} y={leafY + 4} textAnchor="middle" fontSize={9.5} className="fill-indigo">
                {b.length > 22 ? `${b.slice(0, 21)}…` : b}
              </text>
            </g>
          );
        })}
        <text x={w / 2} y={h - 6} textAnchor="middle" fontSize={9} className="fill-ink-ghost font-mono">
          none of these was chosen separately
        </text>
      </svg>
    </figure>
  );
}
