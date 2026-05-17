/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: { 50: "#EEF2FF", 500: "#6366F1", 600: "#4F46E5", 700: "#4338CA" },
        accent: { 500: "#22C55E" },
        ink: { 900: "#0F172A", 700: "#334155", 500: "#64748B", 300: "#CBD5E1" }
      }
    }
  },
  plugins: []
};
