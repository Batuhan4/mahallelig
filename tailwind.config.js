/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Civic navy — primary
        navy: {
          50: "#EEF1F6",
          100: "#D7DEEB",
          300: "#5E7691",
          500: "#314F75",
          700: "#1B3A5C",
          900: "#0C2340",
          950: "#050E1E"
        },
        // Akik terra — sport accent
        terra: {
          100: "#F8DCCB",
          200: "#F1C3B0",
          400: "#DE7D5C",
          500: "#D2603A",
          600: "#BD5331",
          700: "#A4472A"
        },
        // Fildişi — surfaces
        ivory: {
          50: "#FAF7EF",
          100: "#F5F0E6",
          200: "#ECE3D3",
          300: "#DDD2BD",
          400: "#C7B89C"
        },
        // Saha yeşili — success
        field: {
          400: "#4D7E5E",
          500: "#2F5D3C",
          700: "#1F4029"
        },
        // Çelik gri — secondary ink
        steel: {
          200: "#B8BEC9",
          400: "#7B8492",
          500: "#5C6573",
          700: "#3A4452",
          900: "#1E222B"
        },
        // Bronz — medals
        bronze: {
          400: "#D7B374",
          500: "#B98D4A",
          700: "#8A6534"
        }
      },
      fontFamily: {
        // Tüm tipografi → iOS'ta San Francisco Pro (System), Android'de Roboto.
        // display/sans/semibold/bold ayırımı korundu ki mevcut sınıflar kırılmasın;
        // hepsi aynı sistem ailesine bağlanır, ağırlığı `font-medium`/`font-bold`
        // gibi Tailwind ağırlık sınıfları ile veya inline `fontWeight` ile verilir.
        display: ["System"],
        "display-italic": ["System"],
        sans: ["System"],
        semibold: ["System"],
        bold: ["System"],
        mono: ["Menlo"],
        "mono-bold": ["Menlo"]
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
        widest: "0.16em"
      }
    }
  },
  plugins: []
};
