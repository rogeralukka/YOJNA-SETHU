/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#003fb1",
        "primary-container": "#1a56db",
        "on-primary": "#ffffff",
        "on-primary-container": "#d4dcff",

        // AEGIS 3-Tier Obsidian Palette
        obsidian: {
          canvas: "#08090A",
          card: "#0F1115",
          well: "#16191F",
          wellHover: "#1D212A",
          border: "rgba(255, 255, 255, 0.08)",
          textPrimary: "#EDEDED",
          textSecondary: "#8A8F98"
        },

        // Layered Elevation Color System (Obsidian Standard)
        "canvas-light": "#e9ece6",
        "canvas-dark": "#08090A",
        "nav-light": "#ffffff",
        "nav-dark": "#0F1115",
        "card-light": "#ffffff",
        "card-dark": "#0F1115",
        "card-dark-alt": "#16191F",

        // Surface & Container tokens mapped to Obsidian in Dark
        "surface": "#e9ece6",
        "surface-dim": "#d9ded6",
        "surface-bright": "#f8fcf4",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f5ee",
        "surface-container": "#ecefe8",
        "surface-container-high": "#e6eae2",
        "surface-container-highest": "#e0e4dc",
        "on-surface": "#191c1e",
        "on-surface-variant": "#43474e",
        "outline": "#73777f",
        "outline-variant": "#c3c7d0",

        // Slate spectrum mapped strictly to true neutral obsidian
        slate: {
          950: "#08090A",
          900: "#0F1115",
          850: "#13161C",
          800: "#16191F",
          700: "#1D212A",
          600: "#4B5563",
          500: "#8A8F98",
          400: "#8A8F98",
          300: "#CBD5E1",
          200: "#E2E8F0",
          100: "#F1F5F9",
          50: "#F8FAFC",
        }
      },
      boxShadow: {
        "elevation-card": "0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        "elevation-nav": "0 2px 10px rgba(0, 0, 0, 0.05)",
        "elevation-dark": "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      fontFamily: {
        "sans": ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        "mono": ["JetBrains Mono", "SF Mono", "Menlo", "Monaco", "Consolas", "monospace"],
        "headline-xl": ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        "headline-lg": ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        "headline-md": ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        "body-lg": ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        "body-md": ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        "body-sm": ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      }
    },
  },
  plugins: [],
}
