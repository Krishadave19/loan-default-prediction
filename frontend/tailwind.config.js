/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#080B14',
          900: '#0D1220',
          800: '#131A2C',
          700: '#1B2440',
          600: '#26315199',
        },
        ivory: {
          50: '#FBF9F4',
          100: '#F4F0E6',
          200: '#EAE3D2',
        },
        ink: {
          900: '#14171F',
          700: '#3B4152',
        },
        gold: {
          400: '#E4C589',
          500: '#D4AF6A',
          600: '#B98F45',
        },
        indigo: {
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
        },
        violet: {
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
        },
        risk: {
          low: '#10B981',
          mid: '#F59E0B',
          high: '#F43F5E',
        },
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
        'gold-gradient': 'linear-gradient(135deg, #E4C589 0%, #D4AF6A 100%)',
        'aurora': 'radial-gradient(60% 60% at 20% 20%, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0) 70%), radial-gradient(50% 50% at 80% 30%, rgba(168,85,247,0.30) 0%, rgba(168,85,247,0) 70%), radial-gradient(45% 45% at 50% 90%, rgba(212,175,106,0.18) 0%, rgba(212,175,106,0) 70%)',
      },
      boxShadow: {
        glass: '0 8px 32px -8px rgba(8,11,20,0.35)',
        'glass-lg': '0 24px 64px -12px rgba(8,11,20,0.45)',
        glow: '0 0 0 1px rgba(168,85,247,0.25), 0 0 24px 0 rgba(99,102,241,0.35)',
        'glow-gold': '0 0 0 1px rgba(212,175,106,0.3), 0 0 24px 0 rgba(212,175,106,0.35)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
}
