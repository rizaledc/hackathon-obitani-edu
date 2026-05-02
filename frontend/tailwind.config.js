/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
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
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        }
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out forwards",
        slideUp: "slideUp 0.4s ease-out forwards",
        'fade-in': "fadeIn 0.5s ease-in-out forwards"
      }
    },
  },
  plugins: [],
}
