// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Path ke semua file di folder src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}