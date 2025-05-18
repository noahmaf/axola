/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2E3091",
        },
        secondary: {
          DEFAULT: "#009CA6",
          90: "rgba(0,156,166,0.9)",
          50: "rgba(0,156,166,0.5)",
          20: "rgba(0,156,166,0.2)",
          10: "rgba(0,156,166,0.1)",
          5: "rgba(0,156,166,0.05)",
        },

        tertiary: "#00FFCC",
        pageBackground: "#f2f4f8",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
