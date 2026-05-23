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
        background: '#f6f9fc',
        surface: '#ffffff',
        card: '#ffffff',
        border: '#e3e8ee',
        text: '#0a2540',
        'text-secondary': '#425466',
        muted: '#8898aa',
        accent: {
          DEFAULT: '#635bff',
          cyan: '#00d4ee',
          glow: 'rgba(99, 91, 255, 0.12)',
        },
        'accent-cyan': '#00a2c7',
        'accent-amber': '#df8600',
        'accent-red': '#df1b41',
        green: {
          DEFAULT: '#00a2c7',
          12: 'rgba(0, 162, 199, 0.1)',
        },
        amber: {
          DEFAULT: '#df8600',
          12: 'rgba(223, 134, 0, 0.1)',
        },
        blue: {
          DEFAULT: '#635bff',
          12: 'rgba(99, 91, 255, 0.1)',
        },
        red: {
          DEFAULT: '#df1b41',
          12: 'rgba(223, 27, 65, 0.1)',
        },
        purple: {
          DEFAULT: '#7a73ff',
        },
        dim: '#8898aa',
      },
      boxShadow: {
        stripe: '0 13px 27px -5px rgba(50, 50, 93, 0.08), 0 8px 16px -8px rgba(0, 0, 0, 0.06)',
        'stripe-sm': '0 2px 5px -1px rgba(50, 50, 93, 0.08), 0 1px 3px -1px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
