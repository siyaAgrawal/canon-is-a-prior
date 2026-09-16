import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./experiments/**/*.{ts,tsx}",
    "./research/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#F7F4ED", raised: "#FCFAF5", sunk: "#EFEADF" },
        /* Every value below clears WCAG AA (4.5:1) against #F7F4ED, checked rather than
           eyeballed: ink 16.2, soft 10.1, faint 6.1, ghost 4.5. The greys were lighter in
           the first pass and the two faintest failed. */
        ink: { DEFAULT: "#17181A", soft: "#3A3C41", faint: "#5A5C62", ghost: "#6E7076" },
        rust: { DEFAULT: "#A33B2C", soft: "#C4705F" },
        indigo: { DEFAULT: "#263A66", soft: "#5C6E99" },
        gold: { DEFAULT: "#8A6620", soft: "#D3B675" }, // 4.8:1; the old #A9812F was 3.3:1
        moss: { DEFAULT: "#4A6146" },
        rule: "rgba(23,24,26,0.14)",
        "rule-soft": "rgba(23,24,26,0.07)",
      },
      fontFamily: {
        display: ['"Spectral"', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        hand: ['"Caveat"', 'Bradley Hand', 'Segoe Script', 'cursive'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 9vw, 6.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-l": ["clamp(2rem, 6vw, 3.75rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-m": ["clamp(1.55rem, 4vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
      },
      maxWidth: { measure: "34rem", wide: "72rem", reading: "44rem" },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "none" } },
        "draw": { "0%": { strokeDashoffset: "1" }, "100%": { strokeDashoffset: "0" } },
        "pulse-soft": { "0%,100%": { opacity: "0.55" }, "50%": { opacity: "1" } },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "pulse-soft": "pulse-soft 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
