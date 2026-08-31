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
        "primary-fixed": "#dbe1ff",
        "primary-fixed-dim": "#b5c4ff",
        "on-primary-fixed": "#00174d",
        "on-primary-fixed-variant": "#003dab",
        "inverse-primary": "#b5c4ff",

        "secondary": "#515f74",
        "secondary-container": "#d5e3fc",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#57657a",
        "secondary-fixed": "#d5e3fc",
        "secondary-fixed-dim": "#b9c7df",
        "on-secondary-fixed": "#0d1c2e",
        "on-secondary-fixed-variant": "#3a485b",

        "tertiary": "#694100",
        "tertiary-container": "#895600",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ffd6a8",
        "tertiary-fixed": "#ffddb8",
        "tertiary-fixed-dim": "#ffb95f",
        "on-tertiary-fixed": "#2a1700",
        "on-tertiary-fixed-variant": "#653e00",

        "surface": "#f7f9fb",
        "surface-dim": "#d8dadc",
        "surface-bright": "#f7f9fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "surface-variant": "#e0e3e5",
        "surface-tint": "#1353d8",

        "on-surface": "#191c1e",
        "on-surface-variant": "#434654",
        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eff1f3",

        "outline": "#737686",
        "outline-variant": "#c3c5d7",

        "background": "#f7f9fb",
        "on-background": "#191c1e",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "48px",
        "margin-mobile": "16px",
        "container-max": "1280px",
        "gutter": "24px",
        "base": "4px"
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "headline-xl": ["Playfair Display", "Poppins", "serif"],
        "headline-lg": ["Poppins", "sans-serif"],
        "headline-md": ["Poppins", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "label-bold": ["Inter", "sans-serif"],
        "status-badge": ["Inter", "sans-serif"],
      },
      fontSize: {
        "headline-xl": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-bold": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600" }],
        "status-badge": ["12px", { lineHeight: "1", fontWeight: "600" }],
      }
    },
  },
  plugins: [],
}
