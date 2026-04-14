/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    fontFamily: {
        'work-sans': ['Work Sans', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
      },
  },
},
  plugins: [],
}