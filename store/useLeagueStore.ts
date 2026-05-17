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
