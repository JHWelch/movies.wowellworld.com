/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
