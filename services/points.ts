import type { ActivityType } from "@/constants/seed/fakeActivities";

export const DAILY_POINT_CAP = 1000;

// Walk: per km (steps fall back if no GPS).
// Bike: per km only — steps meaningless.
// Stairs: per floor climbed (≈ 3m altitude or 14 steps if no barometer).
const PER_KM_WALK = 50;
const PER_KM_BIKE = 30;
const STAIRS_PER_FLOOR = 8;
const STAIRS_FALLBACK_STEPS_PER_FLOOR = 14;
const PER_THOUSAND_STEPS = 10;

export function pointsForActivity(opts: {
  type: ActivityType;
  steps: number;
  distanceKm: number;
  altitudeM?: number;
  activeTransport?: boolean;
}): number {
  let base = 0;
  if (opts.type === "bike") {
    base = Math.round(opts.distanceKm * PER_KM_BIKE);
  } else if (opts.type === "stairs") {
    const floors = opts.altitudeM
      ? opts.altitudeM / 3
      : opts.steps / STAIRS_FALLBACK_STEPS_PER_FLOOR;
    base = Math.round(floors * STAIRS_PER_FLOOR);
  } else {
    // walk: best of step-based or km-based
    const stepPts = Math.floor(opts.steps / 1000) * PER_THOUSAND_STEPS;
    const distancePts = Math.round(opts.distanceKm * PER_KM_WALK);
    base = Math.max(stepPts, distancePts);
  }
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
