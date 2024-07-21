/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: '#18181A',
        primary: '#4F21EA',
        secondary: '#FFD700'
      },
      fontFamily: {
        niveauGrotesk: ['Niveau Grotesk', 'sans-serif']
      }
    }
  },
  plugins: []
}
