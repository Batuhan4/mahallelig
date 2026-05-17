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
      demoMode: false,
      notificationsEnabled: false,
      toggleDemoMode: () => set({ demoMode: !get().demoMode }),
      setNotificationsEnabled: (v) => set({ notificationsEnabled: v })
    }),
    { name: "mahallelig-settings", storage: createJSONStorage(() => AsyncStorage) }
  )
);
