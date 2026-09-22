/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: { DEFAULT: 'var(--background)' },
        foreground: { DEFAULT: 'var(--foreground)' },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: { DEFAULT: 'var(--border)' },
        input: { DEFAULT: 'var(--input)' },
        ring: { DEFAULT: 'var(--ring)' },
        success: { DEFAULT: 'var(--success)' },
        warning: { DEFAULT: 'var(--warning)' },
        danger: { DEFAULT: 'var(--danger)' },
        tkj: { DEFAULT: 'var(--tkj)' },
        tav: { DEFAULT: 'var(--tav)' },
        tkr: { DEFAULT: 'var(--tkr)' },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 0.25rem)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) + 0.15rem)',
        xl: 'calc(var(--radius) + 0.35rem)',
        '2xl': 'calc(var(--radius) + 0.65rem)',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 12px 32px rgba(0,0,0,0.10)',
        modal: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)',
        glass: '0 4px 32px rgba(26,86,219,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.25s ease forwards',
        shimmer: 'shimmer 1.5s infinite',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 40%, #fdf4ff 100%)',
        'grid-pattern': 'linear-gradient(to right, rgba(26,86,219,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,86,219,0.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};