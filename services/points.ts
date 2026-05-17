import type { ActivityType } from "@/constants/seed/fakeActivities";

export const DAILY_POINT_CAP = 1000;

const PER_KM: Record<ActivityType, number> = { walk: 50, run: 80, bike: 30 };
const PER_THOUSAND_STEPS = 10;

export function pointsForActivity(opts: {
  type: ActivityType;
  steps: number;
  distanceKm: number;
  activeTransport?: boolean;
}): number {
  const stepPts = Math.floor(opts.steps / 1000) * PER_THOUSAND_STEPS;
  const distancePts = Math.round(opts.distanceKm * PER_KM[opts.type]);
  const base = Math.max(stepPts, distancePts);
  const bonus = opts.activeTransport ? Math.round(base * 0.2) : 0;
  return Math.min(DAILY_POINT_CAP, base + bonus);
}

export function levelFromPoints(totalPoints: number): number {
  return Math.floor(totalPoints / 1000);
}

export function applyDailyCap(pointsToday: number, earned: number): number {
  const remaining = Math.max(0, DAILY_POINT_CAP - pointsToday);
  return Math.min(earned, remaining);
}
