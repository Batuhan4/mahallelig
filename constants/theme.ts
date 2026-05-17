// Devlet Mavisi & Akik — civic-sport editorial palette.
// Light-only. Refined minimal aesthetic.

export const palette = {
  // Primary — civic navy
  navy50: "#EEF1F6",
  navy100: "#D7DEEB",
  navy300: "#5E7691",
  navy500: "#314F75",
  navy700: "#1B3A5C",
  navy900: "#0C2340",
  navy950: "#050E1E",

  // Sport accent — akik terra
  terra100: "#F8DCCB",
  terra200: "#F1C3B0",
  terra400: "#DE7D5C",
  terra500: "#D2603A",
  terra600: "#BD5331",
  terra700: "#A4472A",

  // Surfaces — fildişi
  ivory50: "#FAF7EF",
  ivory100: "#F5F0E6",
  ivory200: "#ECE3D3",
  ivory300: "#DDD2BD",
  ivory400: "#C7B89C",

  // Success — saha yeşili
  field400: "#4D7E5E",
  field500: "#2F5D3C",
  field700: "#1F4029",

  // Secondary ink — çelik gri
  steel200: "#B8BEC9",
  steel400: "#7B8492",
  steel500: "#5C6573",
  steel700: "#3A4452",
  steel900: "#1E222B",

  // Bronze medal
  bronze400: "#D7B374",
  bronze500: "#B98D4A",
  bronze700: "#8A6534"
} as const;

// Legacy aliases (kept so older imports don't crash before refactor)
export const palette_legacy = {
  brand: palette.navy900,
  brandDark: palette.navy950,
  accent: palette.terra500,
  ink900: palette.steel900,
  ink700: palette.steel700,
  ink500: palette.steel500,
  ink300: palette.ivory300,
  warn: palette.bronze500,
  danger: palette.terra700
} as const;

// Partner accent map — used in market category visualizations
export const partnerColors: Record<string, string> = {
  belpa: palette.navy900,
  municipal_sports: palette.field500,
  culture: palette.bronze500,
  local: palette.terra500,
  transport: palette.navy500
};

// Typography presets — Tailwind sınıf yardımcıları.
// Tüm sans/display sınıfları artık iOS'ta San Francisco Pro'yu (System) işaret eder;
// ağırlık `font-medium`/`font-semibold`/`font-bold` ile verilir.
// Mono ailesi Menlo (iOS) / Roboto Mono (Android) sistem mono'suna çözülür.
export const type = {
  displayHero: "font-display font-bold text-[44px] leading-[44px] tracking-tightest",
  displayLg: "font-display font-bold text-3xl leading-[34px] tracking-tighter",
  displayMd: "font-display font-bold text-2xl leading-[28px] tracking-tighter",
  displaySm: "font-display font-bold text-xl leading-6 tracking-tight",

  bodyLg: "font-sans text-base leading-6",
  body: "font-sans text-sm leading-5",
  bodySm: "font-sans text-xs leading-4",

  label: "font-sans font-semibold text-xs uppercase tracking-widest",

  monoHero: "font-mono font-bold text-[40px] leading-[44px] tracking-tighter",
  monoLg: "font-mono text-2xl leading-7",
  mono: "font-mono text-sm leading-5"
} as const;
