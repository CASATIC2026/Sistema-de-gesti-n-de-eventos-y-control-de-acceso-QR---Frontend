/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: "#C5A028",
      secondary: "#333333",
      tertiary: "#F5F5F5",
      neutral: "#121212",
    },
  },
},
  plugins: [],
}