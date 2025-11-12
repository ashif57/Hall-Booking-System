/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary-deep-navy': '#0B132B',
        'secondary-royal-gold': '#F0A500',
        'accent-champagne': '#FFD580',
        'background-ivory-white': '#F9F9F9',
        'text-charcoal': '#1E1E1E',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
