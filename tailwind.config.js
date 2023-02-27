/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        barlow: ["Barlow"],
      },
      colors: {
        tgbrown: {
          50: "#f6f4f0",
          100: "#eae3d7",
          200: "#d6c9b2",
          300: "#bea786",
          400: "#a6845b",
          500: "#9c7956",
          600: "#866248",
          700: "#6c4c3c",
          800: "#5c4237",
          900: "#503a33",
        },
      },
    },
  },
  plugins: [],
};
