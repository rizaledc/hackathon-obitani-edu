/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16a34a',
        'primary-light': '#22c55e',
        'primary-pale': '#f0fdf4',
        accent: '#15803d',
        'text-primary': '#111827',
        'text-secondary': '#6b7280',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
