import { FAKE_USERS } from "./fakeUsers";

export type ActivityType = "walk" | "bike" | "stairs";

export type FakeActivity = {
  aid: string;
  uid: string;
  type: ActivityType;
  steps: number;
  distanceKm: number;
  altitudeM?: number;
  durationMin: number;
  points: number;
  startedAt: number;
};

const TYPES: ActivityType[] = ["walk", "bike", "stairs"];
const rand = (() => {
  let s = 1337;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
})();

const DAY = 24 * 60 * 60 * 1000;
const now = Date.UTC(2026, 4, 17, 12);

export const FAKE_ACTIVITIES: FakeActivity[] = Array.from({ length: 200 }, (_, i) => {
  const u = FAKE_USERS[Math.floor(rand() * FAKE_USERS.length)];
  const type = TYPES[Math.floor(rand() * TYPES.length)];
  let distanceKm = 0;
  let steps = 0;
  let altitudeM: number | undefined;
  let durationMin = 0;
  let points = 0;
  if (type === "walk") {
    distanceKm = +(rand() * 6 + 0.5).toFixed(2);
    steps = Math.floor(distanceKm * 1300);
    durationMin = Math.floor(distanceKm * 12);
    points = Math.min(1000, Math.round(distanceKm * 50));
  } else if (type === "bike") {
    distanceKm = +(rand() * 18 + 2).toFixed(2);
    steps = 0;
    durationMin = Math.floor(distanceKm * 4);
    points = Math.min(1000, Math.round(distanceKm * 30));
  } else {
    const floors = 5 + Math.floor(rand() * 20);
    altitudeM = floors * 3;
    steps = floors * 14;
    distanceKm = 0;
    durationMin = Math.max(1, Math.floor(floors * 0.5));
    points = Math.min(1000, floors * 8);
  }
  const dayOffset = Math.floor(rand() * 7);
  return {
    aid: `seed-act-${i}`,
    uid: u.uid,
    type,
    steps,
    distanceKm,
    durationMin,
    altitudeM,
    points,
    startedAt: now - dayOffset * DAY - Math.floor(rand() * DAY)
  };
});
