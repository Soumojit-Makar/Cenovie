/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Deep Navy — primary brand
        brand: {
          950: "#020b18",
          900: "#040f21",
          800: "#071830",
          700: "#0a2040",
          600: "#0d2c58",
          500: "#113a73",
          400: "#1a5299",
          300: "#2e72c4",
          200: "#5e9ee8",
          100: "#b8d4f5",
          50:  "#eaf2fd",
        },
        // Gold — accent
        gold: {
          700: "#92620a",
          600: "#b8790d",
          500: "#d4920f",
          400: "#f0ab18",
          300: "#f5c042",
          200: "#f9d47a",
          100: "#fdf0cc",
          50:  "#fffcf0",
        },
        // Navy surface shades
        navy: {
          950: "#020b18",
          900: "#040f21",
          800: "#071830",
          700: "#0a2040",
          600: "#0d2c58",
        },
      },
      fontFamily: {
        display: ['"Syne"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
      boxShadow: {
        gold: "0 4px 24px -4px rgba(212, 146, 15, 0.35)",
        navy: "0 4px 24px -4px rgba(7, 24, 48, 0.5)",
      },
    },
  },
  plugins: [],
};
