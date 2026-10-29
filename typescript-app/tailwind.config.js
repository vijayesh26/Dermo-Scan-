/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F0F4F8',
        surface: {
          DEFAULT: '#FFFFFF',
          2: '#F7FAFC',
        },
        border: '#E2E8F0',
        primary: {
          DEFAULT: '#0F6FBF',
          dim: '#EBF4FF',
          dark: '#0A5594',
        },
        teal: {
          DEFAULT: '#0D9488',
          dim: '#CCFBF1',
        },
        risk: {
          high: '#DC2626',
          'high-bg': '#FEF2F2',
          mid: '#D97706',
          'mid-bg': '#FFFBEB',
          low: '#059669',
          'low-bg': '#ECFDF5',
        },
        text: '#0F172A',
        muted: '#64748B',
        badge: {
          sim: '#F59E0B',
          'sim-bg': '#FEF3C7',
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        control: '8px',
        pill: '9999px',
      },
      boxShadow: {
        clinical: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'clinical-hover': '0 4px 8px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.06)',
        'clinical-lg': '0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        sonar: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-subtle': 'pulseSlow 2.5s ease-in-out infinite',
        sonar: 'sonar 2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
