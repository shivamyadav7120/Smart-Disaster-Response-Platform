/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0c2117',
          900: '#123322',
          800: '#17402b',
          700: '#1f5236'
        },
        mint: {
          50: '#eef7ee',
          100: '#e2f2e2'
        },
        alert: {
          red: '#dc4b3e',
          redBg: '#fbe7e4',
          amber: '#d98a1f',
          amberBg: '#fbf0dd',
          blue: '#2f6fb0',
          blueBg: '#e4eef8',
          green: '#2f8a52',
          greenBg: '#e4f4e9',
          purple: '#6a4fb5',
          purpleBg: '#ece6f8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
}
