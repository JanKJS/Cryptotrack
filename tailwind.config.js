/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0099FF',
          dark: '#0077CC',
          light: '#33ADFF'
        },
        background: {
          DEFAULT: '#0A0A0A',
          light: '#1A1A1A',
          lighter: '#2A2A2A'
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          tertiary: '#71717A'
        }
      }
    },
  },
  plugins: [],
};