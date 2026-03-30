/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: { 900:'#0d0e1a', 950:'#08081a' },
        spirit: { 300:'#c4b5fd', 400:'#a78bfa', 500:'#8b5cf6', 600:'#7c3aed', 700:'#6d28d9' },
        gold: { 400:'#facc15', 500:'#eab308' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.7s cubic-bezier(.22,1,.36,1) forwards',
        'breathe': 'breathe 4s ease-in-out infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
        'check-pop': 'checkPop 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%':{opacity:'0'}, '100%':{opacity:'1'} },
        fadeUp: { '0%':{opacity:'0',transform:'translateY(24px)'}, '100%':{opacity:'1',transform:'translateY(0)'} },
        breathe: { '0%,100%':{transform:'scale(1)',opacity:'0.6'}, '50%':{transform:'scale(1.1)',opacity:'1'} },
        glow: { '0%':{boxShadow:'0 0 24px rgba(139,92,246,0.15)'}, '100%':{boxShadow:'0 0 48px rgba(139,92,246,0.3)'} },
        checkPop: { '0%':{transform:'scale(0)'}, '60%':{transform:'scale(1.3)'}, '100%':{transform:'scale(1)'} },
      },
    },
  },
  plugins: [],
}
