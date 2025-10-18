// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        // Original slow marquee
        'marquee-slow': 'marquee 30s linear infinite',
        // New bidirectional marquee (faster)
        'marquee-bidirectional': 'marquee 10s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(105vw) scaleX(1)' },
          '49%':  { transform: 'translateX(-105vw) scaleX(1)' },
          '50%':  { transform: 'translateX(-105vw) scaleX(-1)' },
          '99%':  { transform: 'translateX(105vw) scaleX(-1)' },
          '100%': { transform: 'translateX(105vw) scaleX(1)' },
        }
      },
    },
  },
  plugins: [],
}
