import type { ActivityRecord, Backend, RedemptionRecord } from "./types";

const activities = new Map<string, ActivityRecord[]>();
const redemptions = new Map<string, RedemptionRecord[]>();

export const seedBackend: Backend = {
  async recordActivity(a) {
    const arr = activities.get(a.uid) ?? [];
    arr.unshift(a);
    activities.set(a.uid, arr);
  },
  async recordRedemption(r) {
    const arr = redemptions.get(r.uid) ?? [];
    arr.unshift(r);
    redemptions.set(r.uid, arr);
  },
  async listRecentActivities(uid) {
    return activities.get(uid) ?? [];
  },
  async listRedemptions(uid) {
    return redemptions.get(uid) ?? [];
  }
};
