# MahalleLig MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working MVP of MahalleLig — a React Native + Expo mobile app with 9 screens (4 core, 5 mock) that delivers the demo flow described in the PRD.

**Architecture:** Expo Router file-based routing with a tab navigator + onboarding stack. Zustand stores hold local state and back the UI. Seed data (neighborhoods, rewards, fake users, fake activities) lives in TypeScript constants and is imported directly — no live Firebase required for the demo. A pluggable "backend" service layer exposes the same API surface as a Firestore-backed implementation would, so swapping is a single-file change. NativeWind handles styling. Pedometer/Location use expo-sensors with a Demo Mode shim that fakes step events for stage demos.

**Tech Stack:** React Native, Expo SDK 51+, Expo Router 3, NativeWind v4, Zustand + AsyncStorage, expo-sensors (Pedometer), expo-location, expo-notifications, react-native-qrcode-svg, victory-native (charts), Jest + jest-expo for tests.

**Scope notes:**
- Firebase is wired as an *optional* adapter behind the backend interface; default backend is an in-memory `seedBackend` so the app runs cleanly in Expo Go without credentials.
- All UI text is Turkish (per PRD).
- Tests cover business logic (points formula, leaderboard sort, redemption state machine, QR payload) and a smoke test per screen.

---

## File Structure

```
app/
  _layout.tsx
  index.tsx                      (auth bootstrap / redirect)
  (onboarding)/
    _layout.tsx
    welcome.tsx
    neighborhood.tsx
    permissions.tsx
  (tabs)/
    _layout.tsx
    index.tsx                    (Bugün)
    league.tsx                   (Mahalle Ligi)
    market.tsx                   (LigMarket)
    municipality.tsx             (Belediye Paneli)
    profile.tsx
  reward/[rid].tsx               (Redeem detay + QR)
  feed.tsx                       (Sosyal Feed - modal)
  business.tsx                   (Yerel İşletme Paneli - mock)
components/
  PointCounter.tsx
  ActivityCard.tsx
  LeaderboardRow.tsx
  RewardCard.tsx
  KpiCard.tsx
  NeighborhoodHeatmap.tsx
  WeeklyTrendChart.tsx
  CategoryPieChart.tsx
  Badge.tsx
  Screen.tsx                     (shared scroll container)
services/
  backend/
    types.ts
    seedBackend.ts
    firebaseBackend.ts           (stub, opt-in via env)
    index.ts
  pedometer.ts
  location.ts
  points.ts
  qr.ts
  notifications.ts
  demoMode.ts
store/
  useUserStore.ts
  useActivityStore.ts
  useLeagueStore.ts
  useRedemptionStore.ts
  useSettingsStore.ts
constants/
  seed/
    neighborhoods.ts
    rewards.ts
    fakeUsers.ts
    fakeActivities.ts
    feed.ts
  theme.ts
  i18n.ts                        (Turkish strings)
__tests__/
  points.test.ts
  league.test.ts
  qr.test.ts
  redemption.test.ts
  seed.test.ts
```

---

## Task 1: Project Initialization & Dependencies

**Files:**
- Create: `package.json`, `app.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`, `global.css`, `nativewind-env.d.ts`, `.gitignore` (update)
- Create: `app/_layout.tsx` (placeholder)

**Steps:**

- [ ] **Step 1.1:** From repo root, init a new Expo TypeScript app *without* creating a subdirectory.

```bash
cd /home/batuhan4/github/mahallelig
# Init in current directory using a temp dir then move files (npx create-expo-app insists on new dir).
npx --yes create-expo-app@latest .tmp-init -t expo-template-blank-typescript --no-install
# Move all files except docs/, README.md, .git, .gitignore into the repo root
rsync -a --exclude='.git' --exclude='.gitignore' .tmp-init/ ./
rm -rf .tmp-init
```

- [ ] **Step 1.2:** Replace `package.json` so it pins versions known compatible with Expo SDK 51 and includes everything we need.

```json
{
  "name": "mahallelig",
  "version": "0.1.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "1.23.1",
    "expo": "~51.0.28",
    "expo-constants": "~16.0.2",
    "expo-linking": "~6.3.1",
    "expo-location": "~17.0.1",
    "expo-notifications": "~0.28.16",
    "expo-router": "~3.5.23",
    "expo-sensors": "~13.0.9",
    "expo-status-bar": "~1.12.1",
    "nativewind": "^4.0.36",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native": "0.74.5",
    "react-native-gesture-handler": "~2.16.1",
    "react-native-qrcode-svg": "^6.3.2",
    "react-native-reanimated": "~3.10.1",
    "react-native-safe-area-context": "4.10.5",
    "react-native-screens": "3.31.1",
    "react-native-svg": "15.2.0",
    "react-native-web": "~0.19.10",
    "tailwindcss": "^3.4.0",
    "victory-native": "^36.9.2",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/jest": "^29.5.12",
    "@types/react": "~18.2.79",
    "jest": "^29.7.0",
    "jest-expo": "~51.0.4",
    "typescript": "~5.3.3"
  },
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)/)"
    ]
  },
  "private": true
}
```

- [ ] **Step 1.3:** Install dependencies.

```bash
cd /home/batuhan4/github/mahallelig && npm install --no-audit --no-fund
```

- [ ] **Step 1.4:** Write `app.json`:

```json
{
  "expo": {
    "name": "MahalleLig",
    "slug": "mahallelig",
    "version": "0.1.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "scheme": "mahallelig",
    "newArchEnabled": false,
    "splash": {
      "backgroundColor": "#0F172A"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mahallelig.app",
      "infoPlist": {
        "NSMotionUsageDescription": "MahalleLig adımlarını sayar ve puana çevirir.",
        "NSLocationWhenInUseUsageDescription": "Aktif ulaşım rotanı kaydetmek için konuma ihtiyacımız var."
      }
    },
    "android": {
      "package": "com.mahallelig.app",
      "permissions": ["ACTIVITY_RECOGNITION", "ACCESS_FINE_LOCATION"]
    },
    "plugins": [
      "expo-router",
      "expo-location",
      "expo-notifications"
    ],
    "experiments": { "typedRoutes": true }
  }
}
```

- [ ] **Step 1.5:** Write `babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel"
    ],
    plugins: ["react-native-reanimated/plugin"]
  };
};
```

- [ ] **Step 1.6:** Write `metro.config.js`:

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });
```

- [ ] **Step 1.7:** Write `global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 1.8:** Write `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
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
```

- [ ] **Step 1.9:** Write `nativewind-env.d.ts`:

```ts
/// <reference types="nativewind/types" />
```

- [ ] **Step 1.10:** Replace `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "types": ["jest", "nativewind/types"]
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "nativewind-env.d.ts",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

- [ ] **Step 1.11:** Append to `.gitignore` (idempotent):

```
node_modules/
.expo/
.expo-shared/
dist/
web-build/
.env*.local
coverage/
*.tsbuildinfo
```

- [ ] **Step 1.12:** Replace `app/_layout.tsx` with a temporary placeholder so the project boots:

```tsx
import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

- [ ] **Step 1.13:** Add `app/index.tsx` placeholder:

```tsx
import { Text, View } from "react-native";
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-ink-900">
      <Text className="text-white">MahalleLig</Text>
    </View>
  );
}
```

- [ ] **Step 1.14:** Smoke test: run `npx expo export --platform web --output-dir dist-smoke` and confirm exit code 0. Clean up: `rm -rf dist-smoke`.

- [ ] **Step 1.15:** Commit.

```bash
git add -A
git commit -m "chore: scaffold Expo SDK 51 project with NativeWind, Zustand, Expo Router"
```

---

## Task 2: Theme, i18n, and Shared UI Primitives

**Files:**
- Create: `constants/theme.ts`, `constants/i18n.ts`, `components/Screen.tsx`, `components/Badge.tsx`

**Steps:**

- [ ] **Step 2.1:** Write `constants/theme.ts`:

```ts
export const palette = {
  brand: "#6366F1",
  brandDark: "#4338CA",
  accent: "#22C55E",
  ink900: "#0F172A",
  ink700: "#334155",
  ink500: "#64748B",
  ink300: "#CBD5E1",
  warn: "#F59E0B",
  danger: "#EF4444"
} as const;

export const partnerColors: Record<string, string> = {
  belpa: "#6366F1",
  municipal_sports: "#22C55E",
  culture: "#F59E0B",
  local: "#EC4899",
  transport: "#06B6D4"
};
```

- [ ] **Step 2.2:** Write `constants/i18n.ts` with every user-facing string used in the app, keyed for easy reference:

```ts
export const tr = {
  app: { name: "MahalleLig" },
  onboarding: {
    welcomeTitle: "MahalleLig'e Hoş Geldin",
    welcomeSubtitle: "Yürü, kazan, mahallene katkı sun.",
    continue: "Devam",
    pickNeighborhood: "Mahalleni seç",
    permissionsTitle: "Son adım",
    permissionsBody: "Adım sayımı ve aktif ulaşım rotaların için izin ver.",
    grantLocation: "Konuma izin ver",
    grantMotion: "Hareket sensörüne izin ver",
    grantNotifications: "Bildirimlere izin ver",
    finish: "Hadi Başla"
  },
  tabs: { today: "Bugün", league: "Lig", market: "Market", muni: "Belediye", profile: "Profil" },
  today: {
    greeting: (name: string) => `Merhaba ${name}`,
    todaysSteps: "Bugünki adım",
    todaysPoints: "MahallePuan",
    startActivity: "Aktivite Başlat",
    stopActivity: "Aktiviteyi Bitir",
    last7days: "Son 7 gün",
    sourcePedometer: "Pedometre",
    sourceDemo: "Demo Mode (10x)",
    activityTypeWalk: "Yürüyüş",
    activityTypeRun: "Koşu",
    activityTypeBike: "Bisiklet"
  },
  league: {
    title: "Mahalle Ligi",
    rank: (rank: number, total: number) => `${rank}. / ${total} mahalle`,
    tabInside: "Mahalle içi",
    tabOutside: "Mahalleler arası",
    seasonCountdown: (d: number, h: number) => `Sezon biter: ${d}g ${h}s`,
    weeklyMission: "Bu hafta arabasız market günü — +200 bonus",
    you: "Sen"
  },
  market: {
    title: "LigMarket",
    enoughPoints: "Yeterli puanın var ✓",
    needPoints: (n: number) => `${n.toLocaleString("tr-TR")} puan daha`,
    redeem: "Redeem et",
    categories: {
      belpa: "BELPA",
      municipal_sports: "Belediye Spor",
      culture: "Kültür",
      local: "Yerel İşletme",
      transport: "Ulaşım"
    }
  },
  reward: {
    redeemTitle: "Redeem onayla",
    confirm: "Onayla ve QR Üret",
    qrTitle: "Bu kodu kasiyere göster",
    qrSubtitle: (mins: number) => `${mins} dakika geçerli`,
    expired: "Süresi doldu",
    used: "Kullanıldı"
  },
  municipality: {
    title: "Belediye Paneli",
    activeCitizens: "Aktif vatandaş",
    weeklySteps: "Toplam adım/hafta",
    facilityVisits: "Tesis ziyareti",
    redeemed: "Redeem edilen ödül",
    topNeighborhoods: "Bu hafta en aktif 5 mahalle",
    lowAlert: (n: string) => `Düşük aktivite uyarısı: ${n}`,
    createMission: "Görev oluştur"
  },
  profile: {
    totalPoints: "Toplam puan",
    level: "Seviye",
    badges: "Rozetler",
    settings: "Ayarlar",
    notifications: "Bildirimler",
    language: "Dil",
    signOut: "Çıkış",
    demoMode: "Demo Mode (10x adım)",
    triggerPush: "Test push gönder"
  },
  feed: { title: "Sosyal Feed" },
  business: {
    title: "Yerel İşletme Paneli",
    customers: (n: number) => `Bu hafta ${n} müşteri MahallePuan kullandı`,
    topReward: "En sevilen ödül"
  },
  push: {
    overtakeTitle: "Mahalleni geçtiler!",
    overtakeBody: "Bu akşam yürüyüş yap +200 puan"
  },
  common: { loading: "Yükleniyor…", error: "Bir şeyler ters gitti" }
} as const;
```

- [ ] **Step 2.3:** Write `components/Screen.tsx`:

```tsx
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View } from "react-native";
import { ReactNode } from "react";

export function Screen({ children, scroll = true, className = "" }: { children: ReactNode; scroll?: boolean; className?: string }) {
  const Wrapper = scroll ? ScrollView : View;
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-ink-900">
      <Wrapper className={`flex-1 px-4 ${className}`} contentContainerClassName={scroll ? "pb-8" : undefined}>
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}
```

- [ ] **Step 2.4:** Write `components/Badge.tsx`:

```tsx
import { Text, View } from "react-native";

export function Badge({ label, tone = "brand" }: { label: string; tone?: "brand" | "accent" | "warn" | "ink" }) {
  const bg = { brand: "bg-brand-500", accent: "bg-accent-500", warn: "bg-amber-500", ink: "bg-ink-700" }[tone];
  return (
    <View className={`${bg} rounded-full px-3 py-1`}>
      <Text className="text-white text-xs font-semibold">{label}</Text>
    </View>
  );
}
```

- [ ] **Step 2.5:** Commit.

```bash
git add -A && git commit -m "feat(theme): add palette, Turkish i18n strings, Screen + Badge primitives"
```

---

## Task 3: Seed Data (Neighborhoods, Rewards, Fake Users, Fake Activities, Feed)

**Files:**
- Create: `constants/seed/neighborhoods.ts`, `constants/seed/rewards.ts`, `constants/seed/fakeUsers.ts`, `constants/seed/fakeActivities.ts`, `constants/seed/feed.ts`
- Create: `__tests__/seed.test.ts`

**Steps:**

- [ ] **Step 3.1:** Write `constants/seed/neighborhoods.ts` — 32 İstanbul mahallesi across multiple districts. Each must include `nid`, `name`, `district`, `city`, `populationProxy` (1000–8000), and a deterministic `weeklyPoints` (we'll compute, but keep a seed value for read-only consumers).

```ts
export type Neighborhood = {
  nid: string;
  name: string;
  district: string;
  city: string;
  weeklyPoints: number;
  populationProxy: number;
};

export const NEIGHBORHOODS: Neighborhood[] = [
  { nid: "caferaga", name: "Caferağa", district: "Kadıköy", city: "İstanbul", weeklyPoints: 48200, populationProxy: 6200 },
  { nid: "moda", name: "Moda", district: "Kadıköy", city: "İstanbul", weeklyPoints: 51100, populationProxy: 5800 },
  { nid: "fenerbahce", name: "Fenerbahçe", district: "Kadıköy", city: "İstanbul", weeklyPoints: 38400, populationProxy: 4900 },
  { nid: "kozyatagi", name: "Kozyatağı", district: "Kadıköy", city: "İstanbul", weeklyPoints: 41700, populationProxy: 5100 },
  { nid: "suadiye", name: "Suadiye", district: "Kadıköy", city: "İstanbul", weeklyPoints: 22800, populationProxy: 4400 },
  { nid: "bostanci", name: "Bostancı", district: "Kadıköy", city: "İstanbul", weeklyPoints: 34900, populationProxy: 4600 },
  { nid: "goztepe", name: "Göztepe", district: "Kadıköy", city: "İstanbul", weeklyPoints: 31200, populationProxy: 4700 },
  { nid: "erenkoy", name: "Erenköy", district: "Kadıköy", city: "İstanbul", weeklyPoints: 29600, populationProxy: 4200 },
  { nid: "acibadem", name: "Acıbadem", district: "Kadıköy", city: "İstanbul", weeklyPoints: 27100, populationProxy: 3900 },
  { nid: "fikirtepe", name: "Fikirtepe", district: "Kadıköy", city: "İstanbul", weeklyPoints: 24800, populationProxy: 3700 },
  { nid: "cihangir", name: "Cihangir", district: "Beyoğlu", city: "İstanbul", weeklyPoints: 45300, populationProxy: 3300 },
  { nid: "galata", name: "Galata", district: "Beyoğlu", city: "İstanbul", weeklyPoints: 39800, populationProxy: 3100 },
  { nid: "kasimpasa", name: "Kasımpaşa", district: "Beyoğlu", city: "İstanbul", weeklyPoints: 21900, populationProxy: 4500 },
  { nid: "tarlabasi", name: "Tarlabaşı", district: "Beyoğlu", city: "İstanbul", weeklyPoints: 19400, populationProxy: 5200 },
  { nid: "etiler", name: "Etiler", district: "Beşiktaş", city: "İstanbul", weeklyPoints: 36100, populationProxy: 3800 },
  { nid: "bebek", name: "Bebek", district: "Beşiktaş", city: "İstanbul", weeklyPoints: 33500, populationProxy: 2900 },
  { nid: "arnavutkoy", name: "Arnavutköy", district: "Beşiktaş", city: "İstanbul", weeklyPoints: 28200, populationProxy: 2400 },
  { nid: "ortakoy", name: "Ortaköy", district: "Beşiktaş", city: "İstanbul", weeklyPoints: 31700, populationProxy: 2700 },
  { nid: "levent", name: "Levent", district: "Beşiktaş", city: "İstanbul", weeklyPoints: 26800, populationProxy: 3400 },
  { nid: "nisantasi", name: "Nişantaşı", district: "Şişli", city: "İstanbul", weeklyPoints: 35600, populationProxy: 3600 },
  { nid: "mecidiyekoy", name: "Mecidiyeköy", district: "Şişli", city: "İstanbul", weeklyPoints: 23400, populationProxy: 5800 },
  { nid: "kurtulus", name: "Kurtuluş", district: "Şişli", city: "İstanbul", weeklyPoints: 27800, populationProxy: 4200 },
  { nid: "fatih_sultanahmet", name: "Sultanahmet", district: "Fatih", city: "İstanbul", weeklyPoints: 30100, populationProxy: 3300 },
  { nid: "fatih_balat", name: "Balat", district: "Fatih", city: "İstanbul", weeklyPoints: 24900, populationProxy: 3800 },
  { nid: "fatih_fener", name: "Fener", district: "Fatih", city: "İstanbul", weeklyPoints: 22500, populationProxy: 3500 },
  { nid: "uskudar_kuzguncuk", name: "Kuzguncuk", district: "Üsküdar", city: "İstanbul", weeklyPoints: 26400, populationProxy: 2800 },
  { nid: "uskudar_beylerbeyi", name: "Beylerbeyi", district: "Üsküdar", city: "İstanbul", weeklyPoints: 23700, populationProxy: 3200 },
  { nid: "uskudar_camlica", name: "Çamlıca", district: "Üsküdar", city: "İstanbul", weeklyPoints: 20800, populationProxy: 3900 },
  { nid: "atasehir_atattepe", name: "Atatürk Mahallesi", district: "Ataşehir", city: "İstanbul", weeklyPoints: 25600, populationProxy: 4800 },
  { nid: "maltepe_idealtepe", name: "İdealtepe", district: "Maltepe", city: "İstanbul", weeklyPoints: 22100, populationProxy: 4300 },
  { nid: "bakirkoy_atakoy", name: "Ataköy", district: "Bakırköy", city: "İstanbul", weeklyPoints: 28900, populationProxy: 5100 },
  { nid: "sariyer_yenikoy", name: "Yeniköy", district: "Sarıyer", city: "İstanbul", weeklyPoints: 26700, populationProxy: 2600 }
];
```

- [ ] **Step 3.2:** Write `constants/seed/rewards.ts` — 20 rewards across 5 partner categories.

```ts
export type RewardPartner = "belpa" | "municipal_sports" | "culture" | "local" | "transport";

export type Reward = {
  rid: string;
  title: string;
  partner: RewardPartner;
  cost: number;
  description: string;
  termsTr: string;
};

export const REWARDS: Reward[] = [
  { rid: "belpa-coffee-30", title: "BELPA Kafe %30 içecek", partner: "belpa", cost: 10000, description: "BELPA kafelerinde %30 içecek indirimi", termsTr: "Tek kullanımlık. 7 gün geçerli." },
  { rid: "belpa-meal-20", title: "BELPA Kafe %20 menü", partner: "belpa", cost: 14000, description: "BELPA günün menüsünde %20 indirim", termsTr: "Tek kullanımlık. Hafta sonu geçerli değil." },
  { rid: "belpa-breakfast", title: "BELPA Kahvaltı 1+1", partner: "belpa", cost: 18000, description: "Cumartesi kahvaltıda 1+1", termsTr: "Sadece cumartesi 09:00-12:00." },
  { rid: "muni-sports-day", title: "Spor Tesisi · 1 gün ücretsiz", partner: "municipal_sports", cost: 25000, description: "Belediye spor tesisinde 1 günlük tam giriş", termsTr: "Sauna hariç. 14 gün içinde kullanılmalı." },
  { rid: "muni-pool-3", title: "Yüzme Havuzu · 3 giriş", partner: "municipal_sports", cost: 32000, description: "Belediye havuzunda 3 ayrı giriş", termsTr: "30 gün içinde kullanılmalı." },
  { rid: "muni-yoga-month", title: "Yoga · 1 ay indirim", partner: "municipal_sports", cost: 28000, description: "Belediye yoga kursunda %50", termsTr: "Yeni kayıtlar için." },
  { rid: "culture-ticket-50", title: "Kültür Merkezi %50 bilet", partner: "culture", cost: 15000, description: "Tiyatro/konser biletinde %50", termsTr: "Belediye kültür merkezi etkinlikleri." },
  { rid: "culture-museum", title: "Belediye Müzesi · ücretsiz", partner: "culture", cost: 9000, description: "Müze giriş ücretsiz", termsTr: "1 kişi. 30 gün geçerli." },
  { rid: "culture-workshop", title: "Atölye %30", partner: "culture", cost: 12000, description: "Kültür merkezi atölye %30", termsTr: "Boş kontenjana göre." },
  { rid: "local-mehmet-coffee", title: "Mehmet Usta · Filtre kahve", partner: "local", cost: 8000, description: "Caferağa Mehmet Usta'da ücretsiz filtre kahve", termsTr: "Tek kullanımlık." },
  { rid: "local-ayse-simit", title: "Ayşe Teyze · Simit + çay", partner: "local", cost: 4000, description: "Mahalle fırınında simit + çay", termsTr: "Hafta içi 08:00-10:00." },
  { rid: "local-bike-service", title: "Bisiklet Servisi %25", partner: "local", cost: 20000, description: "Anlaşmalı bisikletçide bakım %25", termsTr: "30 gün geçerli." },
  { rid: "local-bookshop", title: "Mahalle Kitapçısı %15", partner: "local", cost: 11000, description: "Yerel kitapçıda %15", termsTr: "Yeni kitap, tek kullanım." },
  { rid: "local-yoga-studio", title: "Mahalle Yoga · Deneme dersi", partner: "local", cost: 13000, description: "Yerel yoga stüdyosunda ücretsiz deneme", termsTr: "Yeni üyeler." },
  { rid: "local-greengrocer", title: "Manav · ₺50 indirim", partner: "local", cost: 9500, description: "Mahalle manavında ₺50 indirim", termsTr: "₺200 ve üzeri alışverişte." },
  { rid: "transport-bus-5", title: "İETT · 5 ücretsiz geçiş", partner: "transport", cost: 16000, description: "İETT otobüsünde 5 geçiş", termsTr: "İstanbulkart'a yüklenir." },
  { rid: "transport-bike-rent", title: "Bisiklet Kiralama · 2 saat", partner: "transport", cost: 8500, description: "Belediye bisikleti 2 saat ücretsiz", termsTr: "Hafta içi geçerli." },
  { rid: "transport-ferry", title: "Vapur · 3 geçiş", partner: "transport", cost: 10500, description: "Şehir hatları 3 vapur geçişi", termsTr: "Karayolu hariç." },
  { rid: "transport-park-ride", title: "Park Et & Devam Et %20", partner: "transport", cost: 7000, description: "Belediye otoparkında %20", termsTr: "İlk 4 saat." },
  { rid: "transport-scooter", title: "Scooter · 30 dk", partner: "transport", cost: 6000, description: "Belediye scooter 30 dk ücretsiz", termsTr: "Tek kullanım." }
];
```

- [ ] **Step 3.3:** Write `constants/seed/fakeUsers.ts` — 50 deterministic fake users, distributed across the first 8 neighborhoods so the leaderboard has dense data.

```ts
import { NEIGHBORHOODS } from "./neighborhoods";

export type FakeUser = {
  uid: string;
  displayName: string;
  neighborhoodId: string;
  weeklyPoints: number;
  totalPoints: number;
  avatarSeed: string;
};

const FIRST = ["Ahmet", "Mehmet", "Ayşe", "Fatma", "Murat", "Zeynep", "Can", "Elif", "Emre", "Selin", "Burak", "Deniz", "Cem", "Ece", "Berk", "Naz", "Onur", "Pelin", "Kerem", "Sıla"];
const LAST = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Aydın", "Polat", "Arslan", "Doğan", "Koç"];

const seedRand = (s: number) => () => {
  s = (s * 9301 + 49297) % 233280;
  return s / 233280;
};

export const FAKE_USERS: FakeUser[] = (() => {
  const rand = seedRand(42);
  const pool = NEIGHBORHOODS.slice(0, 8);
  return Array.from({ length: 50 }, (_, i) => {
    const f = FIRST[Math.floor(rand() * FIRST.length)];
    const l = LAST[Math.floor(rand() * LAST.length)];
    const n = pool[i % pool.length];
    const weeklyPoints = Math.floor(rand() * 4500) + 500;
    const totalPoints = weeklyPoints * (3 + Math.floor(rand() * 6));
    return {
      uid: `seed-${i.toString().padStart(2, "0")}`,
      displayName: `${f} ${l[0]}.`,
      neighborhoodId: n.nid,
      weeklyPoints,
      totalPoints,
      avatarSeed: `seed-${i}`
    };
  });
})();
```

- [ ] **Step 3.4:** Write `constants/seed/fakeActivities.ts` — 200 deterministic fake activities spread over the last 7 days, used for the weekly chart and feed.

```ts
import { FAKE_USERS } from "./fakeUsers";

export type ActivityType = "walk" | "run" | "bike";

export type FakeActivity = {
  aid: string;
  uid: string;
  type: ActivityType;
  steps: number;
  distanceKm: number;
  durationMin: number;
  points: number;
  startedAt: number;
};

const TYPES: ActivityType[] = ["walk", "run", "bike"];
const rand = (() => {
  let s = 1337;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
})();

const DAY = 24 * 60 * 60 * 1000;
const now = Date.UTC(2026, 4, 17, 12);

export const FAKE_ACTIVITIES: FakeActivity[] = Array.from({ length: 200 }, (_, i) => {
  const u = FAKE_USERS[Math.floor(rand() * FAKE_USERS.length)];
  const type = TYPES[Math.floor(rand() * TYPES.length)];
  const distanceKm = +(rand() * 6 + 0.5).toFixed(2);
  const steps = type === "walk" ? Math.floor(distanceKm * 1300) : type === "run" ? Math.floor(distanceKm * 1100) : 0;
  const durationMin = Math.floor(distanceKm * (type === "bike" ? 4 : type === "run" ? 6 : 12));
  const pointsPerKm = { walk: 50, run: 80, bike: 30 }[type];
  const points = Math.min(1000, Math.round(distanceKm * pointsPerKm));
  const dayOffset = Math.floor(rand() * 7);
  return {
    aid: `seed-act-${i}`,
    uid: u.uid,
    type,
    steps,
    distanceKm,
    durationMin,
    points,
    startedAt: now - dayOffset * DAY - Math.floor(rand() * DAY)
  };
});
```

- [ ] **Step 3.5:** Write `constants/seed/feed.ts`:

```ts
export type FeedPost = { id: string; author: string; text: string; minutesAgo: number; reactions: number };

export const FEED: FeedPost[] = [
  { id: "f1", author: "Ahmet Y.", text: "3km koştu · sabah yürüyüşü", minutesAgo: 12, reactions: 8 },
  { id: "f2", author: "Caferağa Mahallesi", text: "Haftalık 1. olduk 🏆", minutesAgo: 45, reactions: 41 },
  { id: "f3", author: "Zeynep K.", text: "BELPA kafede kahve aldım, +%30 indirim ☕", minutesAgo: 90, reactions: 14 },
  { id: "f4", author: "Mehmet D.", text: "Bugünki adım: 9.420 — kişisel rekor", minutesAgo: 130, reactions: 22 },
  { id: "f5", author: "Belediye", text: "Yeni görev: Cuma arabasız market günü — +200 bonus", minutesAgo: 240, reactions: 73 },
  { id: "f6", author: "Elif Ş.", text: "Sahil bisikleti — 7km", minutesAgo: 360, reactions: 18 },
  { id: "f7", author: "Moda Mahallesi", text: "Caferağa'yı geçtik, 1.'yiz", minutesAgo: 420, reactions: 55 },
  { id: "f8", author: "Berk A.", text: "Mehmet Usta'dan filtre kahve aldım — puanla bedava", minutesAgo: 600, reactions: 12 },
  { id: "f9", author: "Selin D.", text: "Yoga dersine başladım, ilk hafta indirim 🙏", minutesAgo: 720, reactions: 9 },
  { id: "f10", author: "Onur P.", text: "Mahalle yürüyüşü cuma 19:00 buluşuyoruz", minutesAgo: 900, reactions: 31 }
];
```

- [ ] **Step 3.6:** Write `__tests__/seed.test.ts`:

```ts
import { NEIGHBORHOODS } from "@/constants/seed/neighborhoods";
import { REWARDS } from "@/constants/seed/rewards";
import { FAKE_USERS } from "@/constants/seed/fakeUsers";
import { FAKE_ACTIVITIES } from "@/constants/seed/fakeActivities";

describe("seed data", () => {
  test("32 neighborhoods with unique nid", () => {
    expect(NEIGHBORHOODS).toHaveLength(32);
    expect(new Set(NEIGHBORHOODS.map((n) => n.nid)).size).toBe(32);
  });
  test("20 rewards across 5 partners", () => {
    expect(REWARDS).toHaveLength(20);
    expect(new Set(REWARDS.map((r) => r.partner))).toEqual(new Set(["belpa", "municipal_sports", "culture", "local", "transport"]));
  });
  test("50 fake users with unique uids", () => {
    expect(FAKE_USERS).toHaveLength(50);
    expect(new Set(FAKE_USERS.map((u) => u.uid)).size).toBe(50);
  });
  test("200 fake activities, all reference known users", () => {
    expect(FAKE_ACTIVITIES).toHaveLength(200);
    const userIds = new Set(FAKE_USERS.map((u) => u.uid));
    for (const a of FAKE_ACTIVITIES) expect(userIds.has(a.uid)).toBe(true);
  });
  test("fake activities respect daily cap of 1000 points", () => {
    for (const a of FAKE_ACTIVITIES) expect(a.points).toBeLessThanOrEqual(1000);
  });
});
```

- [ ] **Step 3.7:** Run: `npm test -- --testPathPattern seed`. Expected: PASS.

- [ ] **Step 3.8:** Commit.

```bash
git add -A && git commit -m "feat(seed): add 32 neighborhoods, 20 rewards, 50 fake users, 200 fake activities, feed posts"
```

---

## Task 4: Domain Services (points, qr) + Tests

**Files:**
- Create: `services/points.ts`, `services/qr.ts`
- Create: `__tests__/points.test.ts`, `__tests__/qr.test.ts`

**Steps:**

- [ ] **Step 4.1:** Write `services/points.ts`:

```ts
import type { ActivityType } from "@/constants/seed/fakeActivities";

export const DAILY_POINT_CAP = 1000;

const PER_KM: Record<ActivityType, number> = { walk: 50, run: 80, bike: 30 };
const PER_THOUSAND_STEPS = 10;

export function pointsForActivity(opts: {
  type: ActivityType;
  steps: number;
  distanceKm: number;
  activeTransport?: boolean;
}): number {
  const stepPts = Math.floor(opts.steps / 1000) * PER_THOUSAND_STEPS;
  const distancePts = Math.round(opts.distanceKm * PER_KM[opts.type]);
  const base = Math.max(stepPts, distancePts);
  const bonus = opts.activeTransport ? Math.round(base * 0.2) : 0;
  return Math.min(DAILY_POINT_CAP, base + bonus);
}

export function levelFromPoints(totalPoints: number): number {
  return Math.floor(totalPoints / 1000);
}

export function applyDailyCap(pointsToday: number, earned: number): number {
  const remaining = Math.max(0, DAILY_POINT_CAP - pointsToday);
  return Math.min(earned, remaining);
}
```

- [ ] **Step 4.2:** Write `__tests__/points.test.ts`:

```ts
import { pointsForActivity, levelFromPoints, applyDailyCap, DAILY_POINT_CAP } from "@/services/points";

describe("points", () => {
  test("walk: 1km ≈ 50 pts", () => {
    expect(pointsForActivity({ type: "walk", steps: 1300, distanceKm: 1 })).toBe(50);
  });
  test("run: 1km ≈ 80 pts", () => {
    expect(pointsForActivity({ type: "run", steps: 1100, distanceKm: 1 })).toBe(80);
  });
  test("bike: 1km ≈ 30 pts", () => {
    expect(pointsForActivity({ type: "bike", steps: 0, distanceKm: 1 })).toBe(30);
  });
  test("active transport bonus +20%", () => {
    const base = pointsForActivity({ type: "walk", steps: 2600, distanceKm: 2 });
    const boosted = pointsForActivity({ type: "walk", steps: 2600, distanceKm: 2, activeTransport: true });
    expect(boosted).toBe(base + Math.round(base * 0.2));
  });
  test("daily cap = 1000", () => {
    expect(pointsForActivity({ type: "run", steps: 0, distanceKm: 100 })).toBe(DAILY_POINT_CAP);
  });
  test("levelFromPoints", () => {
    expect(levelFromPoints(0)).toBe(0);
    expect(levelFromPoints(999)).toBe(0);
    expect(levelFromPoints(1000)).toBe(1);
    expect(levelFromPoints(5432)).toBe(5);
  });
  test("applyDailyCap respects remaining budget", () => {
    expect(applyDailyCap(800, 500)).toBe(200);
    expect(applyDailyCap(1000, 100)).toBe(0);
    expect(applyDailyCap(0, 250)).toBe(250);
  });
});
```

- [ ] **Step 4.3:** Write `services/qr.ts`:

```ts
export type QrPayload = {
  v: 1;
  uid: string;
  rid: string;
  rdid: string;
  expiresAt: number;
};

export const REDEMPTION_TTL_MIN = 15;

export function buildQrPayload(opts: { uid: string; rid: string; rdid: string; now?: number }): QrPayload {
  const now = opts.now ?? Date.now();
  return { v: 1, uid: opts.uid, rid: opts.rid, rdid: opts.rdid, expiresAt: now + REDEMPTION_TTL_MIN * 60 * 1000 };
}

export function encodeQr(p: QrPayload): string {
  return `mahallelig://r?v=${p.v}&u=${encodeURIComponent(p.uid)}&r=${encodeURIComponent(p.rid)}&i=${encodeURIComponent(p.rdid)}&e=${p.expiresAt}`;
}

export function isExpired(p: QrPayload, now = Date.now()): boolean {
  return now >= p.expiresAt;
}
```

- [ ] **Step 4.4:** Write `__tests__/qr.test.ts`:

```ts
import { buildQrPayload, encodeQr, isExpired, REDEMPTION_TTL_MIN } from "@/services/qr";

describe("qr", () => {
  test("payload has TTL", () => {
    const t0 = 1_700_000_000_000;
    const p = buildQrPayload({ uid: "u1", rid: "r1", rdid: "rd1", now: t0 });
    expect(p.expiresAt - t0).toBe(REDEMPTION_TTL_MIN * 60 * 1000);
  });
  test("encode round-trip contains all fields", () => {
    const p = buildQrPayload({ uid: "u1", rid: "r1", rdid: "rd1", now: 1 });
    const s = encodeQr(p);
    expect(s).toContain("u=u1");
    expect(s).toContain("r=r1");
    expect(s).toContain("i=rd1");
  });
  test("isExpired flips after TTL", () => {
    const p = buildQrPayload({ uid: "u", rid: "r", rdid: "i", now: 0 });
    expect(isExpired(p, REDEMPTION_TTL_MIN * 60 * 1000 - 1)).toBe(false);
    expect(isExpired(p, REDEMPTION_TTL_MIN * 60 * 1000)).toBe(true);
  });
});
```

- [ ] **Step 4.5:** Run tests: `npm test -- --testPathPattern "(points|qr)"`. Expect PASS.

- [ ] **Step 4.6:** Commit.

```bash
git add -A && git commit -m "feat(services): points formula + qr payload, with tests"
```

---

## Task 5: League Service & Tests

**Files:**
- Create: `services/league.ts`, `__tests__/league.test.ts`

**Steps:**

- [ ] **Step 5.1:** Write `services/league.ts`:

```ts
import { NEIGHBORHOODS, type Neighborhood } from "@/constants/seed/neighborhoods";
import { FAKE_USERS, type FakeUser } from "@/constants/seed/fakeUsers";

export type LeagueRow = { nid: string; name: string; district: string; weeklyPoints: number; rank: number };
export type UserLeagueRow = { uid: string; displayName: string; weeklyPoints: number; rank: number; isYou: boolean };

export function neighborhoodLeaderboard(extra: { weeklyPointsByNid?: Record<string, number> } = {}): LeagueRow[] {
  const merged = NEIGHBORHOODS.map((n) => ({
    ...n,
    weeklyPoints: n.weeklyPoints + (extra.weeklyPointsByNid?.[n.nid] ?? 0)
  }));
  return merged
    .sort((a, b) => b.weeklyPoints - a.weeklyPoints)
    .map((n, i) => ({ nid: n.nid, name: n.name, district: n.district, weeklyPoints: n.weeklyPoints, rank: i + 1 }));
}

export function userLeaderboardForNeighborhood(nid: string, you: { uid: string; displayName: string; weeklyPoints: number } | null): UserLeagueRow[] {
  const peers = FAKE_USERS.filter((u) => u.neighborhoodId === nid).map(anonymize);
  const all = you ? [...peers, { uid: you.uid, displayName: you.displayName, weeklyPoints: you.weeklyPoints, isYou: true }] : peers;
  return all
    .sort((a, b) => b.weeklyPoints - a.weeklyPoints)
    .map((u, i) => ({ ...u, rank: i + 1 }));
}

function anonymize(u: FakeUser, i: number): Omit<UserLeagueRow, "rank"> {
  return { uid: u.uid, displayName: `Komşu #${i + 1}`, weeklyPoints: u.weeklyPoints, isYou: false };
}

export function findNeighborhood(nid: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.nid === nid);
}

export function seasonCountdown(now = Date.now()): { days: number; hours: number } {
  const end = new Date(now);
  const dow = end.getUTCDay(); // 0=Sun
  const daysUntilSunday = (7 - dow) % 7 || 7;
  end.setUTCDate(end.getUTCDate() + daysUntilSunday);
  end.setUTCHours(0, 0, 0, 0);
  const diff = end.getTime() - now;
  return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000) };
}
```

- [ ] **Step 5.2:** Write `__tests__/league.test.ts`:

```ts
import { neighborhoodLeaderboard, userLeaderboardForNeighborhood, seasonCountdown } from "@/services/league";
import { NEIGHBORHOODS } from "@/constants/seed/neighborhoods";

describe("league", () => {
  test("neighborhoodLeaderboard sorted desc", () => {
    const rows = neighborhoodLeaderboard();
    expect(rows).toHaveLength(NEIGHBORHOODS.length);
    for (let i = 1; i < rows.length; i++) expect(rows[i - 1].weeklyPoints).toBeGreaterThanOrEqual(rows[i].weeklyPoints);
    expect(rows[0].rank).toBe(1);
  });
  test("delta adds to base weeklyPoints", () => {
    const base = neighborhoodLeaderboard();
    const boosted = neighborhoodLeaderboard({ weeklyPointsByNid: { caferaga: 100000 } });
    expect(boosted.find((r) => r.nid === "caferaga")!.rank).toBe(1);
    expect(boosted.find((r) => r.nid === "caferaga")!.weeklyPoints).toBeGreaterThan(base.find((r) => r.nid === "caferaga")!.weeklyPoints);
  });
  test("userLeaderboardForNeighborhood includes you with isYou flag", () => {
    const rows = userLeaderboardForNeighborhood("caferaga", { uid: "me", displayName: "Murat", weeklyPoints: 9999 });
    const me = rows.find((r) => r.uid === "me");
    expect(me?.isYou).toBe(true);
    expect(rows[0].uid).toBe("me");
  });
  test("anonymous peers labeled Komşu #N", () => {
    const rows = userLeaderboardForNeighborhood("caferaga", null);
    for (const r of rows) expect(r.displayName).toMatch(/^Komşu #/);
  });
  test("seasonCountdown returns non-negative days/hours", () => {
    const c = seasonCountdown();
    expect(c.days).toBeGreaterThanOrEqual(0);
    expect(c.hours).toBeGreaterThanOrEqual(0);
  });
});
```

- [ ] **Step 5.3:** Run: `npm test -- --testPathPattern league`. Expect PASS.

- [ ] **Step 5.4:** Commit.

```bash
git add -A && git commit -m "feat(league): leaderboard + season countdown with tests"
```

---

## Task 6: Backend Adapter, Pedometer, Location, Notifications, Demo Mode

**Files:**
- Create: `services/backend/types.ts`, `services/backend/seedBackend.ts`, `services/backend/firebaseBackend.ts`, `services/backend/index.ts`
- Create: `services/pedometer.ts`, `services/location.ts`, `services/notifications.ts`, `services/demoMode.ts`

**Steps:**

- [ ] **Step 6.1:** Write `services/backend/types.ts`:

```ts
import type { ActivityType } from "@/constants/seed/fakeActivities";

export type UserProfile = {
  uid: string;
  name: string;
  neighborhoodId: string;
  totalPoints: number;
  level: number;
  badges: string[];
  avatarSeed: string;
  createdAt: number;
};

export type ActivityRecord = {
  aid: string;
  uid: string;
  type: ActivityType;
  steps: number;
  distanceKm: number;
  durationMin: number;
  points: number;
  startedAt: number;
  endedAt: number;
};

export type RedemptionRecord = {
  rdid: string;
  uid: string;
  rid: string;
  qrPayload: string;
  status: "active" | "used" | "expired";
  createdAt: number;
  expiresAt: number;
};

export interface Backend {
  recordActivity(a: ActivityRecord): Promise<void>;
  recordRedemption(r: RedemptionRecord): Promise<void>;
  listRecentActivities(uid: string): Promise<ActivityRecord[]>;
  listRedemptions(uid: string): Promise<RedemptionRecord[]>;
}
```

- [ ] **Step 6.2:** Write `services/backend/seedBackend.ts`:

```ts
import type { ActivityRecord, Backend, RedemptionRecord } from "./types";

const activities = new Map<string, ActivityRecord[]>();
const redemptions = new Map<string, RedemptionRecord[]>();

export const seedBackend: Backend = {
  async recordActivity(a) {
    const arr = activities.get(a.uid) ?? [];
    arr.unshift(a);
    activities.set(a.uid, arr);
  },
  async recordRedemption(r) {
    const arr = redemptions.get(r.uid) ?? [];
    arr.unshift(r);
    redemptions.set(r.uid, arr);
  },
  async listRecentActivities(uid) {
    return activities.get(uid) ?? [];
  },
  async listRedemptions(uid) {
    return redemptions.get(uid) ?? [];
  }
};
```

- [ ] **Step 6.3:** Write `services/backend/firebaseBackend.ts` (stub that throws if invoked without configuration — kept off by default):

```ts
import type { Backend } from "./types";

export function makeFirebaseBackend(_config: Record<string, string>): Backend {
  throw new Error("firebaseBackend not yet wired — set EXPO_PUBLIC_FIREBASE_API_KEY etc. and implement.");
}
```

- [ ] **Step 6.4:** Write `services/backend/index.ts`:

```ts
import { seedBackend } from "./seedBackend";
import type { Backend } from "./types";

export const backend: Backend = seedBackend;
export type { Backend } from "./types";
```

- [ ] **Step 6.5:** Write `services/pedometer.ts`:

```ts
import { Pedometer } from "expo-sensors";
import { Platform } from "react-native";

export type StepSubscription = { remove: () => void };
export type StepListener = (stepsThisInterval: number) => void;

export async function isAvailable(): Promise<boolean> {
  try {
    return await Pedometer.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function getStepsToday(): Promise<number> {
  if (Platform.OS === "web") return 0;
  const end = new Date();
  const start = new Date(end);
  start.setHours(0, 0, 0, 0);
  try {
    const r = await Pedometer.getStepCountAsync(start, end);
    return r.steps ?? 0;
  } catch {
    return 0;
  }
}

export function watchSteps(listener: StepListener): StepSubscription {
  try {
    const sub = Pedometer.watchStepCount((e) => listener(e.steps));
    return { remove: () => sub.remove() };
  } catch {
    return { remove: () => {} };
  }
}
```

- [ ] **Step 6.6:** Write `services/location.ts`:

```ts
import * as Location from "expo-location";

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

export type Route = { points: { lat: number; lon: number; t: number }[]; distanceKm: number };

export function emptyRoute(): Route {
  return { points: [], distanceKm: 0 };
}

export function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(la1) * Math.cos(la2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function appendRoutePoint(route: Route, lat: number, lon: number, t = Date.now()): Route {
  const last = route.points[route.points.length - 1];
  const seg = last ? haversineKm(last, { lat, lon }) : 0;
  return { points: [...route.points, { lat, lon, t }], distanceKm: route.distanceKm + seg };
}
```

- [ ] **Step 6.7:** Add a route test. Append to `__tests__/qr.test.ts` (or create `__tests__/location.test.ts`):

```ts
import { appendRoutePoint, emptyRoute, haversineKm } from "@/services/location";

describe("location", () => {
  test("haversineKm zero for identical points", () => {
    expect(haversineKm({ lat: 41, lon: 29 }, { lat: 41, lon: 29 })).toBe(0);
  });
  test("appendRoutePoint accumulates distance", () => {
    let r = emptyRoute();
    r = appendRoutePoint(r, 41.0, 29.0, 0);
    r = appendRoutePoint(r, 41.001, 29.0, 1000);
    expect(r.points).toHaveLength(2);
    expect(r.distanceKm).toBeGreaterThan(0);
  });
});
```

Save as `__tests__/location.test.ts`.

- [ ] **Step 6.8:** Write `services/notifications.ts`:

```ts
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function fireLocal({ title, body }: { title: string; body: string }) {
  if (Platform.OS === "web") return;
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null
  });
}
```

- [ ] **Step 6.9:** Write `services/demoMode.ts`:

```ts
export type DemoStepListener = (stepsThisTick: number) => void;

export function startDemoStepStream(listener: DemoStepListener, intervalMs = 100, stepsPerTick = 5) {
  const id = setInterval(() => listener(stepsPerTick), intervalMs);
  return { remove: () => clearInterval(id) };
}
```

- [ ] **Step 6.10:** Run all tests: `npm test`. Expect PASS for points, qr, seed, league, location.

- [ ] **Step 6.11:** Commit.

```bash
git add -A && git commit -m "feat(services): backend adapter, pedometer, location, notifications, demo mode"
```

---

## Task 7: Zustand Stores

**Files:**
- Create: `store/useUserStore.ts`, `store/useActivityStore.ts`, `store/useLeagueStore.ts`, `store/useRedemptionStore.ts`, `store/useSettingsStore.ts`

**Steps:**

- [ ] **Step 7.1:** Write `store/useUserStore.ts`:

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { levelFromPoints } from "@/services/points";

export type User = {
  uid: string;
  name: string;
  neighborhoodId: string;
  totalPoints: number;
  badges: string[];
  avatarSeed: string;
  createdAt: number;
};

type State = {
  user: User | null;
  onboarded: boolean;
  setUser: (u: User) => void;
  setOnboarded: (v: boolean) => void;
  addPoints: (p: number) => void;
  reset: () => void;
};

function genUid() {
  return "u-" + Math.random().toString(36).slice(2, 10);
}

export const useUserStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      onboarded: false,
      setUser: (u) => set({ user: u }),
      setOnboarded: (v) => set({ onboarded: v }),
      addPoints: (p) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, totalPoints: u.totalPoints + p } });
      },
      reset: () => set({ user: null, onboarded: false })
    }),
    {
      name: "mahallelig-user",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export function levelOfUser(u: User | null): number {
  return u ? levelFromPoints(u.totalPoints) : 0;
}

export function makeNewUser(input: { name: string; neighborhoodId: string }): User {
  return {
    uid: genUid(),
    name: input.name,
    neighborhoodId: input.neighborhoodId,
    totalPoints: 0,
    badges: [],
    avatarSeed: input.name.toLowerCase().replace(/\s+/g, "-"),
    createdAt: Date.now()
  };
}
```

- [ ] **Step 7.2:** Write `store/useActivityStore.ts`:

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ActivityRecord } from "@/services/backend/types";

type State = {
  todaySteps: number;
  todayPoints: number;
  history: ActivityRecord[];
  liveActivity: { type: ActivityRecord["type"]; startedAt: number; steps: number; distanceKm: number } | null;
  addTodaySteps: (n: number) => void;
  addTodayPoints: (n: number) => void;
  startLive: (type: ActivityRecord["type"]) => void;
  pushLiveSteps: (n: number) => void;
  pushLiveDistance: (km: number) => void;
  endLive: () => { type: ActivityRecord["type"]; steps: number; distanceKm: number; durationMin: number } | null;
  pushHistory: (r: ActivityRecord) => void;
  resetDay: () => void;
};

export const useActivityStore = create<State>()(
  persist(
    (set, get) => ({
      todaySteps: 0,
      todayPoints: 0,
      history: [],
      liveActivity: null,
      addTodaySteps: (n) => set({ todaySteps: get().todaySteps + n }),
      addTodayPoints: (n) => set({ todayPoints: get().todayPoints + n }),
      startLive: (type) => set({ liveActivity: { type, startedAt: Date.now(), steps: 0, distanceKm: 0 } }),
      pushLiveSteps: (n) => {
        const l = get().liveActivity;
        if (l) set({ liveActivity: { ...l, steps: l.steps + n } });
      },
      pushLiveDistance: (km) => {
        const l = get().liveActivity;
        if (l) set({ liveActivity: { ...l, distanceKm: l.distanceKm + km } });
      },
      endLive: () => {
        const l = get().liveActivity;
        if (!l) return null;
        const durationMin = Math.max(1, Math.round((Date.now() - l.startedAt) / 60000));
        set({ liveActivity: null });
        return { type: l.type, steps: l.steps, distanceKm: l.distanceKm, durationMin };
      },
      pushHistory: (r) => set({ history: [r, ...get().history].slice(0, 200) }),
      resetDay: () => set({ todaySteps: 0, todayPoints: 0 })
    }),
    {
      name: "mahallelig-activity",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ todaySteps: s.todaySteps, todayPoints: s.todayPoints, history: s.history })
    }
  )
);
```

- [ ] **Step 7.3:** Write `store/useLeagueStore.ts`:

```ts
import { create } from "zustand";

type State = {
  weeklyDeltaByNid: Record<string, number>;
  bumpUserNeighborhood: (nid: string, points: number) => void;
  reset: () => void;
};

export const useLeagueStore = create<State>((set, get) => ({
  weeklyDeltaByNid: {},
  bumpUserNeighborhood: (nid, points) =>
    set({ weeklyDeltaByNid: { ...get().weeklyDeltaByNid, [nid]: (get().weeklyDeltaByNid[nid] ?? 0) + points } }),
  reset: () => set({ weeklyDeltaByNid: {} })
}));
```

- [ ] **Step 7.4:** Write `store/useRedemptionStore.ts`:

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RedemptionRecord } from "@/services/backend/types";

type State = {
  items: RedemptionRecord[];
  add: (r: RedemptionRecord) => void;
  markUsed: (rdid: string) => void;
};

export const useRedemptionStore = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      add: (r) => set({ items: [r, ...get().items] }),
      markUsed: (rdid) => set({ items: get().items.map((x) => (x.rdid === rdid ? { ...x, status: "used" } : x)) })
    }),
    { name: "mahallelig-redemptions", storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

- [ ] **Step 7.5:** Write `store/useSettingsStore.ts`:

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type State = {
  demoMode: boolean;
  notificationsEnabled: boolean;
  toggleDemoMode: () => void;
  setNotificationsEnabled: (v: boolean) => void;
};

export const useSettingsStore = create<State>()(
  persist(
    (set, get) => ({
      demoMode: true,
      notificationsEnabled: false,
      toggleDemoMode: () => set({ demoMode: !get().demoMode }),
      setNotificationsEnabled: (v) => set({ notificationsEnabled: v })
    }),
    { name: "mahallelig-settings", storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

- [ ] **Step 7.6:** Add `__tests__/redemption.test.ts`:

```ts
import { useRedemptionStore } from "@/store/useRedemptionStore";

describe("useRedemptionStore", () => {
  beforeEach(() => {
    useRedemptionStore.setState({ items: [] });
  });
  test("add + markUsed", () => {
    useRedemptionStore.getState().add({
      rdid: "r1", uid: "u", rid: "x", qrPayload: "p", status: "active",
      createdAt: 0, expiresAt: 1000
    });
    expect(useRedemptionStore.getState().items[0].status).toBe("active");
    useRedemptionStore.getState().markUsed("r1");
    expect(useRedemptionStore.getState().items[0].status).toBe("used");
  });
});
```

- [ ] **Step 7.7:** Run: `npm test`. Expect PASS across all suites.

- [ ] **Step 7.8:** Commit.

```bash
git add -A && git commit -m "feat(store): user/activity/league/redemption/settings Zustand stores"
```

---

## Task 8: Root Layout, Auth Bootstrap, Tab Navigator

**Files:**
- Replace: `app/_layout.tsx`, `app/index.tsx`
- Create: `app/(tabs)/_layout.tsx`

**Steps:**

- [ ] **Step 8.1:** Replace `app/_layout.tsx`:

```tsx
import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="reward/[rid]" options={{ presentation: "modal", headerShown: true, title: "Ödül" }} />
        <Stack.Screen name="feed" options={{ presentation: "modal", headerShown: true, title: "Sosyal Feed" }} />
        <Stack.Screen name="business" options={{ presentation: "modal", headerShown: true, title: "Yerel İşletme" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
```

- [ ] **Step 8.2:** Replace `app/index.tsx`:

```tsx
import { Redirect } from "expo-router";
import { useUserStore } from "@/store/useUserStore";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

export default function Index() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration(() => setHydrated(true));
    if (useUserStore.persist.hasHydrated()) setHydrated(true);
    return () => unsub();
  }, []);
  const onboarded = useUserStore((s) => s.onboarded);
  if (!hydrated) return <View className="flex-1 items-center justify-center bg-ink-900"><ActivityIndicator color="#fff" /></View>;
  return <Redirect href={onboarded ? "/(tabs)" : "/(onboarding)/welcome"} />;
}
```

- [ ] **Step 8.3:** Write `app/(tabs)/_layout.tsx`:

```tsx
import { Tabs } from "expo-router";
import { tr } from "@/constants/i18n";
import { Text } from "react-native";

const ICONS: Record<string, string> = { index: "🏃", league: "🏆", market: "🎁", municipality: "🏛️", profile: "👤" };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#6366F1",
        tabBarIcon: ({ focused }) => <Text style={{ fontSize: focused ? 22 : 18 }}>{ICONS[route.name] ?? "•"}</Text>
      })}
    >
      <Tabs.Screen name="index" options={{ title: tr.tabs.today }} />
      <Tabs.Screen name="league" options={{ title: tr.tabs.league }} />
      <Tabs.Screen name="market" options={{ title: tr.tabs.market }} />
      <Tabs.Screen name="municipality" options={{ title: tr.tabs.muni }} />
      <Tabs.Screen name="profile" options={{ title: tr.tabs.profile }} />
    </Tabs>
  );
}
```

- [ ] **Step 8.4:** Smoke test: `npx expo export --platform web --output-dir dist-smoke` exits 0. Clean up.

- [ ] **Step 8.5:** Commit.

```bash
git add -A && git commit -m "feat(nav): root layout, auth bootstrap redirect, tab navigator"
```

---

## Task 9: Onboarding Flow (3 screens)

**Files:**
- Create: `app/(onboarding)/_layout.tsx`, `app/(onboarding)/welcome.tsx`, `app/(onboarding)/neighborhood.tsx`, `app/(onboarding)/permissions.tsx`

**Steps:**

- [ ] **Step 9.1:** Write `app/(onboarding)/_layout.tsx`:

```tsx
import { Stack } from "expo-router";
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

- [ ] **Step 9.2:** Write `app/(onboarding)/welcome.tsx`:

```tsx
import { useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { tr } from "@/constants/i18n";

export default function Welcome() {
  const [name, setName] = useState("");
  return (
    <Screen>
      <View className="flex-1 justify-center gap-6 py-12">
        <Text className="text-4xl font-bold text-ink-900 dark:text-white">{tr.onboarding.welcomeTitle}</Text>
        <Text className="text-base text-ink-500">{tr.onboarding.welcomeSubtitle}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="İsmin"
          placeholderTextColor="#94A3B8"
          className="border border-ink-300 rounded-xl px-4 py-3 text-ink-900 dark:text-white"
        />
        <Pressable
          accessibilityRole="button"
          disabled={!name.trim()}
          onPress={() => router.push({ pathname: "/(onboarding)/neighborhood", params: { name } })}
          className={`rounded-xl py-4 ${name.trim() ? "bg-brand-500" : "bg-ink-300"}`}
        >
          <Text className="text-center text-white font-semibold">{tr.onboarding.continue}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
```

- [ ] **Step 9.3:** Write `app/(onboarding)/neighborhood.tsx`:

```tsx
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { NEIGHBORHOODS } from "@/constants/seed/neighborhoods";
import { tr } from "@/constants/i18n";

export default function PickNeighborhood() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <Screen scroll={false}>
      <Text className="text-2xl font-bold text-ink-900 dark:text-white py-4">{tr.onboarding.pickNeighborhood}</Text>
      <FlatList
        data={NEIGHBORHOODS}
        keyExtractor={(n) => n.nid}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelected(item.nid)}
            className={`border rounded-xl p-3 mb-2 ${selected === item.nid ? "border-brand-500 bg-brand-50" : "border-ink-300"}`}
          >
            <Text className="text-ink-900 font-semibold">{item.name}</Text>
            <Text className="text-ink-500 text-xs">{item.district}, {item.city}</Text>
          </Pressable>
        )}
      />
      <Pressable
        disabled={!selected}
        onPress={() => router.push({ pathname: "/(onboarding)/permissions", params: { name, nid: selected ?? "" } })}
        className={`rounded-xl py-4 mt-3 ${selected ? "bg-brand-500" : "bg-ink-300"}`}
      >
        <Text className="text-center text-white font-semibold">{tr.onboarding.continue}</Text>
      </Pressable>
    </Screen>
  );
}
```

- [ ] **Step 9.4:** Write `app/(onboarding)/permissions.tsx`:

```tsx
import { Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { tr } from "@/constants/i18n";
import { useUserStore, makeNewUser } from "@/store/useUserStore";
import { requestLocationPermission } from "@/services/location";
import { requestNotificationPermission } from "@/services/notifications";
import { useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function Permissions() {
  const { name, nid } = useLocalSearchParams<{ name: string; nid: string }>();
  const [loc, setLoc] = useState(false);
  const [notif, setNotif] = useState(false);
  const setUser = useUserStore((s) => s.setUser);
  const setOnboarded = useUserStore((s) => s.setOnboarded);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);

  async function finish() {
    setUser(makeNewUser({ name: String(name ?? "Misafir"), neighborhoodId: String(nid ?? "caferaga") }));
    setOnboarded(true);
    router.replace("/(tabs)");
  }

  return (
    <Screen>
      <View className="flex-1 justify-center gap-4 py-12">
        <Text className="text-3xl font-bold text-ink-900 dark:text-white">{tr.onboarding.permissionsTitle}</Text>
        <Text className="text-ink-500">{tr.onboarding.permissionsBody}</Text>
        <Pressable onPress={async () => setLoc(await requestLocationPermission())} className="border border-ink-300 rounded-xl py-3">
          <Text className="text-center text-ink-900 dark:text-white">{loc ? "✓ Konum" : tr.onboarding.grantLocation}</Text>
        </Pressable>
        <Pressable onPress={async () => { const ok = await requestNotificationPermission(); setNotif(ok); setNotificationsEnabled(ok); }} className="border border-ink-300 rounded-xl py-3">
          <Text className="text-center text-ink-900 dark:text-white">{notif ? "✓ Bildirim" : tr.onboarding.grantNotifications}</Text>
        </Pressable>
        <Pressable onPress={finish} className="rounded-xl bg-brand-500 py-4 mt-4">
          <Text className="text-center text-white font-semibold">{tr.onboarding.finish}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
```

- [ ] **Step 9.5:** Smoke test: `npx expo export --platform web --output-dir dist-smoke`. Exit 0. Clean up.

- [ ] **Step 9.6:** Commit.

```bash
git add -A && git commit -m "feat(onboarding): 3-step welcome → neighborhood → permissions flow"
```

---

## Task 10: Bugün (Today) Screen + Live Activity Loop

**Files:**
- Create: `components/PointCounter.tsx`, `components/ActivityCard.tsx`, `components/WeeklyTrendChart.tsx`
- Create: `app/(tabs)/index.tsx`

**Steps:**

- [ ] **Step 10.1:** Write `components/PointCounter.tsx`:

```tsx
import { Text, View } from "react-native";

export function PointCounter({ steps, points }: { steps: number; points: number }) {
  return (
    <View className="rounded-2xl bg-brand-500 p-6">
      <Text className="text-white/80 text-sm">Bugünki adım</Text>
      <Text className="text-white text-5xl font-bold">{steps.toLocaleString("tr-TR")}</Text>
      <Text className="text-white/80 mt-3 text-sm">MahallePuan</Text>
      <Text className="text-white text-3xl font-bold">+{points.toLocaleString("tr-TR")}</Text>
    </View>
  );
}
```

- [ ] **Step 10.2:** Write `components/ActivityCard.tsx`:

```tsx
import { Pressable, Text, View } from "react-native";
import { tr } from "@/constants/i18n";

type Type = "walk" | "run" | "bike";
const LABEL: Record<Type, string> = { walk: tr.today.activityTypeWalk, run: tr.today.activityTypeRun, bike: tr.today.activityTypeBike };
const ICON: Record<Type, string> = { walk: "🚶", run: "🏃", bike: "🚴" };

export function ActivityCard({
  active, type, onSelectType, onStart, onStop, source, liveSteps, liveDistanceKm
}: {
  active: boolean;
  type: Type;
  onSelectType: (t: Type) => void;
  onStart: () => void;
  onStop: () => void;
  source: string;
  liveSteps: number;
  liveDistanceKm: number;
}) {
  return (
    <View className="rounded-2xl bg-white border border-ink-300 p-4 mt-4">
      <View className="flex-row justify-between items-center mb-3">
        {(Object.keys(LABEL) as Type[]).map((t) => (
          <Pressable key={t} onPress={() => onSelectType(t)} className={`flex-1 mx-1 py-2 rounded-xl ${type === t ? "bg-ink-900" : "bg-ink-300/40"}`}>
            <Text className={`text-center font-semibold ${type === t ? "text-white" : "text-ink-700"}`}>{ICON[t]} {LABEL[t]}</Text>
          </Pressable>
        ))}
      </View>
      {active ? (
        <>
          <Text className="text-ink-500 text-sm">Canlı · {source}</Text>
          <Text className="text-ink-900 text-2xl font-bold">{liveSteps.toLocaleString("tr-TR")} adım · {liveDistanceKm.toFixed(2)} km</Text>
          <Pressable onPress={onStop} className="rounded-xl bg-danger bg-red-500 mt-3 py-3">
            <Text className="text-center text-white font-semibold">{tr.today.stopActivity}</Text>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={onStart} className="rounded-xl bg-accent-500 py-3">
          <Text className="text-center text-white font-semibold">{tr.today.startActivity}</Text>
        </Pressable>
      )}
    </View>
  );
}
```

- [ ] **Step 10.3:** Write `components/WeeklyTrendChart.tsx` — simple bar chart using react-native-svg directly so we don't depend on victory's chart wiring:

```tsx
import { View, Text } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

export function WeeklyTrendChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(1, ...values);
  const width = 280;
  const height = 120;
  const barW = width / values.length - 8;
  return (
    <View className="bg-white border border-ink-300 rounded-2xl p-4 mt-4">
      <Text className="text-ink-700 font-semibold mb-2">Son 7 gün</Text>
      <Svg width={width} height={height + 20}>
        {values.map((v, i) => {
          const h = (v / max) * height;
          return (
            <Rect key={i} x={i * (barW + 8) + 4} y={height - h} width={barW} height={h} fill="#6366F1" rx={4} />
          );
        })}
        {labels.map((l, i) => (
          <SvgText key={i} x={i * (barW + 8) + 4 + barW / 2} y={height + 15} fontSize={10} fill="#64748B" textAnchor="middle">{l}</SvgText>
        ))}
      </Svg>
    </View>
  );
}
```

- [ ] **Step 10.4:** Write `app/(tabs)/index.tsx`:

```tsx
import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { PointCounter } from "@/components/PointCounter";
import { ActivityCard } from "@/components/ActivityCard";
import { WeeklyTrendChart } from "@/components/WeeklyTrendChart";
import { Badge } from "@/components/Badge";
import { tr } from "@/constants/i18n";
import { useUserStore, levelOfUser } from "@/store/useUserStore";
import { useActivityStore } from "@/store/useActivityStore";
import { useLeagueStore } from "@/store/useLeagueStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { findNeighborhood } from "@/services/league";
import { isAvailable, watchSteps } from "@/services/pedometer";
import { startDemoStepStream } from "@/services/demoMode";
import { pointsForActivity, applyDailyCap } from "@/services/points";
import { backend } from "@/services/backend";

const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default function Today() {
  const user = useUserStore((s) => s.user);
  const addPoints = useUserStore((s) => s.addPoints);
  const todaySteps = useActivityStore((s) => s.todaySteps);
  const todayPoints = useActivityStore((s) => s.todayPoints);
  const addTodaySteps = useActivityStore((s) => s.addTodaySteps);
  const addTodayPoints = useActivityStore((s) => s.addTodayPoints);
  const live = useActivityStore((s) => s.liveActivity);
  const startLive = useActivityStore((s) => s.startLive);
  const pushLiveSteps = useActivityStore((s) => s.pushLiveSteps);
  const endLive = useActivityStore((s) => s.endLive);
  const pushHistory = useActivityStore((s) => s.pushHistory);
  const demoMode = useSettingsStore((s) => s.demoMode);
  const bumpUserNeighborhood = useLeagueStore((s) => s.bumpUserNeighborhood);

  const [type, setType] = useState<"walk" | "run" | "bike">("walk");
  const [trend] = useState<number[]>([3200, 4800, 6100, 2900, 8400, 5500, 7700]);

  useEffect(() => {
    let sub: { remove: () => void } | null = null;
    (async () => {
      if (demoMode) return;
      if (await isAvailable()) sub = watchSteps((n) => addTodaySteps(n));
    })();
    return () => sub?.remove();
  }, [demoMode]);

  useEffect(() => {
    if (!live) return;
    let sub: { remove: () => void } | null = null;
    if (demoMode) {
      sub = startDemoStepStream((n) => {
        pushLiveSteps(n);
        addTodaySteps(n);
      });
    } else {
      sub = watchSteps((n) => {
        pushLiveSteps(n);
        addTodaySteps(n);
      });
    }
    return () => sub?.remove();
  }, [live, demoMode]);

  function onStart() {
    startLive(type);
  }

  async function onStop() {
    const ended = endLive();
    if (!ended || !user) return;
    const distanceKm = ended.type === "bike" ? ended.distanceKm : Math.max(ended.distanceKm, ended.steps / 1300);
    const earned = pointsForActivity({ type: ended.type, steps: ended.steps, distanceKm });
    const capped = applyDailyCap(todayPoints, earned);
    addTodayPoints(capped);
    addPoints(capped);
    bumpUserNeighborhood(user.neighborhoodId, capped);
    const startedAt = Date.now() - ended.durationMin * 60000;
    pushHistory({
      aid: `act-${startedAt}`,
      uid: user.uid,
      type: ended.type,
      steps: ended.steps,
      distanceKm,
      durationMin: ended.durationMin,
      points: capped,
      startedAt,
      endedAt: Date.now()
    });
    await backend.recordActivity({
      aid: `act-${startedAt}`, uid: user.uid, type: ended.type, steps: ended.steps,
      distanceKm, durationMin: ended.durationMin, points: capped,
      startedAt, endedAt: Date.now()
    });
  }

  const nhood = user ? findNeighborhood(user.neighborhoodId) : undefined;

  return (
    <Screen>
      <View className="flex-row justify-between items-center pt-4">
        <View>
          <Text className="text-ink-500 text-xs">{tr.today.greeting(user?.name ?? "")}</Text>
          <Text className="text-ink-900 dark:text-white text-xl font-semibold">{nhood?.name ?? ""} Mahallesi</Text>
        </View>
        <Badge label={`Lv ${levelOfUser(user)}`} />
      </View>

      <View className="mt-4">
        <PointCounter steps={todaySteps} points={todayPoints} />
      </View>

      <ActivityCard
        active={!!live}
        type={type}
        onSelectType={setType}
        onStart={onStart}
        onStop={onStop}
        source={demoMode ? tr.today.sourceDemo : tr.today.sourcePedometer}
        liveSteps={live?.steps ?? 0}
        liveDistanceKm={live?.distanceKm ?? 0}
      />

      <WeeklyTrendChart values={trend} labels={DAY_LABELS} />
    </Screen>
  );
}
```

- [ ] **Step 10.5:** Smoke test: `npx expo export --platform web --output-dir dist-smoke`. Exit 0. Clean up.

- [ ] **Step 10.6:** Commit.

```bash
git add -A && git commit -m "feat(today): Bugün screen with pedometer/demo loop, points, weekly chart"
```

---

## Task 11: Mahalle Ligi Screen

**Files:**
- Create: `components/LeaderboardRow.tsx`, `app/(tabs)/league.tsx`

**Steps:**

- [ ] **Step 11.1:** Write `components/LeaderboardRow.tsx`:

```tsx
import { Text, View } from "react-native";

export function LeaderboardRow({ rank, name, sub, points, you }: { rank: number; name: string; sub?: string; points: number; you?: boolean }) {
  return (
    <View className={`flex-row items-center justify-between rounded-xl px-3 py-3 mb-2 ${you ? "bg-brand-50 border border-brand-500" : "bg-white border border-ink-300"}`}>
      <View className="flex-row items-center gap-3">
        <Text className="text-ink-500 w-6 text-center">{rank}</Text>
        <View>
          <Text className={`font-semibold ${you ? "text-brand-700" : "text-ink-900"}`}>{name}</Text>
          {sub && <Text className="text-ink-500 text-xs">{sub}</Text>}
        </View>
      </View>
      <Text className="font-bold text-ink-900">{points.toLocaleString("tr-TR")}</Text>
    </View>
  );
}
```

- [ ] **Step 11.2:** Write `app/(tabs)/league.tsx`:

```tsx
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { LeaderboardRow } from "@/components/LeaderboardRow";
import { tr } from "@/constants/i18n";
import { useUserStore } from "@/store/useUserStore";
import { useLeagueStore } from "@/store/useLeagueStore";
import { useActivityStore } from "@/store/useActivityStore";
import { neighborhoodLeaderboard, userLeaderboardForNeighborhood, seasonCountdown } from "@/services/league";

export default function League() {
  const user = useUserStore((s) => s.user);
  const delta = useLeagueStore((s) => s.weeklyDeltaByNid);
  const todayPoints = useActivityStore((s) => s.todayPoints);
  const [tab, setTab] = useState<"inside" | "outside">("inside");

  const outsideRows = neighborhoodLeaderboard({ weeklyPointsByNid: delta });
  const yourNhoodRow = outsideRows.find((r) => r.nid === user?.neighborhoodId);
  const insideRows = user ? userLeaderboardForNeighborhood(user.neighborhoodId, { uid: user.uid, displayName: user.name, weeklyPoints: todayPoints }) : [];
  const c = seasonCountdown();

  return (
    <Screen scroll={false}>
      <View className="pt-4 pb-2">
        <Text className="text-ink-500">{tr.league.title}</Text>
        <Text className="text-ink-900 dark:text-white text-2xl font-bold">{yourNhoodRow?.name ?? "—"}</Text>
        <Text className="text-ink-700">{yourNhoodRow ? tr.league.rank(yourNhoodRow.rank, outsideRows.length) : ""}</Text>
        <Text className="text-ink-500 text-xs mt-1">{tr.league.seasonCountdown(c.days, c.hours)}</Text>
      </View>

      <View className="rounded-xl bg-amber-100 p-3 mb-3">
        <Text className="text-amber-900 font-semibold">🏁 {tr.league.weeklyMission}</Text>
      </View>

      <View className="flex-row mb-3">
        {(["inside", "outside"] as const).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} className={`flex-1 py-2 mx-1 rounded-xl ${tab === t ? "bg-ink-900" : "bg-ink-300/40"}`}>
            <Text className={`text-center font-semibold ${tab === t ? "text-white" : "text-ink-700"}`}>
              {t === "inside" ? tr.league.tabInside : tr.league.tabOutside}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "inside" ? (
        <FlatList
          data={insideRows}
          keyExtractor={(r) => r.uid}
          renderItem={({ item }) => (
            <LeaderboardRow rank={item.rank} name={item.isYou ? `${tr.league.you} · ${item.displayName}` : item.displayName} points={item.weeklyPoints} you={item.isYou} />
          )}
        />
      ) : (
        <FlatList
          data={outsideRows}
          keyExtractor={(r) => r.nid}
          renderItem={({ item }) => (
            <LeaderboardRow rank={item.rank} name={item.name} sub={item.district} points={item.weeklyPoints} you={item.nid === user?.neighborhoodId} />
          )}
        />
      )}
    </Screen>
  );
}
```

- [ ] **Step 11.3:** Smoke test + commit.

```bash
npx expo export --platform web --output-dir dist-smoke && rm -rf dist-smoke
git add -A && git commit -m "feat(league): Mahalle Ligi with inside/outside tabs, mission banner, season countdown"
```

---

## Task 12: LigMarket Screen + Reward Detail (QR Redeem)

**Files:**
- Create: `components/RewardCard.tsx`, `app/(tabs)/market.tsx`, `app/reward/[rid].tsx`

**Steps:**

- [ ] **Step 12.1:** Write `components/RewardCard.tsx`:

```tsx
import { Pressable, Text, View } from "react-native";
import { tr } from "@/constants/i18n";
import { partnerColors } from "@/constants/theme";
import type { Reward } from "@/constants/seed/rewards";

export function RewardCard({ reward, userPoints, onPress }: { reward: Reward; userPoints: number; onPress: () => void }) {
  const enough = userPoints >= reward.cost;
  return (
    <Pressable onPress={onPress} className="bg-white border border-ink-300 rounded-2xl p-4 mr-3 w-64">
      <View className="rounded-lg h-20 mb-3" style={{ backgroundColor: partnerColors[reward.partner] + "33" }} />
      <Text className="text-ink-900 font-semibold">{reward.title}</Text>
      <Text className="text-ink-500 text-xs mt-1">{reward.description}</Text>
      <View className="flex-row justify-between items-center mt-3">
        <Text className="text-ink-900 font-bold">{reward.cost.toLocaleString("tr-TR")} P</Text>
        <Text className={`text-xs font-semibold ${enough ? "text-accent-500" : "text-amber-600"}`}>
          {enough ? tr.market.enoughPoints : tr.market.needPoints(reward.cost - userPoints)}
        </Text>
      </View>
    </Pressable>
  );
}
```

- [ ] **Step 12.2:** Write `app/(tabs)/market.tsx`:

```tsx
import { FlatList, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { RewardCard } from "@/components/RewardCard";
import { REWARDS, type RewardPartner } from "@/constants/seed/rewards";
import { tr } from "@/constants/i18n";
import { useUserStore } from "@/store/useUserStore";

const ORDER: RewardPartner[] = ["belpa", "municipal_sports", "culture", "local", "transport"];

export default function Market() {
  const user = useUserStore((s) => s.user);
  const points = user?.totalPoints ?? 0;
  return (
    <Screen>
      <Text className="text-2xl font-bold text-ink-900 dark:text-white py-4">{tr.market.title}</Text>
      {ORDER.map((p) => {
        const rows = REWARDS.filter((r) => r.partner === p);
        if (!rows.length) return null;
        return (
          <View key={p} className="mb-5">
            <Text className="text-ink-700 font-semibold mb-2">{tr.market.categories[p]}</Text>
            <FlatList
              horizontal
              data={rows}
              keyExtractor={(r) => r.rid}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <RewardCard reward={item} userPoints={points} onPress={() => router.push(`/reward/${item.rid}`)} />}
            />
          </View>
        );
      })}
    </Screen>
  );
}
```

- [ ] **Step 12.3:** Write `app/reward/[rid].tsx`:

```tsx
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { Screen } from "@/components/Screen";
import { REWARDS } from "@/constants/seed/rewards";
import { tr } from "@/constants/i18n";
import { useUserStore } from "@/store/useUserStore";
import { useRedemptionStore } from "@/store/useRedemptionStore";
import { buildQrPayload, encodeQr, REDEMPTION_TTL_MIN } from "@/services/qr";
import { backend } from "@/services/backend";
import { useMemo, useState } from "react";

export default function RewardDetail() {
  const { rid } = useLocalSearchParams<{ rid: string }>();
  const reward = REWARDS.find((r) => r.rid === rid);
  const user = useUserStore((s) => s.user);
  const addPoints = useUserStore((s) => s.addPoints);
  const addRedemption = useRedemptionStore((s) => s.add);
  const [redeemed, setRedeemed] = useState<null | { qr: string; expiresAt: number }>(null);

  if (!reward) return <Screen><Text className="text-ink-900 dark:text-white">Bulunamadı</Text></Screen>;

  const enough = (user?.totalPoints ?? 0) >= reward.cost;

  async function confirm() {
    if (!user || !reward || !enough) return;
    const rdid = "rd-" + Math.random().toString(36).slice(2, 10);
    const payload = buildQrPayload({ uid: user.uid, rid: reward.rid, rdid });
    const qr = encodeQr(payload);
    addPoints(-reward.cost);
    addRedemption({ rdid, uid: user.uid, rid: reward.rid, qrPayload: qr, status: "active", createdAt: Date.now(), expiresAt: payload.expiresAt });
    await backend.recordRedemption({ rdid, uid: user.uid, rid: reward.rid, qrPayload: qr, status: "active", createdAt: Date.now(), expiresAt: payload.expiresAt });
    setRedeemed({ qr, expiresAt: payload.expiresAt });
  }

  return (
    <Screen>
      <View className="py-6 gap-3">
        <Text className="text-3xl font-bold text-ink-900 dark:text-white">{reward.title}</Text>
        <Text className="text-ink-500">{reward.description}</Text>
        <Text className="text-ink-700">{reward.termsTr}</Text>
        <Text className="text-ink-900 text-2xl font-bold mt-2">{reward.cost.toLocaleString("tr-TR")} P</Text>
        {redeemed ? (
          <View className="items-center mt-6 gap-3">
            <Text className="text-ink-900 dark:text-white font-semibold">{tr.reward.qrTitle}</Text>
            <View className="bg-white p-4 rounded-2xl">
              <QRCode value={redeemed.qr} size={220} />
            </View>
            <Text className="text-ink-500 text-sm">{tr.reward.qrSubtitle(REDEMPTION_TTL_MIN)}</Text>
          </View>
        ) : (
          <Pressable
            disabled={!enough}
            onPress={confirm}
            className={`rounded-xl py-4 mt-3 ${enough ? "bg-brand-500" : "bg-ink-300"}`}
          >
            <Text className="text-center text-white font-semibold">{tr.reward.confirm}</Text>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}
```

- [ ] **Step 12.4:** Smoke test + commit.

```bash
npx expo export --platform web --output-dir dist-smoke && rm -rf dist-smoke
git add -A && git commit -m "feat(market): LigMarket + reward detail with QR redemption"
```

---

## Task 13: Belediye Paneli (Admin) Screen

**Files:**
- Create: `components/KpiCard.tsx`, `components/NeighborhoodHeatmap.tsx`, `components/CategoryPieChart.tsx`, `app/(tabs)/municipality.tsx`

**Steps:**

- [ ] **Step 13.1:** Write `components/KpiCard.tsx`:

```tsx
import { Text, View } from "react-native";

export function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View className="flex-1 bg-white border border-ink-300 rounded-2xl p-3 m-1">
      <Text className="text-ink-500 text-xs">{label}</Text>
      <Text className="text-ink-900 text-xl font-bold">{value}</Text>
      {sub && <Text className="text-accent-500 text-xs mt-1">{sub}</Text>}
    </View>
  );
}
```

- [ ] **Step 13.2:** Write `components/NeighborhoodHeatmap.tsx`:

```tsx
import { Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import type { LeagueRow } from "@/services/league";

export function NeighborhoodHeatmap({ rows }: { rows: LeagueRow[] }) {
  const cols = 8;
  const cell = 36;
  const max = Math.max(1, ...rows.map((r) => r.weeklyPoints));
  return (
    <View className="bg-white border border-ink-300 rounded-2xl p-3 mt-2">
      <Text className="text-ink-700 font-semibold mb-2">Mahalle ısı haritası</Text>
      <Svg width={cols * cell + 4} height={Math.ceil(rows.length / cols) * cell + 4}>
        {rows.map((r, i) => {
          const x = (i % cols) * cell;
          const y = Math.floor(i / cols) * cell;
          const t = r.weeklyPoints / max;
          const r8 = Math.round(99 - 80 * t);
          const g8 = Math.round(102 + 90 * t);
          const b8 = Math.round(241 - 100 * t);
          return <Rect key={r.nid} x={x + 2} y={y + 2} width={cell - 4} height={cell - 4} rx={6} fill={`rgb(${r8},${g8},${b8})`} />;
        })}
      </Svg>
    </View>
  );
}
```

- [ ] **Step 13.3:** Write `components/CategoryPieChart.tsx`:

```tsx
import { Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { partnerColors } from "@/constants/theme";

export function CategoryPieChart({ data }: { data: { partner: string; count: number }[] }) {
  const total = data.reduce((a, b) => a + b.count, 0) || 1;
  const r = 56, cx = 70, cy = 70;
  let acc = 0;
  return (
    <View className="bg-white border border-ink-300 rounded-2xl p-3 mt-2">
      <Text className="text-ink-700 font-semibold mb-2">Tercih edilen ödül kategorileri</Text>
      <View className="flex-row items-center">
        <Svg width={140} height={140}>
          <G>
            {data.map((d) => {
              const frac = d.count / total;
              const dash = 2 * Math.PI * r;
              const len = dash * frac;
              const rot = (acc / total) * 360;
              acc += d.count;
              return (
                <Circle key={d.partner} cx={cx} cy={cy} r={r} fill="transparent"
                  stroke={partnerColors[d.partner] ?? "#94A3B8"} strokeWidth={24}
                  strokeDasharray={`${len} ${dash}`} strokeDashoffset={0}
                  transform={`rotate(${rot - 90}, ${cx}, ${cy})`} />
              );
            })}
          </G>
        </Svg>
        <View className="flex-1 ml-3">
          {data.map((d) => (
            <View key={d.partner} className="flex-row items-center mb-1">
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: partnerColors[d.partner] ?? "#94A3B8" }} />
              <Text className="text-ink-700 text-xs ml-2">{d.partner} · {d.count}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
```

- [ ] **Step 13.4:** Write `app/(tabs)/municipality.tsx`:

```tsx
import { Pressable, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { KpiCard } from "@/components/KpiCard";
import { NeighborhoodHeatmap } from "@/components/NeighborhoodHeatmap";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { tr } from "@/constants/i18n";
import { neighborhoodLeaderboard } from "@/services/league";
import { useLeagueStore } from "@/store/useLeagueStore";
import { FAKE_USERS } from "@/constants/seed/fakeUsers";
import { FAKE_ACTIVITIES } from "@/constants/seed/fakeActivities";
import { REWARDS, type RewardPartner } from "@/constants/seed/rewards";

export default function Municipality() {
  const delta = useLeagueStore((s) => s.weeklyDeltaByNid);
  const rows = neighborhoodLeaderboard({ weeklyPointsByNid: delta });

  const activeCitizens = FAKE_USERS.length + 1;
  const weeklySteps = FAKE_ACTIVITIES.reduce((a, b) => a + b.steps, 0);
  const facilityVisits = 184;
  const redeemed = 73;

  const top5 = rows.slice(0, 5);
  const low = rows[rows.length - 1];

  const partnerCount = REWARDS.reduce<Record<RewardPartner, number>>((acc, r) => ({ ...acc, [r.partner]: (acc[r.partner] ?? 0) + Math.floor(Math.random() * 20) + 5 }), {} as any);
  const pieData = Object.entries(partnerCount).map(([partner, count]) => ({ partner, count: count as number }));

  return (
    <Screen>
      <Text className="text-2xl font-bold text-ink-900 dark:text-white py-4">{tr.municipality.title}</Text>

      <View className="flex-row flex-wrap">
        <KpiCard label={tr.municipality.activeCitizens} value={activeCitizens.toString()} sub="+12 bu hafta" />
        <KpiCard label={tr.municipality.weeklySteps} value={(weeklySteps / 1000).toFixed(1) + "k"} sub="+8% MoW" />
      </View>
      <View className="flex-row flex-wrap">
        <KpiCard label={tr.municipality.facilityVisits} value={facilityVisits.toString()} sub="+15% MoW" />
        <KpiCard label={tr.municipality.redeemed} value={redeemed.toString()} sub="+22% MoW" />
      </View>

      <NeighborhoodHeatmap rows={rows} />
      <CategoryPieChart data={pieData} />

      <View className="bg-white border border-ink-300 rounded-2xl p-3 mt-3">
        <Text className="text-ink-700 font-semibold mb-2">{tr.municipality.topNeighborhoods}</Text>
        {top5.map((r) => (
          <View key={r.nid} className="flex-row justify-between py-1">
            <Text className="text-ink-900">{r.rank}. {r.name}</Text>
            <Text className="text-ink-700">{r.weeklyPoints.toLocaleString("tr-TR")}</Text>
          </View>
        ))}
        <View className="mt-3 rounded-xl bg-amber-100 p-3">
          <Text className="text-amber-900 font-semibold">⚠️ {tr.municipality.lowAlert(low.name)}</Text>
          <Pressable className="rounded-xl bg-amber-600 mt-2 py-2"><Text className="text-white text-center font-semibold">{tr.municipality.createMission}</Text></Pressable>
        </View>
      </View>
    </Screen>
  );
}
```

- [ ] **Step 13.5:** Smoke test + commit.

```bash
npx expo export --platform web --output-dir dist-smoke && rm -rf dist-smoke
git add -A && git commit -m "feat(muni): Belediye Paneli with KPIs, heatmap, pie chart, alert + mission CTA"
```

---

## Task 14: Profil Screen + Sosyal Feed + Yerel İşletme Paneli + Push Trigger

**Files:**
- Create: `app/(tabs)/profile.tsx`, `app/feed.tsx`, `app/business.tsx`

**Steps:**

- [ ] **Step 14.1:** Write `app/(tabs)/profile.tsx`:

```tsx
import { Pressable, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Badge } from "@/components/Badge";
import { tr } from "@/constants/i18n";
import { useUserStore, levelOfUser } from "@/store/useUserStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useRedemptionStore } from "@/store/useRedemptionStore";
import { findNeighborhood } from "@/services/league";
import { fireLocal } from "@/services/notifications";

const BADGES = ["Mahalle Şampiyonu", "İlk Yürüyüş", "5km Klübü", "Sabah Kuşu", "Bisiklet Dostu"];

export default function Profile() {
  const user = useUserStore((s) => s.user);
  const reset = useUserStore((s) => s.reset);
  const demoMode = useSettingsStore((s) => s.demoMode);
  const toggleDemoMode = useSettingsStore((s) => s.toggleDemoMode);
  const redemptions = useRedemptionStore((s) => s.items);
  const nhood = user ? findNeighborhood(user.neighborhoodId) : undefined;

  return (
    <Screen>
      <View className="items-center py-6 gap-2">
        <View className="w-20 h-20 rounded-full bg-brand-500 items-center justify-center">
          <Text className="text-white text-3xl font-bold">{(user?.name ?? "M")[0]}</Text>
        </View>
        <Text className="text-2xl font-bold text-ink-900 dark:text-white">{user?.name ?? "Misafir"}</Text>
        <Text className="text-ink-500">{nhood?.name ?? ""} · {nhood?.district ?? ""}</Text>
        <View className="flex-row gap-2 mt-1">
          <Badge label={`${(user?.totalPoints ?? 0).toLocaleString("tr-TR")} P`} tone="brand" />
          <Badge label={`Lv ${levelOfUser(user)}`} tone="accent" />
        </View>
      </View>

      <Text className="text-ink-700 font-semibold mb-2">{tr.profile.badges}</Text>
      <View className="flex-row flex-wrap">
        {BADGES.map((b) => (
          <View key={b} className="bg-white border border-ink-300 rounded-xl px-3 py-2 mr-2 mb-2">
            <Text className="text-ink-900 text-xs">🏅 {b}</Text>
          </View>
        ))}
      </View>

      <Text className="text-ink-700 font-semibold mt-4 mb-2">Redeem geçmişi</Text>
      {redemptions.length === 0 ? (
        <Text className="text-ink-500">Henüz redeem yok.</Text>
      ) : (
        redemptions.map((r) => (
          <View key={r.rdid} className="bg-white border border-ink-300 rounded-xl p-3 mb-2">
            <Text className="text-ink-900">{r.rid}</Text>
            <Text className="text-ink-500 text-xs">{r.status}</Text>
          </View>
        ))
      )}

      <Text className="text-ink-700 font-semibold mt-4 mb-2">{tr.profile.settings}</Text>
      <View className="bg-white border border-ink-300 rounded-xl p-3">
        <View className="flex-row items-center justify-between py-2">
          <Text className="text-ink-900">{tr.profile.demoMode}</Text>
          <Switch value={demoMode} onValueChange={toggleDemoMode} />
        </View>
        <Pressable onPress={() => fireLocal({ title: tr.push.overtakeTitle, body: tr.push.overtakeBody })} className="py-2">
          <Text className="text-brand-700 font-semibold">🔔 {tr.profile.triggerPush}</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/feed")} className="py-2"><Text className="text-brand-700">📰 Sosyal Feed</Text></Pressable>
        <Pressable onPress={() => router.push("/business")} className="py-2"><Text className="text-brand-700">🏪 Yerel İşletme Paneli</Text></Pressable>
        <Pressable onPress={() => { reset(); router.replace("/(onboarding)/welcome"); }} className="py-2"><Text className="text-red-500">↩︎ {tr.profile.signOut}</Text></Pressable>
      </View>
    </Screen>
  );
}
```

- [ ] **Step 14.2:** Write `app/feed.tsx`:

```tsx
import { FlatList, Pressable, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { FEED } from "@/constants/seed/feed";
import { useState } from "react";

export default function Feed() {
  const [likes, setLikes] = useState<Record<string, number>>({});
  return (
    <Screen>
      <FlatList
        data={FEED}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View className="bg-white border border-ink-300 rounded-2xl p-3 mb-3">
            <Text className="text-ink-900 font-semibold">{item.author}</Text>
            <Text className="text-ink-700 mt-1">{item.text}</Text>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-ink-500 text-xs">{item.minutesAgo} dk önce</Text>
              <Pressable onPress={() => setLikes((l) => ({ ...l, [item.id]: (l[item.id] ?? item.reactions) + 1 }))}>
                <Text className="text-brand-700">♥ {likes[item.id] ?? item.reactions}</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}
```

- [ ] **Step 14.3:** Write `app/business.tsx`:

```tsx
import { Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { KpiCard } from "@/components/KpiCard";
import { tr } from "@/constants/i18n";

export default function Business() {
  return (
    <Screen>
      <Text className="text-2xl font-bold text-ink-900 dark:text-white py-4">{tr.business.title}</Text>
      <View className="flex-row flex-wrap">
        <KpiCard label="Bu hafta müşteri" value="23" sub="+9 yeni" />
        <KpiCard label="Toplam redeem" value="118" sub="son 30 gün" />
      </View>
      <View className="flex-row flex-wrap">
        <KpiCard label="Ortalama puan" value="9.400" />
        <KpiCard label="Aktif kupon" value="14" />
      </View>
      <Text className="text-ink-700 font-semibold mt-3 mb-2">{tr.business.topReward}</Text>
      <View className="bg-white border border-ink-300 rounded-2xl p-3">
        <Text className="text-ink-900 font-semibold">Mehmet Usta · Filtre kahve</Text>
        <Text className="text-ink-500 text-xs">42 kez tercih edildi</Text>
      </View>
    </Screen>
  );
}
```

- [ ] **Step 14.4:** Smoke test + commit.

```bash
npx expo export --platform web --output-dir dist-smoke && rm -rf dist-smoke
git add -A && git commit -m "feat(profile+feed+business+push): profile screen, social feed, business panel, local push trigger"
```

---

## Task 15: Final Verification, Type-Check, Tests, Docs

**Files:**
- Create: `docs/RUNBOOK.md`

**Steps:**

- [ ] **Step 15.1:** Run TypeScript check: `npx tsc --noEmit`. Expect zero errors. Fix any.

- [ ] **Step 15.2:** Run full test suite: `npm test --silent`. Expect all suites PASS.

- [ ] **Step 15.3:** Run Expo web export end-to-end: `npx expo export --platform web --output-dir dist`. Expect exit 0; confirm `dist/index.html` exists.

- [ ] **Step 15.4:** Write `docs/RUNBOOK.md`:

```markdown
# MahalleLig — Runbook

## Local geliştirme

```bash
npm install
npm start
```

`a` (Android), `i` (iOS), `w` (web).

## Test

```bash
npm test
```

## Demo Mode

`Profil → Demo Mode` switch'i açıkken adım sayar 10x hızda simüle edilir. Aktivite Başlat'a basınca cebine telefon koymadan da +47 MahallePuan animasyonu çalışır.

## Push tetikleyici

`Profil → Test push gönder` butonu lokal bildirim düşürür ("Mahalleni geçtiler!").

## Veri katmanı

Default backend = `services/backend/seedBackend.ts` (in-memory). Firestore'a geçmek için `services/backend/firebaseBackend.ts` implementasyonunu tamamlayıp `services/backend/index.ts`'te `backend = makeFirebaseBackend(env)` yap.
```

- [ ] **Step 15.5:** Commit.

```bash
git add -A && git commit -m "docs(runbook): add local dev, test, demo mode, push trigger, backend swap notes"
```

- [ ] **Step 15.6:** Final summary: print to console:

```bash
git log --oneline | head -20
npm test --silent 2>&1 | tail -5
```

---

## Self-Review

**Spec coverage:** All 9 screens implemented (Bugün, Mahalle Ligi, LigMarket, Belediye, Onboarding, Profil, Feed, İşletme, Push trigger via Profil). Core flows (activity → points → redeem → leaderboard refresh) wired through Zustand. Seed data: 32 mahalle, 20 ödül, 50 fake user, 200 fake activity. Backend adapter is pluggable; Firebase stub left for v2. Demo Mode is the default so the stage demo works offline.

**Placeholder scan:** None — all code blocks are concrete and runnable.

**Type consistency:** `Backend` interface used identically across `seedBackend`, `firebaseBackend` stub, and store callers. `RewardPartner` re-used between seed, theme `partnerColors`, and `tr.market.categories`. `LeagueRow`/`UserLeagueRow` consistent between `services/league.ts` and `app/(tabs)/league.tsx` / `Municipality`.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-17-mahallelig-mvp.md`. The user's goal mandates subagent-driven execution for speed; I will dispatch subagents per task and run independent tasks in parallel where the dependency graph allows.
