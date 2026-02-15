import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#0b0f17",
          900: "#0f1420",
          800: "#151c2c",
          700: "#1b2438"
        },
        neon: {
          400: "#4de3a2",
          500: "#35c789"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(77, 227, 162, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
