import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sora)", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        canvas: "#05060a",
        "canvas-muted": "#0f1118",
        accent: "#9ef0ff",
        "accent-soft": "#d9f8ff",
        "text-primary": "#f4f7fb",
        "text-muted": "#a0a8c0"
      },
      backgroundImage: {
        "radial-grid": "radial-gradient(circle at 20% 20%, rgba(102,153,255,0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(122,255,214,0.15), transparent 35%)"
      }
    }
  },
  plugins: []
};

export default config;
