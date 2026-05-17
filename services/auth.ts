import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

// Google OAuth client ID'leri ileride buraya gelecek (Google Cloud Console).
// Boş bırakıldığında akış otomatik olarak "mock" mod'a düşer ve test için
// rastgele bir Google kullanıcı döner.
const GOOGLE_EXPO_CLIENT_ID = "";
const GOOGLE_IOS_CLIENT_ID = "";
const GOOGLE_ANDROID_CLIENT_ID = "";
const GOOGLE_WEB_CLIENT_ID = "";

export type GoogleUser = {
  email: string;
  name: string;
  picture?: string;
  sub: string;
};

const hasRealCreds = !!(GOOGLE_EXPO_CLIENT_ID || GOOGLE_IOS_CLIENT_ID || GOOGLE_ANDROID_CLIENT_ID || GOOGLE_WEB_CLIENT_ID);

export function useGoogleAuth(onUser: (u: GoogleUser) => void) {
  const [, response, promptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || undefined,
    webClientId: GOOGLE_WEB_CLIENT_ID || undefined,
    scopes: ["profile", "email"]
  });

  useEffect(() => {
    if (response?.type !== "success") return;
    const token = response.authentication?.accessToken;
    if (!token) return;
    (async () => {
      try {
        const r = await fetch("https://www.googleapis.com/userinfo/v2/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const u = await r.json();
        onUser({ email: u.email, name: u.name, picture: u.picture, sub: u.id });
      } catch {}
    })();
  }, [response, onUser]);

  async function signIn() {
    if (!hasRealCreds) {
      // Mock: rastgele demo kullanıcı üret, gerçek OAuth atlanır.
      const names = ["Ayşe Yılmaz", "Mehmet Demir", "Zeynep Kaya", "Emre Şahin", "Selin Öztürk"];
      const n = names[Math.floor(Math.random() * names.length)];
      const sub = "mock-" + Math.random().toString(36).slice(2, 10);
      const slug = n.toLowerCase().replace(/[^a-z]/g, "");
      onUser({
        email: `${slug}@gmail.com`,
        name: n,
        picture: `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(n)}`,
        sub
      });
      return;
    }
    await promptAsync();
  }

  return { signIn, isReady: true, isMock: !hasRealCreds };
}
