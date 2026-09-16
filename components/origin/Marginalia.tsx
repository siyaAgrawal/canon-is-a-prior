"use client";

/**
 * Original visual material for the origin room.
 *
 * A page with a line crossed out and rewritten in the margin — which is what a
 * retelling is, done to a whole book. Drawn rather than photographed so nothing
 * is borrowed from anyone, and so it stays sharp at any size and costs nothing
 * to load.
 */
export function Marginalia() {
  return (
    <figure className="relative">
      <svg
        viewBox="0 0 420 300"
        className="h-auto w-full"
        role="img"
        aria-label="A drawn manuscript page. One line is struck through in red and rewritten in the margin; the lines around it are unchanged."
      >
        <defs>
          <linearGradient id="candle" x1="0.2" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#E0A244" stopOpacity="0.16" />
            <stop offset="60%" stopColor="#E0A244" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#E0A244" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="28" y="16" width="268" height="268" fill="#F2EADA" opacity="0.055" />
        <rect x="28" y="16" width="268" height="268" fill="none" stroke="#E2DCD2" strokeOpacity="0.16" />
        <rect x="28" y="16" width="268" height="268" fill="url(#candle)" />

        {/* Body text as ruled strokes: legible as text, not readable as anyone's words. */}
        {Array.from({ length: 13 }).map((_, i) => {
          const y = 44 + i * 18;
          const struck = i === 6;
          const w = [212, 236, 198, 224, 240, 206, 228, 188, 232, 214, 240, 196, 158][i];
          return (
            <g key={i}>
              <rect
                x="48"
                y={y}
                width={w}
                height="3"
                rx="1.5"
                fill="#E8E2D6"
                opacity={struck ? 0.4 : 0.22}
              />
              {struck && (
                <>
                  <path
                    d={`M46 ${y + 1.5} L${48 + w + 4} ${y + 1.5}`}
                    stroke="#C2453A"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M${48 + w + 8} ${y + 2} C ${48 + w + 30} ${y - 6}, 320 ${y - 22}, 332 ${y - 30}`}
                    stroke="#C2453A"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.65"
                  />
                </>
              )}
            </g>
          );
        })}

        {/* The margin, where the assumption gets replaced. */}
        <g>
          <text x="328" y="96" fill="#E0A244" fontSize="11" fontFamily="ui-monospace, monospace" opacity="0.9">
            what if
          </text>
          <text x="328" y="112" fill="#E0A244" fontSize="11" fontFamily="ui-monospace, monospace" opacity="0.9">
            he was
          </text>
          <text x="328" y="128" fill="#E0A244" fontSize="11" fontFamily="ui-monospace, monospace" opacity="0.9">
            afraid
          </text>
          <path d="M328 138 L384 138" stroke="#E0A244" strokeWidth="1" opacity="0.5" />
        </g>

        {/* Candle. The light source that makes the room what it is. */}
        <g opacity="0.9">
          <rect x="340" y="212" width="12" height="52" fill="#E8E2D6" opacity="0.15" />
          <ellipse cx="346" cy="206" rx="4.5" ry="9" fill="#F2C368" opacity="0.85" />
          <ellipse cx="346" cy="208" rx="2" ry="5" fill="#FFF3D0" />
          <circle cx="346" cy="206" r="34" fill="#E0A244" opacity="0.07" />
        </g>
      </svg>
    </figure>
  );
}
