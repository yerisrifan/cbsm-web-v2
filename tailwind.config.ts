import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#0a3e28",
        secondary: "#30ac78",
        foreground: "#f2f3f4",
        yellow: "#fcce30",
      },
      fontFamily: {
        arial: ["arial", "sans-serif"],
        arialb: ["arialb", "sans-serif"],
        arialn: ["arialn", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
