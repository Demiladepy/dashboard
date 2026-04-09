/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        background: '#0B0F14',
        card: '#111720',
        border: '#1E2530',
        green: {
          DEFAULT: '#34D399',
          12: 'rgba(52, 211, 153, 0.12)',
        },
        amber: {
          DEFAULT: '#FBBF24',
          12: 'rgba(251, 191, 36, 0.12)',
        },
        blue: {
          DEFAULT: '#60A5FA',
          12: 'rgba(96, 165, 250, 0.12)',
        },
        red: {
          DEFAULT: '#EF4444',
          12: 'rgba(239, 68, 68, 0.12)',
        },
        purple: {
          DEFAULT: '#A78BFA',
        },
        dim: '#64748B',
      }
    },
  },
  plugins: [],
}
