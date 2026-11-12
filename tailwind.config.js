/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#252b2e",
        "ink-2": "#262627",
        gray: "#f0f0f0",
        line: "#eaeaea",
        "line-2": "#d8d8d8",
        muted: "#888888",
        "muted-2": "#b5b5b5",
        red: "#cc0c0c",
        green: "#058111",
        rose: "#e84393",
        "pink-bg": "#fde4f0",
        "pink-soft": "#fff0f6",
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
      },
      maxWidth: {
        container: "1440px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};