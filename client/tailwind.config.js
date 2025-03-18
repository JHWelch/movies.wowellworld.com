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
        purp: {
          light: '#806297',
          dark: '#511a7a',
        },
        mint: '#a8dcb9',
        web: {
          pink: '#ff00fe',
          red: '#fe0100',
          blue: '#0000ff',
          green: '#03ff00',
          aqua: '#03ffff',
          yellow: '#ffff00',
          grey: '#dcdcdc',
        },
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
