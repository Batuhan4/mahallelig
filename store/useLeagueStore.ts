import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Mission = {
  id: string;
  targetNid: string;
  title: string;
  bonusPoints: number;
  createdAt: number;
};

type State = {
  weeklyDeltaByNid: Record<string, number>;
  missions: Mission[];
  bumpUserNeighborhood: (nid: string, points: number) => void;
  addMission: (m: Omit<Mission, "id" | "createdAt">) => Mission;
  reset: () => void;
};

export const useLeagueStore = create<State>()(
  persist(
    (set, get) => ({
      weeklyDeltaByNid: {},
      missions: [],
      bumpUserNeighborhood: (nid, points) =>
        set({ weeklyDeltaByNid: { ...get().weeklyDeltaByNid, [nid]: (get().weeklyDeltaByNid[nid] ?? 0) + points } }),
      addMission: (m) => {
        const id = "mis-" + Math.random().toString(36).slice(2, 8);
        const mission: Mission = { id, createdAt: Date.now(), ...m };
        set({ missions: [mission, ...get().missions] });
        return mission;
      },
      reset: () => set({ weeklyDeltaByNid: {}, missions: [] })
    }),
    {
      name: "mahallelig-league",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
