// Sosyal giriş — şu an MOCK akış (Google + Apple).
//
// Gerçek OAuth/Sign-in-with-Apple açmak için:
//   GOOGLE:
//     1. Google Cloud Console'dan OAuth Client ID al (iOS / Android / Web)
//     2. `services/auth.real.ts` aç, expo-auth-session/providers/google import et
//     3. Custom URL scheme + dev client gerekir (Expo Go ile çalışmaz)
//   APPLE:
//     1. Apple Developer'da "Sign in with Apple" capability'sini bundle ID'ye ekle
//     2. `npx expo install expo-apple-authentication`
//     3. app.json -> "ios": { "usesAppleSignIn": true }
//     4. import * as AppleAuthentication from "expo-apple-authentication"
//        AppleAuthentication.signInAsync({ requestedScopes: [FULL_NAME, EMAIL] })
//     5. Android'de Apple Sign-In gösterilemez — Platform.OS === "ios" ile guard
//
// Şu anda expo-auth-session / expo-apple-authentication / expo-crypto STATİK
// İMPORT EDİLMEZ — aksi hâlde Expo Go SDK 54 bazı yüklemelerde
// "Cannot find native module ExpoCryptoAES" hatası fırlatıyor.

import { useCallback } from "react";

export type SocialUser = {
  email: string;
  name: string;
  picture?: string;
  sub: string;
  provider: "google" | "apple";
};

const MOCK_NAMES = [
  "Ayşe Yılmaz",
  "Mehmet Demir",
  "Zeynep Kaya",
  "Emre Şahin",
  "Selin Öztürk",
  "Burak Aydın",
  "Elif Çelik"
];

function pickName() {
  return MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z]/g, "");
}

// Backwards-compat alias.
export type GoogleUser = SocialUser;
export type AppleUser = SocialUser;

export function useGoogleAuth(onUser: (u: SocialUser) => void) {
  const signIn = useCallback(async () => {
    const n = pickName();
    const slug = slugify(n);
    const sub = "google-mock-" + Math.random().toString(36).slice(2, 10);
    onUser({
      email: `${slug}@gmail.com`,
      name: n,
      picture: `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(n)}`,
      sub,
      provider: "google"
    });
  }, [onUser]);

  return { signIn, isReady: true, isMock: true };
}

export function useAppleAuth(onUser: (u: SocialUser) => void) {
  const signIn = useCallback(async () => {
    const n = pickName();
    const slug = slugify(n);
    const sub = "apple-mock-" + Math.random().toString(36).slice(2, 10);
    // Apple'ın "Hide My Email" özelliği gerçek akışta privaterelay.appleid.com
    // ile maskelenmiş bir adres döner — mock için bunu taklit ediyoruz.
    onUser({
      email: `${slug}@privaterelay.appleid.com`,
      name: n,
      picture: `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(n)}&backgroundColor=000000&textColor=ffffff`,
      sub,
      provider: "apple"
    });
  }, [onUser]);

  return { signIn, isReady: true, isMock: true };
}
