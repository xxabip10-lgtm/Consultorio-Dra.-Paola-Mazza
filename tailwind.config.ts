import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#effcfd",
          100: "#d8f7fa",
          300: "#7de3eb",
          500: "#19b9c9",
          600: "#0c96a7",
          900: "#114552"
        },
        clinic: {
          sky: "#eaf8ff",
          ink: "#14313d",
          mint: "#2ed3b7"
        }
      },
      boxShadow: {
        soft: "0 20px 70px rgba(20, 49, 61, 0.12)",
        glow: "0 18px 45px rgba(25, 185, 201, 0.24)"
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        rise: "rise 0.7s ease-out both"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" }
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
