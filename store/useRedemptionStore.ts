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
