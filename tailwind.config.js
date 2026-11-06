/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nintendo: {
          red: '#e60012',
          darkRed: '#c4000f',
          lightRed: '#ff2b3b',
        },
      },
    },
  },
  plugins: [],
}
