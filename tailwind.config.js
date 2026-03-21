/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.vue',
    './src/**/*.ts',
  ],
  theme: {
    extend: {
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
