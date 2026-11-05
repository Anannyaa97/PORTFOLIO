/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcf4",
          100: "#d6f7e4",
          200: "#b0eed0",
          300: "#7ae0b4",
          400: "#50c878", // Signature Emerald from Portfolio
          500: "#1db25d",
          600: "#108f47",
          700: "#0b6e4f", // Deep Forest Green
          800: "#0b5840",
          900: "#094835",
          950: "#013220", // Ultra dark green
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
