import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          900: '#0b0f14',
          850: '#10151c',
          800: '#141b24',
          700: '#1b2431',
          600: '#243042'
        },
        accent: {
          500: '#6d8dff',
          400: '#8aa1ff',
          300: '#a6b5ff'
        },
        neon: {
          green: '#5cffc6',
          amber: '#ffcf6d',
          red: '#ff6d8c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        glow: '0 0 12px rgba(109, 141, 255, 0.25)'
      },
      backgroundImage: {
        'hud-lines': 'linear-gradient(90deg, rgba(109,141,255,0.15) 0%, rgba(109,141,255,0) 60%)'
      }
    }
  },
  plugins: []
};

export default config;
