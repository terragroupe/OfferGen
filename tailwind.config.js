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
          50: "#fbfaeb",
          100: "#f6f3cb",
          200: "#efe599",
          300: "#e6d05e",
          400: "#484b56",
          500: "#cda525",
          600: "#b0811e",
          700: "#8d5e1b",
          800: "#764c1d",
          900: "#65401e",
        },
      },
    },
  },
  plugins: [],
};
