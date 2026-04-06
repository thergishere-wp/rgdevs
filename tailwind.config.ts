import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-secondary": "var(--color-bg-secondary)",
        card: "var(--color-card)",
        blue: "var(--color-blue)",
        "blue-light": "var(--color-blue-light)",
        offwhite: "var(--color-text-secondary)",
        border: "var(--color-border)",
        "border-subtle": "var(--color-border-subtle)",
        surface: "var(--color-surface)",
        sidebar: "var(--color-sidebar)",
        "sidebar-border": "var(--color-sidebar-border)",
        text: "var(--color-text)",
        "text-secondary": "var(--color-text-secondary)",
      },
      fontFamily: {
        anton: ["Anton", "sans-serif"],
        mono: ["DM Mono", "monospace"],
        barlow: ["Barlow", "sans-serif"],
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
