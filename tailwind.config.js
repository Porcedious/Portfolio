/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        cream: '#efeee9',
        gold: {
          DEFAULT: '#d4af37',
          light: '#f3e5ab',
          dark: '#997a15',
          editorial: '#c5a059'
        },
        dark: {
          950: '#09090b',
          900: '#121215',
          800: '#1a1a1e',
          700: '#27272a'
        }
      },
      fontFamily: {
        hn: ['"Helvetica Neue ME"', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['"Helvetica Neue ME"', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['"Helvetica Neue ME"', 'Georgia', 'serif']
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translate3d(0%, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'rise-in': {
          '0%': { opacity: '0', transform: 'translate3d(0, 4vh, 0) scale(1.03)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0) scale(1)' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translate3d(0, 28px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' }
        },
        'line-grow': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' }
        }
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'fade-in': 'fade-in 1.2s ease-out both',
        'rise-in': 'rise-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'line-grow': 'line-grow 1.1s cubic-bezier(0.76, 0, 0.24, 1) both'
      }
    },
  },
  plugins: [],
}
