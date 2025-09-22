/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "border-animate": "borderColorAnim 2s infinite",
        
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        borderColorAnim: {
          "0%, 100%": { borderColor: "#60A5FA" }, // blue-400
          "50%": { borderColor: "#22C55E" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
