/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgba(255, 255, 255, 0.09)",
        input: "rgba(255, 255, 255, 0.12)",
        ring: "#50C878",
        background: "#0A0A0A",
        foreground: "#F5F5F5",
        palette: {
          mint: "#D1F2EB",
          emerald: "#50C878",
          forest: "#0B6E4F",
          pine: "#013220",
        },
        surface: {
          DEFAULT: "#171717",
          secondary: "#222222",
          elevated: "#2A2A2A",
        },
        muted: {
          DEFAULT: "#1E1E1E",
          foreground: "#A3A3A3",
        },
        accent: {
          DEFAULT: "#50C878",
          foreground: "#013220",
          mint: "#D1F2EB",
          emerald: "#50C878",
          forest: "#0B6E4F",
          pine: "#013220",
          cyan: "#D1F2EB",
          orange: "#f97316",
          purple: "#a855f7",
        },
        card: {
          DEFAULT: "#171717",
          foreground: "#F5F5F5",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
