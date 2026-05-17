import { create } from "zustand";

// Belediye paneline frontend-only erişim kontrolü.
// Persist YOK — her app yeniden açılışında çıkış yapılmış olur (demo dostu).
// Üretimde gerçek SSO / OAuth ile değiştirilecek.

const DEMO_EMAIL = "a@a.com";
const DEMO_PASSWORD = "1234";

type State = {
  authed: boolean;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
};

export const useMuniAuthStore = create<State>((set) => ({
  authed: false,
  signIn: (email, password) => {
    const ok = email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
    if (ok) set({ authed: true });
    return ok;
  },
  signOut: () => set({ authed: false })
}));

export const MUNI_DEMO_CREDS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
