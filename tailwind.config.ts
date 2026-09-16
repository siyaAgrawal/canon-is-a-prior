import type { Config } from "tailwindcss";

/**
 * One institution, many rooms.
 *
 * Colour is not set here per-page. Every surface reads from CSS custom properties
 * that a room sets on a wrapper element (see globals.css). That way a component
 * written once — a button, a tag, a chart — looks native in the candlelit origin
 * room and in the cold physics room without being rewritten or forked.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Room-driven. Resolved at runtime from the active [data-room].
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        accent2: "rgb(var(--accent-2) / <alpha-value>)",

        // Semantic constants. These mean the same thing in every room, which is the
        // point — evidence is always the same green, rupture always the same crimson.
        evidence: "#3E7A5E",
        rupture: "#C2453A",
        sun: "#E0A244",
        cold: "#5B8FA8",
        fiction: "#8B6FA8",
        deep: "#141A2E",
      },
      fontFamily: {
        display: ['"Fraunces"', "Iowan Old Style", "Georgia", "serif"],
        text: ['"Spectral"', "Iowan Old Style", "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        /* Prefixed so they never shadow Tailwind's own text-sm / text-lg, which the
           interface still needs for ordinary small text. */
        d1: ["clamp(3.2rem, 13vw, 11rem)", { lineHeight: "0.86", letterSpacing: "-0.045em" }],
        d2: ["clamp(2.4rem, 7vw, 5rem)", { lineHeight: "0.98", letterSpacing: "-0.035em" }],
        d3: ["clamp(1.8rem, 4.4vw, 3rem)", { lineHeight: "1.08", letterSpacing: "-0.022em" }],
        d4: ["clamp(1.35rem, 2.8vw, 1.9rem)", { lineHeight: "1.22", letterSpacing: "-0.012em" }],
        d5: ["clamp(1.08rem, 1.8vw, 1.28rem)", { lineHeight: "1.4", letterSpacing: "-0.005em" }],
      },
      maxWidth: { measure: "33rem", reading: "41rem", column: "56rem", wide: "78rem" },
      keyframes: {
        rise: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "none" } },
        ignite: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        flicker: {
          "0%,100%": { opacity: "0.86" },
          "18%": { opacity: "1" },
          "42%": { opacity: "0.72" },
          "67%": { opacity: "0.95" },
        },
        sever: { "0%": { strokeDashoffset: "0" }, "100%": { strokeDashoffset: "26" } },
      },
      animation: {
        rise: "rise 0.8s cubic-bezier(0.22,1,0.36,1) both",
        ignite: "ignite 1.4s ease-out both",
        flicker: "flicker 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
