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
        primary: {
          darker: '#DF114F',
          dark: '#F25785',
          light: '#F4ABBB',
        },
        dark: '#040404',
        light: '#D5CCCC',
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
