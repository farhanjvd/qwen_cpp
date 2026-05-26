/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nab-dark': '#0a0a0a',
        'nab-darker': '#1c1c1e',
        'nab-card': '#2c2c2e',
        'nab-blue': '#0071e3',
        'nab-blue-dark': '#005bb5',
        'nab-gray': '#86868b',
        'nab-light': '#f5f5f7',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
