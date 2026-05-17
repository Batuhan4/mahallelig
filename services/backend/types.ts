import type { ActivityType } from "@/constants/seed/fakeActivities";

export type UserProfile = {
  uid: string;
  name: string;
  neighborhoodId: string;
  totalPoints: number;
  level: number;
  badges: string[];
  avatarSeed: string;
  createdAt: number;
};

export type ActivityRecord = {
  aid: string;
  uid: string;
  type: ActivityType;
  steps: number;
  distanceKm: number;
  altitudeM?: number;
  durationMin: number;
  points: number;
  startedAt: number;
  endedAt: number;
};

export type RedemptionRecord = {
  rdid: string;
  uid: string;
  rid: string;
  qrPayload: string;
  status: "active" | "used" | "expired";
  createdAt: number;
  expiresAt: number;
};

export interface Backend {
  recordActivity(a: ActivityRecord): Promise<void>;
  recordRedemption(r: RedemptionRecord): Promise<void>;
  listRecentActivities(uid: string): Promise<ActivityRecord[]>;
  listRedemptions(uid: string): Promise<RedemptionRecord[]>;
}
