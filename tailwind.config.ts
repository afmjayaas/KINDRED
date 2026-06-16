import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FBF6EE",
          deep: "#DCCBA7",
          dark: "#C9B58C",
        },
        brand: {
          orange: "#E2761C",
          orangeDark: "#B85C12",
          brown: "#5E4026",
          brownDark: "#3F2A18",
        },
      },
      fontFamily: {
        serif: [
          "Georgia",
          "'Iowan Old Style'",
          "'Palatino Linotype'",
          "Palatino",
          "serif",
        ],
        sans: [
          "-apple-system",
          "'Helvetica Neue'",
          "Helvetica",
          "Arial",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(94, 64, 38, 0.25)",
        card: "0 8px 24px -8px rgba(94, 64, 38, 0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s ease-out forwards",
        fadeIn: "fadeIn 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
