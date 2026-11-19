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
        opella: {
          forest: "#0d3824",
          deep: "#082417",
          dark: "#05180f",
          emerald: "#145938",
          sand: "#f6f3ed",
          light: "#faf8f5",
          cream: "#fffdf9",
          border: "#e5e0d5",
          sage: "#85a894",
          sageLight: "#e5ede8",
          mint: "#cce4d7",
          coral: "#e25555",
          rose: "#ff6f6f",
          roseLight: "#ffe8e8",
          gold: "#c57d19",
          goldLight: "#fef3c7",
          sky: "#0284c7",
          skyLight: "#e0f2fe",
          purple: "#7c3aed",
          purpleLight: "#f3e8ff",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        cardHover: "0 10px 15px -3px rgba(13, 56, 36, 0.08), 0 4px 6px -2px rgba(13, 56, 36, 0.04)",
        modal: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
