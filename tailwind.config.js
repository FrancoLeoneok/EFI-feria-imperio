/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Tokens Oficiales Feria Imperio
        terracotta: {
          DEFAULT: "#c85a32",
          50: "#fbf3ef",
          100: "#f5e4dd",
          200: "#ebc9bc",
          300: "#dda592",
          400: "#cc7c63",
          500: "#c85a32",
          600: "#b24c26",
          700: "#9c3e1c",
          800: "#7c3419",
          900: "#652e18",
        },
        forest: {
          DEFAULT: "#2f5233",
          50: "#f2f7f3",
          100: "#e1ede3",
          200: "#c4dbc8",
          300: "#9dc1a3",
          400: "#6fa177",
          500: "#2f5233",
          600: "#254329",
          700: "#1e3621",
          800: "#1a2c1c",
          900: "#162518",
        },
        sand: {
          DEFAULT: "#fbfaf8",
          50: "#ffffff",
          100: "#fbfaf8",
          200: "#f3f1ec",
          300: "#e7e4dc",
          400: "#d5d1c5",
          500: "#b8b2a2",
        },
        charcoal: {
          DEFAULT: "#18181b",
          50: "#f4f4f5",
          100: "#e4e4e7",
          200: "#d4d4d8",
          300: "#a1a1aa",
          400: "#71717a",
          500: "#52525b",
          600: "#3f3f46",
          700: "#27272a",
          800: "#18181b",
          900: "#09090b",
        },

        // Mapeo Semántico Unificado (compatible con el maquetado base)
        primary: {
          DEFAULT: "#c85a32",
          hover: "#b24c26",
          dark: "#9c3e1c",
          container: "#f5e4dd",
          "on-container": "#652e18",
        },
        secondary: {
          DEFAULT: "#2f5233",
          hover: "#254329",
          container: "#e1ede3",
          "on-container": "#162518",
        },
        surface: {
          DEFAULT: "#fbfaf8",
          container: "#f3f1ec",
          "container-low": "#f7f6f3",
          "container-high": "#eae7df",
          dark: "#18181b",
          "dark-card": "#27272a",
          "dark-border": "#3f3f46",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        headline: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 2px 10px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 12px 24px -6px rgba(200, 90, 50, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
