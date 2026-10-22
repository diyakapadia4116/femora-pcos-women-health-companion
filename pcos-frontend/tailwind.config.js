/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#00786f', // SGP Prototype Deep Teal
          800: '#065f5b',
          900: '#044e4a',
          950: '#022c2a',
        },
        blush: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        roseTint: {
          50: '#fdf2f8', // Soft pink background
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f472b6',
          400: '#e879f9',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 120, 111, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -5px rgba(0, 120, 111, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'glow': '0 0 25px rgba(0, 120, 111, 0.18)',
      }
    },
  },
  plugins: [],
}
