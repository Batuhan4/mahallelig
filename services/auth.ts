// Sosyal giriş.
//
// APPLE (gerçek):
//   - expo-apple-authentication (Expo Go SDK 54'te bundle edilmiş gelir)
//   - app.json: "ios": { "usesAppleSignIn": true } + plugin eklendi
//   - Sadece iOS — Platform.OS === "ios" guard'ı ile UI'da gizleniyor
//   - İlk girişte: fullName.givenName + familyName + email döner;
//     SONRAKİ girişlerde Apple sadece "user" (sub) döner — uygulamanın
//     ilk seferki veriyi saklaması beklenir
//
// GOOGLE (mock):
//   - Hâlâ mock — Google Cloud Console'dan client ID alındığında
//     expo-auth-session/providers/google ile entegre edilecek
//   - Mock fallback Google için kasıtlı (kurulu değil); Apple için fallback YOK,
//     hata propagate olur

import { useCallback } from "react";
import { Platform } from "react-native";

// Lazy require: Android/web bundle'ında expo-apple-authentication'ı yüklemeye
// çalışmasın diye platform guard'ı ile gate ediyoruz.
type AppleAuthModule = typeof import("expo-apple-authentication");
let AppleAuthentication: AppleAuthModule | null = null;
if (Platform.OS === "ios") {
  try {
    AppleAuthentication = require("expo-apple-authentication") as AppleAuthModule;
  } catch {
    AppleAuthentication = null;
  }
}

export type SocialUser = {
  email: string;
  name: string;
  picture?: string;
  sub: string;
  provider: "google" | "apple" | "guest";
};

// Backwards-compat alias.
export type GoogleUser = SocialUser;
export type AppleUser = SocialUser;

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

  return { signIn, isReady: true, isMock: true, isAvailable: true };
}

export const APPLE_AVAILABLE = AppleAuthentication !== null;

export function useAppleAuth(onUser: (u: SocialUser) => void) {
  const signIn = useCallback(async () => {
    if (!AppleAuthentication) {
      throw new Error("Apple ile giriş yalnızca iOS cihazlarda kullanılabilir.");
    }
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL
      ]
    });

    // İsim sadece ilk girişte gelir; sonrakilerde null.
    const given = credential.fullName?.givenName?.trim() ?? "";
    const family = credential.fullName?.familyName?.trim() ?? "";
    const name = [given, family].filter(Boolean).join(" ");

    onUser({
      email: credential.email ?? "",
      name,
      // Apple avatar dönmez — kullanıcı sonradan kendi yükleyebilir.
      sub: credential.user,
      provider: "apple"
    });
  }, [onUser]);

  return { signIn, isReady: true, isMock: false, isAvailable: APPLE_AVAILABLE };
}
