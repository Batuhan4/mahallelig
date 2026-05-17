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
