/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'studio-dark': '#1a1a2e',
        'studio-darker': '#0f0f1e',
        'studio-accent': '#6c5ce7',
        'studio-accent-light': '#a29bfe',
      },
    },
  },
  plugins: [],
}
