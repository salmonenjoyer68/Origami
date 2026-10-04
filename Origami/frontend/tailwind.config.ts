import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        studio: {
          950: "#070709",
          900: "#0e0e12",
          850: "#131318",
          800: "#1a1a22",
          700: "#272732",
          600: "#383847",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "studio-mesh":
          "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(56, 189, 248, 0.08) 0px, transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(129,140,248,0.25), 0 8px 40px -8px rgba(99,102,241,0.45)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 50px -20px rgba(0,0,0,0.7)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 12s linear infinite",
        shimmer: "shimmer 2.5s infinite linear",
        "fade-in": "fade-in 0.35s ease-out both",
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 6s ease-in-out infinite",
        dash: "dash 3.5s ease-in-out infinite alternate",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        dash: {
          "0%": { strokeDashoffset: "600" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
