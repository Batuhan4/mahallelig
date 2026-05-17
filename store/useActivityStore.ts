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
