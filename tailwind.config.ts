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
      },
    },
  },
  plugins: [],
} satisfies Config