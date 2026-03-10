/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0B0E14",
        panel: "rgba(16, 21, 33, 0.7)",
        line: "rgba(148, 163, 184, 0.18)",
        accent: "#6366F1",
        text: "#E6EAF2",
        muted: "#8A95AB",
      },
      boxShadow: {
        glow: "0 0 30px rgba(99, 102, 241, 0.28)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(99,102,241,0.2)" },
          "50%": { boxShadow: "0 0 28px rgba(99,102,241,0.5)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
