const defaultTheme = require('tailwindcss/defaultTheme')
const customTheme = require('@rockts-org/rockets-ui-components/src/theme').theme;

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      ...defaultTheme,
    },
    ...customTheme
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
