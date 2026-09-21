import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        ivory: 'hsl(var(--ivory))',
        cream: 'hsl(var(--cream))',
        beige: 'hsl(var(--beige))',
        rose: {
          DEFAULT: 'hsl(var(--rose))',
          deep: 'hsl(var(--rose-deep))',
        },
        blush: 'hsl(var(--blush))',
        burgundy: {
          DEFAULT: 'hsl(var(--burgundy))',
          deep: 'hsl(var(--burgundy-deep))',
        },
        sage: 'hsl(var(--sage))',
        botanical: 'hsl(var(--botanical))',
        champagne: 'hsl(var(--champagne))',
        ink: 'hsl(var(--ink))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--beige) / 0.4)',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--ink) / 0.6)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(6deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float-slow': 'float-slow 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
