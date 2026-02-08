/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        binder: {
          black: '#1a1a1a',
          dark: '#2d2d2d',
          leather: '#3d2817',
          ring: '#c0c0c0',
          ringDark: '#808080',
          paper: '#f5f5f0',
          tabBlue: '#2563eb',
          tabOrange: '#ea580c',
          tabGreen: '#16a34a',
          tabPurple: '#9333ea',
          tabRed: '#dc2626',
          tabTeal: '#0d9488',
        }
      },
      boxShadow: {
        'binder': '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0,0,0,0.3)',
        'ring': 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)',
        'page': '2px 0 8px rgba(0,0,0,0.1), -1px 0 2px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}