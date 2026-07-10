import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System v2 — chunky tactile board-game palette.
        primary: { DEFAULT: "#4F46E5", dark: "#3730A3", light: "#E0E7FF" },
        secondary: { DEFAULT: "#10B981", dark: "#047857", light: "#D1FAE5" },
        tertiary: { DEFAULT: "#A54100", dark: "#7C3000", light: "#FFEDD5" },
        warning: { DEFAULT: "#F59E0B", dark: "#B45309" },
        danger: { DEFAULT: "#DC2626", dark: "#991B1B" },
        ink: { DEFAULT: "#1E1B3A", soft: "#57536E" },
        neutral: "#8B89A0",
        border: { DEFAULT: "#1E1B3A", soft: "#D9D7E8" },
        surface: { DEFAULT: "#FFFBF5", card: "#FFFFFF", sunken: "#F3F1FB" },
      },
      spacing: {
        // NOTE: these names also drive max-w-*/w-*/h-* etc. in this Tailwind
        // v4 setup, so max-w-sm/md/lg/xl resolve to 8/16/24/32px here, not the
        // built-in rem presets. Use max-w-[Nrem] for a text-measure cap instead.
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      fontFamily: {
        display: ["var(--font-baloo)", "cursive"],
        body: ["var(--font-poppins)", "sans-serif"],
      },
      fontSize: {
        display: ["34px", { lineHeight: "40px", fontWeight: "800" }],
        title: ["24px", { lineHeight: "30px", fontWeight: "700" }],
        "title-sm": ["18px", { lineHeight: "24px", fontWeight: "700" }],
        "stat-hero": ["44px", { lineHeight: "48px", fontWeight: "800" }],
        stat: ["22px", { lineHeight: "26px", fontWeight: "700" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-strong": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        label: ["14px", { lineHeight: "20px", fontWeight: "600" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      borderRadius: {
        chip: "12px",
        button: "16px",
        card: "24px",
      },
      borderWidth: {
        "2.5": "2.5px",
        "3": "3px",
      },
      maxWidth: {
        // Lebar viewport mobile — dipakai untuk mengunci shell aplikasi
        // (header, konten, bottom nav) tetap selebar HP bahkan di desktop.
        app: "430px",
      },
      boxShadow: {
        "solid-sm": "0 2px 0 0 #1E1B3A",
        "solid-md": "0 4px 0 0 #1E1B3A",
        "solid-lg": "0 6px 0 0 #1E1B3A",
        "press-primary": "0 4px 0 0 #3730A3",
        "press-secondary": "0 4px 0 0 #047857",
        "press-tertiary": "0 4px 0 0 #7C3000",
        "press-danger": "0 4px 0 0 #991B1B",
      },
    },
  },
  plugins: [],
};
export default config;
