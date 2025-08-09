/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Minimalist Music-Focused Palette
        // Deep, rich blacks and grays for premium feel
        'deep-void': '#0A0A0A',        // Almost pure black for deep backgrounds
        'charcoal': '#1A1A1A',         // Primary dark surfaces
        'slate-dark': '#2A2A2A',       // Secondary surfaces
        'graphite': '#3A3A3A',         // Elevated elements
        
        // Sophisticated grays for text hierarchy
        'ash': '#6B7280',              // Secondary text
        'silver': '#9CA3AF',           // Tertiary text  
        'pearl': '#D1D5DB',            // Primary light text
        'snow': '#F9FAFB',             // Pure white accents
        
        // Music-inspired accent colors - calm and focused
        'sonic-blue': '#3B82F6',       // Primary brand - trustworthy blue
        'wave-teal': '#0891B2',        // Secondary - ocean depth
        'rhythm-purple': '#7C3AED',    // Accent - creative energy
        'beat-green': '#059669',       // Success - natural harmony
        
        // Warm accents for energy and emotion
        'melody-orange': '#EA580C',    // Warning/energy
        'tempo-red': '#DC2626',        // Error/stop
        'harmony-yellow': '#D97706',   // Highlight/attention
        
        // Subtle tints for backgrounds and states
        'sonic-blue-50': '#EFF6FF',
        'sonic-blue-100': '#DBEAFE', 
        'sonic-blue-900': '#1E3A8A',
        'sonic-blue-950': '#1E2A5E',
        
        'wave-teal-50': '#ECFDF5',
        'wave-teal-900': '#064E3B',
        
        'rhythm-purple-50': '#F5F3FF',
        'rhythm-purple-900': '#581C87',
        
        // Semantic colors for clear communication
        success: '#059669',
        warning: '#D97706', 
        error: '#DC2626',
        info: '#0891B2',
        
        // Special music UI elements
        'waveform': '#3B82F6',         // Audio visualization
        'progress': '#0891B2',         // Playback progress
        'accent': '#7C3AED',           // Interactive elements
        'glow': '#3B82F6',             // Hover/focus states
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        // Enhanced typography
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
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
          '0%': { boxShadow: '0 0 5px #00D4FF' },
          '100%': { boxShadow: '0 0 20px #00D4FF, 0 0 30px #00D4FF' },
        },
      },
      backgroundImage: {
        // Subtle, sophisticated gradients for music applications
        'void-gradient': 
          'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #2A2A2A 100%)',
        'charcoal-gradient':
          'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #3A3A3A 100%)',
        'sonic-gradient':
          'linear-gradient(135deg, #3B82F6 0%, #0891B2 100%)',
        'rhythm-gradient':
          'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
        'wave-gradient':
          'linear-gradient(135deg, #0891B2 0%, #059669 100%)',
        'glass-gradient':
          'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'glow-gradient':
          'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
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
        // Refined shadows for depth and focus
        'sonic': '0 0 20px rgba(59, 130, 246, 0.3)',
        'sonic-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
        'wave': '0 0 20px rgba(8, 145, 178, 0.3)',
        'rhythm': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.7)',
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'focus': '0 0 0 2px rgba(59, 130, 246, 0.5)',
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
