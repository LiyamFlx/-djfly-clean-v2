/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // DJfly brand colors
        'electric-blue': '#00D4FF',
        'bright-turquoise': '#00FFCC',
        'laser-pink': '#FF0080',
        'rich-black': '#0D0D0D',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
      },
      backgroundImage: {
        'club-gradient':
          'linear-gradient(135deg, #0D0D0D 0%, #1A1A2E 25%, #16213E 50%, #0F3460 75%, #533A7B 100%)',
      },
    },
  },
  plugins: [],
};
