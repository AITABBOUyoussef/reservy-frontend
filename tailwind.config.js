/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-variant": "#ffdbcc", "on-error-container": "#93000a", "inverse-surface": "#51230a",
        "on-tertiary-fixed": "#2f1500", "on-tertiary": "#ffffff", "on-primary": "#ffffff",
        "on-surface": "#351000", "on-primary-container": "#dfffb7", "surface-container": "#ffeae1",
        "surface-bright": "#fff8f6", "on-background": "#351000", "on-surface-variant": "#43493a",
        "tertiary-container": "#aa5b00", "on-tertiary-container": "#fff2ea", "inverse-on-surface": "#ffede6",
        "surface-container-highest": "#ffdbcc", "secondary": "#ac3400", "badge-promo": "#FFF7ED",
        "surface-main": "#FEF3C7", "on-primary-fixed": "#0f2000", "error": "#ba1a1a",
        "on-error": "#ffffff", "primary-fixed-dim": "#a0d663", "surface-container-lowest": "#ffffff",
        "on-secondary-container": "#5d1900", "badge-organic-text": "#047857", "primary": "#396200",
        "primary-container": "#4d7c0f", "surface-white": "#FFFFFF", "outline-variant": "#c3c9b5",
        "surface-tint": "#3e6a00", "surface-dim": "#ffd0bc", "on-primary-fixed-variant": "#2e4f00",
        "badge-organic": "#ECFDF5", "tertiary-fixed-dim": "#ffb77d", "border-amber": "#FDE68A",
        "background": "#fff8f6", "secondary-fixed-dim": "#ffb59d", "surface-card": "#FFFBEB",
        "inverse-primary": "#a0d663", "outline": "#737968", "secondary-fixed": "#ffdbd0",
        "error-container": "#ffdad6", "primary-fixed": "#bbf37c", "on-tertiary-fixed-variant": "#6e3900",
        "secondary-container": "#fd6b36", "surface-container-high": "#ffe2d7", "tertiary": "#864700",
        "on-secondary-fixed": "#390c00", "surface-container-low": "#fff1eb", "surface": "#fff8f6",
        "border-subtle": "#E5E7EB", "on-secondary": "#ffffff", "tertiary-fixed": "#ffdcc3",
        "rating-star": "#F59E0B", "on-secondary-fixed-variant": "#832600"
      },
      borderRadius: {
        "DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"
      },
      spacing: {
        "space-xl": "2rem", "space-lg": "1.5rem", "space-2xl": "3rem", "space-sm": "0.75rem",
        "space-3xl": "4.5rem", "gutter-mobile": "1rem", "space-2xs": "0.25rem", "gutter-desktop": "1.5rem",
        "space-xs": "0.5rem", "container-max": "1280px", "space-md": "1rem"
      },
      fontFamily: {
        "headline-sm": ["Plus Jakarta Sans"], "body-md": ["Plus Jakarta Sans"],
        "display-lg": ["Plus Jakarta Sans"], "label-sm": ["Plus Jakarta Sans"],
        "label-md": ["Plus Jakarta Sans"], "headline-xl": ["Plus Jakarta Sans"],
        "headline-lg": ["Plus Jakarta Sans"], "body-lg": ["Plus Jakarta Sans"],
        "label-lg": ["Plus Jakarta Sans"], "display-lg-mobile": ["Plus Jakarta Sans"],
        "headline-xl-mobile": ["Plus Jakarta Sans"], "headline-md": ["Plus Jakarta Sans"],
        "body-sm": ["Plus Jakarta Sans"]
      },
      fontSize: {
        "headline-sm": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "display-lg": ["52px", { lineHeight: "60px", letterSpacing: "-0.03em", fontWeight: "800" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "700" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }],
        "headline-xl": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
        "display-lg-mobile": ["36px", { lineHeight: "42px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-xl-mobile": ["28px", { lineHeight: "34px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }]
      }
    }
  },
  plugins: [],
}