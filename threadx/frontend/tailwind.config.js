/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#FFFFFF',
        paper: '#0A0A0A',
        navbar: '#111111',
        card: '#181818',
        line: '#292929',
        muted: '#A3A3A3',
        accent: 'var(--accent)',
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
}