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
        "primary": "var(--color-primary)",
        "on-primary": "var(--color-on-primary)",
        "primary-container": "var(--color-primary-container)",
        "on-primary-container": "var(--color-on-primary-container)",
        "primary-fixed": "var(--color-primary-fixed, #6ffbbe)",
        "primary-fixed-dim": "var(--color-primary-fixed-dim, #4edea3)",
        "on-primary-fixed": "var(--color-on-primary-fixed, #002113)",
        "on-primary-fixed-variant": "var(--color-on-primary-fixed-variant, #005236)",
        
        "secondary": "var(--color-secondary)",
        "on-secondary": "var(--color-on-secondary)",
        "secondary-container": "var(--color-secondary-container)",
        "on-secondary-container": "var(--color-on-secondary-container)",
        "secondary-fixed": "var(--color-secondary-fixed, #e1e0ff)",
        "secondary-fixed-dim": "var(--color-secondary-fixed-dim, #c0c1ff)",
        "on-secondary-fixed": "var(--color-on-secondary-fixed, #07006c)",
        "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant, #2f2ebe)",

        "tertiary": "var(--color-tertiary)",
        "on-tertiary": "var(--color-on-tertiary)",
        "tertiary-container": "var(--color-tertiary-container)",
        "on-tertiary-container": "var(--color-on-tertiary-container)",
        "tertiary-fixed": "var(--color-tertiary-fixed, #c4e7ff)",
        "tertiary-fixed-dim": "var(--color-tertiary-fixed-dim, #7bd0ff)",
        "on-tertiary-fixed": "var(--color-on-tertiary-fixed, #001e2c)",
        "on-tertiary-fixed-variant": "var(--color-on-tertiary-fixed-variant, #004c69)",

        "error": "var(--color-error)",
        "on-error": "var(--color-on-error)",
        "error-container": "var(--color-error-container)",
        "on-error-container": "var(--color-on-error-container)",

        "background": "var(--color-background)",
        "on-background": "var(--color-on-background)",

        "surface": "var(--color-surface)",
        "on-surface": "var(--color-on-surface)",
        "surface-variant": "var(--color-surface-variant)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        "surface-dim": "var(--color-surface-dim, #0f131d)",
        "surface-bright": "var(--color-surface-bright, #353944)",
        "inverse-surface": "var(--color-inverse-surface, #dfe2f1)",
        "inverse-on-surface": "var(--color-inverse-on-surface, #2c303b)",
        "surface-tint": "var(--color-surface-tint, #4edea3)",

        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-container": "var(--color-surface-container)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-highest": "var(--color-surface-container-highest)",

        "outline": "var(--color-outline)",
        "outline-variant": "var(--color-outline-variant)",
        
        "forest-dark": "var(--color-forest-dark)",
        "sage-muted": "var(--color-sage-muted)",
        "error-red": "var(--color-error-red)",
        "surface-white": "var(--color-surface-white)",
        "ink-black": "#121212",
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
        "margin-mobile": "16px",
        "gutter": "24px",
        "margin-desktop": "48px",
        "unit": "8px",
        "container-max": "1440px",
        "panel-padding": "32px",
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "40px",
        "2xl": "64px",
      },
      fontFamily: {
        "headline-md": ["Geist", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-lg-mobile": ["Geist", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-sm": ["Geist", "sans-serif"],
        "display-lg": ["Geist", "sans-serif"],
        "label-md": ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "headline-md": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "24px", "letterSpacing": "0", "fontWeight": "400" }],
        "display-lg-mobile": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "body-lg": ["18px", { "lineHeight": "28px", "letterSpacing": "0", "fontWeight": "400" }],
        "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "500" }],
      }
    }
  },
  plugins: [],
}
