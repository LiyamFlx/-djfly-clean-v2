/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        // Simple Black & White Base
        'pure-black': '#000000',
        'rich-black': '#0D0D0D', // Updated to match README
        'dark-gray': '#1a1a1a',
        'pure-white': '#FFFFFF',
        'off-white': '#F5F5F5',
        'light-gray': '#dee2e6',

        // Brand Colors - updated to new palette
        'neon-purple': '#9d4edd', // Purple
        'neon-purple-light': '#b766ea',
        'neon-purple-dark': '#7c2fcf',

        'neon-green': '#abff4f', // Green
        'neon-green-light': '#c4ff7a',
        'neon-green-dark': '#8bcc2f',

        'laser-pink': '#9d4edd', // Using purple instead of pink

        // Semantic colors using updated theme
        success: '#abff4f', // Now Green
        warning: '#F59E0B',
        error: '#9d4edd', // Now Purple
        info: '#9d4edd', // Now Purple
=======
        // Brand Colors
        'electric-blue': '#00D4FF',
        'bright-turquoise': '#00FFCC',
        'laser-pink': '#FF0080',
        'rich-black': '#0D0D0D',

        // UI & Grayscale Palette
        'ui-bg-deep': '#0D0D0D',
        'ui-bg': '#1A1A2E',
        'ui-bg-hover': '#2A2A4E',
        'ui-border': '#3A3A6E',
        'ui-text': '#FFFFFF',
        'ui-text-dim': '#A0A0C0',

        // Semantic Colors
        success: '#00FF80',
        warning: '#FFD700',
        error: '#FF4D4D',
>>>>>>> fix-spotify-connection
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Oxanium', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        // Custom font sizes for better hierarchy
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        wave: 'wave 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #9d4edd' },
          '100%': { boxShadow: '0 0 20px #9d4edd, 0 0 30px #9d4edd' },
        },
      },
      backgroundImage: {
        // Gradients updated with new brand colors
        'black-gradient': 'linear-gradient(135deg, #000000 0%, #0D0D0D 100%)',
        'purple-gradient': 'linear-gradient(135deg, #9d4edd 0%, #7c2fcf 100%)',
        'green-gradient': 'linear-gradient(135deg, #abff4f 0%, #8bcc2f 100%)',
        'neon-gradient': 'linear-gradient(135deg, #9d4edd 0%, #abff4f 100%)',
        'glass-gradient':
          'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'purple-glow': 'radial-gradient(circle, rgba(157, 78, 221, 0.3) 0%, transparent 70%)',
        'green-glow': 'radial-gradient(circle, rgba(171, 255, 79, 0.3) 0%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        // Neon glow effects updated with new brand colors
        'neon-purple': '0 0 20px rgba(157, 78, 221, 0.5)',
        'neon-purple-lg': '0 0 40px rgba(157, 78, 221, 0.7), 0 0 80px rgba(157, 78, 221, 0.3)',
        'neon-green': '0 0 20px rgba(171, 255, 79, 0.5)',
        'neon-green-lg': '0 0 40px rgba(171, 255, 79, 0.7), 0 0 80px rgba(171, 255, 79, 0.3)',
        'laser-pink': '0 0 20px rgba(157, 78, 221, 0.5)',
        'laser-pink-lg': '0 0 40px rgba(157, 78, 221, 0.7), 0 0 80px rgba(157, 78, 221, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.8)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.9)',
        'focus-purple': '0 0 0 2px rgba(157, 78, 221, 0.8)',
        'focus-green': '0 0 0 2px rgba(171, 255, 79, 0.8)',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
    },
  },
  plugins: [],
};
