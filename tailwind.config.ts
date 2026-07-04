import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Overridden (not extended) so no rounded-* utility can produce a curve anywhere in the app.
    borderRadius: {
      none: "0",
      DEFAULT: "0",
      sm: "0",
      md: "0",
      lg: "0",
      xl: "0",
      "2xl": "0",
      "3xl": "0",
      full: "0",
    },
    boxShadow: {
      none: "none",
    },
    extend: {
      colors: {
        paper: "#F5F0E8",
        paper2: "#EDE8DF",
        ink: "#1A1A14",
        ink2: "#3A3A30",
        ink3: "#6A6A5A",
        ink4: "#9A9A8A",
        rule: "#D0C8BA",
        rule2: "#B8B0A0",
        win: "#2D6A4F",
        "win-bg": "#EAF4EE",
        lose: "#C41E1E",
        "lose-bg": "#FAEAEA",
        warn: "#A06010",
        "warn-bg": "#FDF3E3",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        mono: ["var(--font-dm-mono)", "DM Mono", "monospace"],
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
