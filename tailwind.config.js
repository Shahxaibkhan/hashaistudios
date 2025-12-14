const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
          lg: "2rem"
        }
      },
      fontFamily: {
        sans: ["var(--font-space)", "var(--font-sora)", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        base: "#03040b",
        "base-muted": "#080c16",
        surface: "#0f1628",
        "surface-soft": "#192033",
        neon: "#7df9ff",
        "neon-soft": "#d0f7ff",
        "iris": "#8b8bff",
        "text-primary": "#f8fbff",
        "text-muted": "#9aa2c4",
        line: "rgba(255,255,255,0.08)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 20% 20%, rgba(116,156,255,0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(125,249,255,0.15), transparent 35%)",
        "mesh-glow":
          "radial-gradient(circle at 10% 20%, rgba(141,120,255,0.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(125,249,255,0.25), transparent 45%)"
      },
      boxShadow: {
        glow: "0 20px 120px rgba(125,249,255,0.25)",
        card: "0 30px 80px rgba(3,4,11,0.45)"
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem"
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: 0.8, transform: "translateY(0px)" },
          "50%": { opacity: 1, transform: "translateY(-8px)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        }
      },
      animation: {
        "pulse-soft": "pulse-soft 8s ease-in-out infinite",
        float: "float 10s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
