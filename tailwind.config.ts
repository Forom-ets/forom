import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        jersey: ['"Jersey 15"', 'sans-serif'],
        'jersey-10': ['"Jersey 10"', 'sans-serif'],
        'jetbrains': ['"JetBrains Mono"', 'monospace'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config