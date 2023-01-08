/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html"],
  theme: {
    extend: {
      colors: {
        'primary': '#E6E3FF',
        'secondary': '#958ADC',
        'secondary-2': '#3C3082',
      },
      fontFamily: {
        'nunito': 'Nunito'
      }
    },
    screens: {
      'xsm': {'max': '383px'},
      'smx': {'max': '530px'}
    }
  },
  plugins: [],
}
