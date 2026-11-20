/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        gray: "var(--gray)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        muted: "var(--muted)",
        "muted-2": "var(--muted-2)",
        red: "var(--red)",
        green: "var(--green)",
        rose: "var(--rose)",
        "pink-bg": "var(--pink-bg)",
        "pink-soft": "var(--pink-soft)",
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