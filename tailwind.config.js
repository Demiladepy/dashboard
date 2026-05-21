/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Varela Round', 'sans-serif'],
      },
      colors: {
        background: '#060d18',
        surface: '#0c1526',
        card: '#111d32',
        border: 'rgba(255,255,255,0.08)',
        text: '#f6f9fc',
        'text-secondary': '#8898aa',
        muted: '#556677',
        accent: {
          DEFAULT: '#635bff',
          cyan: '#00d4ff',
          glow: 'rgba(99, 91, 255, 0.15)',
        },
        'accent-cyan': '#00d4ff',
        'accent-amber': '#f5a623',
        'accent-red': '#ff4757',
        green: {
          DEFAULT: '#00d4ff',
          12: 'rgba(0, 212, 255, 0.12)',
        },
        amber: {
          DEFAULT: '#f5a623',
          12: 'rgba(245, 166, 35, 0.12)',
        },
        blue: {
          DEFAULT: '#635bff',
          12: 'rgba(99, 91, 255, 0.12)',
        },
        red: {
          DEFAULT: '#ff4757',
          12: 'rgba(255, 71, 87, 0.12)',
        },
        purple: {
          DEFAULT: '#7a73ff',
        },
        dim: '#556677',
      },
    },
  },
  plugins: [],
};
