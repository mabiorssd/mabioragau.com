
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "matrix-rain": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "glitch-horizontal": {
          "0%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-2px)" },
          "50%": { transform: "translateX(2px)" },
          "75%": { transform: "translateX(-1px)" },
          "100%": { transform: "translateX(0)" },
        },
        "glitch-vertical": {
          "0%": { transform: "translateY(0)" },
          "25%": { transform: "translateY(-2px)" },
          "50%": { transform: "translateY(2px)" },
          "75%": { transform: "translateY(-1px)" },
          "100%": { transform: "translateY(0)" },
        },
        "text-flicker": {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": { opacity: "0.99" },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": { opacity: "0.4" },
        },
        "scan-lines": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 -100vh" },
        },
        "matrix-shift": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-20px)" },
        },
        "border-pulse": {
          "0%": { boxShadow: "0 0 5px rgba(0, 255, 0, 0.3)" },
          "50%": { boxShadow: "0 0 15px rgba(0, 255, 0, 0.6)" },
          "100%": { boxShadow: "0 0 5px rgba(0, 255, 0, 0.3)" }
        },
        "neon-pulse": {
          "0%": { 
            textShadow: "0 0 5px rgba(0, 255, 0, 0.5), 0 0 10px rgba(0, 255, 0, 0.3)" 
          },
          "50%": { 
            textShadow: "0 0 10px rgba(0, 255, 0, 0.7), 0 0 20px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 255, 0, 0.3)" 
          },
          "100%": { 
            textShadow: "0 0 5px rgba(0, 255, 0, 0.5), 0 0 10px rgba(0, 255, 0, 0.3)" 
          }
        }
      },
      animation: {
        "matrix-rain": "matrix-rain 20s linear infinite",
        "glitch-horizontal": "glitch-horizontal 0.2s ease-in-out infinite",
        "glitch-vertical": "glitch-vertical 0.3s ease-in-out infinite",
        "text-flicker": "text-flicker 3s linear infinite",
        "scan-lines": "scan-lines 1s linear infinite",
        "matrix-shift": "matrix-shift 10s linear infinite",
        "border-pulse": "border-pulse 2s infinite",
        "neon-pulse": "neon-pulse 2s infinite"
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.05) 1px, transparent 1px)",
        "matrix-code": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%2300FF00' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        "cyber-grid": "20px 20px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
