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
        bg: "#060608",
        card: "#0C0C10",
        blue: "#0055FF",
        "blue-light": "#4488FF",
        offwhite: "rgba(255,255,255,0.6)",
        border: "rgba(255,255,255,0.12)",
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
