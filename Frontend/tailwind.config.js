module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        text: "#050b0f",
        background: "#f1f7fb",
        primary: "#28A2E7",
        secondary: "#82c7f0",
        accent: "#40b1f3",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        dosis: "Dosis",
        inter: "Inter, sans-serif",
        orbitron: "Orbitron, sans-serif",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
    },
  },
  plugins: [],
};
