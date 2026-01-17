/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,css}',
    './node_modules/preline/dist/*.js'
  ],
  plugins: [require('preline/plugin')]
};
