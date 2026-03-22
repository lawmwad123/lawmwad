import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5bbfc",
          400: "#8196f8",
          500: "#6371f1",
          600: "#4f52e5",
          700: "#4040ca",
          800: "#3535a3",
          900: "#303082",
          950: "#1e1d4c",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-up":      "fadeUp 0.4s ease-out forwards",
        "fade-in":      "fadeIn 0.3s ease-out forwards",
        "slide-right":  "slideRight 0.35s ease-out forwards",
        "count-up":     "fadeIn 0.6s ease-out forwards",
        "bar-grow":     "barGrow 0.8s ease-out forwards",
        "pulse-dot":    "pulseDot 1.5s ease-in-out infinite",
        "highlight":    "highlight 2s ease-out forwards",
        "dot-wave":     "dotWave 1.4s ease-in-out infinite both",
        "cursor-blink": "cursorBlink 1s step-end infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideRight: {
          "0%":   { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        barGrow: {
          "0%":   { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "0.4", transform: "scale(0.8)" },
          "50%":      { opacity: "1",   transform: "scale(1.2)" },
        },
        highlight: {
          "0%":   { backgroundColor: "rgb(254 249 195)" },
          "100%": { backgroundColor: "transparent" },
        },
        dotWave: {
          "0%, 80%, 100%": { transform: "translateY(0)",    opacity: "0.35" },
          "40%":           { transform: "translateY(-5px)", opacity: "1"    },
        },
        cursorBlink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
