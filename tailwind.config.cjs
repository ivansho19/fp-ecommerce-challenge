/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0f8a3b',
          primaryDark: '#0b6a2c',
          primarySoft: '#e6f6ef',
          accent: '#1f7cc8',
          accentSoft: '#e6f2fb'
        }
      }
    }
  },
  plugins: []
};
