import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fifth Ave AI brand tokens
        dark: '#0A0A0A',
        'dark-2': '#1A1A1A',
        gold: '#D7B75A',
        white: '#FFFFFF',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'power2-out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
