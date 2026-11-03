/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream:        '#F3E9D8',
        'cherry-red': '#A52A3A',
        burgundy:     '#762C31',
        charcoal:     '#292624',
        gold:         '#B99B76',
        'warm-white': '#FFFDF8',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
