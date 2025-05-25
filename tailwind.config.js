/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        }
      },
      animation: {
        confetti: 'confetti 5s ease-out infinite',
      },
      animationDelay: {
        200: "200ms",
        400: "400ms",
        600: "600ms",
      },
    },
  },
  plugins: [require("tailwindcss-animation-delay")],
} 