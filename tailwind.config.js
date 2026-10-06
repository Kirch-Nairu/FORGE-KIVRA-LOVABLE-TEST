/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: 'var(--color-paper)',
          dark: '#121614',
          light: '#F6F3EE',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          alt: 'var(--color-surface-alt)',
        },
        ink: {
          DEFAULT: 'var(--color-ink)',
          muted: 'var(--color-muted)',
          hairline: 'var(--color-hairline)',
        },
        pine: {
          DEFAULT: 'var(--color-pine)',
          soft: 'var(--color-pine-soft)',
        },
        brick: 'var(--color-brick)',
        amber: 'var(--color-amber)',
        slate: 'var(--color-slate)',
        goal: 'var(--color-goal)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
