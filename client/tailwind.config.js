/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.vue',
    './src/**/*.ts',
  ],
  theme: {
    fontFamily: {
      playwrite: ['Playwrite', 'sans-serif'],
      noto: ['Noto', 'sans-serif'],
    },
    extend: {
      colors: {
        brat: {
          50: '#faffe5',
          100: '#f1ffc6',
          200: '#e2ff94',
          300: '#ccff56',
          400: '#b4f724',
          500: '#89cc04',
          600: '#73b200',
          700: '#568704',
          800: '#466a0a',
          900: '#3b590e',
          950: '#1d3201',
        },
        purp: {
          light: '#806297',
          dark: '#511a7a',
        },
        mint: '#a8dcb9',
      },
      maxWidth: {
        '8xl': '90rem',
        '9xl': '100rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // eslint-disable-line @typescript-eslint/no-require-imports, no-undef
    require('@tailwindcss/forms'), // eslint-disable-line @typescript-eslint/no-require-imports, no-undef
  ],
}
