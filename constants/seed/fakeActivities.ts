import { FAKE_USERS } from "./fakeUsers";

export type ActivityType = "walk" | "run" | "bike";

export type FakeActivity = {
  aid: string;
  uid: string;
  type: ActivityType;
  steps: number;
  distanceKm: number;
  durationMin: number;
  points: number;
  startedAt: number;
};

const TYPES: ActivityType[] = ["walk", "run", "bike"];
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
  const distanceKm = +(rand() * 6 + 0.5).toFixed(2);
  const steps = type === "walk" ? Math.floor(distanceKm * 1300) : type === "run" ? Math.floor(distanceKm * 1100) : 0;
  const durationMin = Math.floor(distanceKm * (type === "bike" ? 4 : type === "run" ? 6 : 12));
  const pointsPerKm = { walk: 50, run: 80, bike: 30 }[type];
  const points = Math.min(1000, Math.round(distanceKm * pointsPerKm));
  const dayOffset = Math.floor(rand() * 7);
  return {
    aid: `seed-act-${i}`,
    uid: u.uid,
    type,
    steps,
    distanceKm,
    durationMin,
    points,
    startedAt: now - dayOffset * DAY - Math.floor(rand() * DAY)
  };
});
