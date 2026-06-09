import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background-rgb) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground-rgb) / <alpha-value>)',
        surface: 'rgb(var(--color-surface-rgb) / <alpha-value>)',
        'surface-soft': 'rgb(var(--color-surface-soft-rgb) / <alpha-value>)',
        muted: 'rgb(var(--color-muted-rgb) / <alpha-value>)',
        border: 'rgb(var(--color-border-rgb) / <alpha-value>)',
        gold: 'rgb(var(--color-gold-rgb) / <alpha-value>)',
        'gold-deep': 'rgb(var(--color-gold-deep-rgb) / <alpha-value>)',
        ink: 'rgb(var(--color-ink-rgb) / <alpha-value>)',
        champagne: 'rgb(var(--color-champagne-rgb) / <alpha-value>)'
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif']
      },
      boxShadow: {
        luxe: '0 24px 80px rgba(28, 25, 23, 0.12)',
        gold: '0 16px 45px rgba(179, 138, 46, 0.25)'
      },
      backgroundImage: {
        'gold-radial': 'radial-gradient(circle at 50% 0%, rgba(210, 169, 81, 0.28), transparent 38%)',
        'paper-grain': 'linear-gradient(120deg, rgba(255,255,255,0.96), rgba(246,243,236,0.88))'
      }
    }
  },
  plugins: []
}

export default config
