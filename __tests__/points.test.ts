import { pointsForActivity, levelFromPoints, applyDailyCap, DAILY_POINT_CAP } from "@/services/points";

describe("points", () => {
  test("walk: 1km ≈ 50 pts", () => {
    expect(pointsForActivity({ type: "walk", steps: 1300, distanceKm: 1 })).toBe(50);
  });
  test("run: 1km ≈ 80 pts", () => {
    expect(pointsForActivity({ type: "run", steps: 1100, distanceKm: 1 })).toBe(80);
  });
  test("bike: 1km ≈ 30 pts", () => {
    expect(pointsForActivity({ type: "bike", steps: 0, distanceKm: 1 })).toBe(30);
  });
  test("active transport bonus +20%", () => {
    const base = pointsForActivity({ type: "walk", steps: 2600, distanceKm: 2 });
    const boosted = pointsForActivity({ type: "walk", steps: 2600, distanceKm: 2, activeTransport: true });
    expect(boosted).toBe(base + Math.round(base * 0.2));
  });
  test("daily cap = 1000", () => {
    expect(pointsForActivity({ type: "run", steps: 0, distanceKm: 100 })).toBe(DAILY_POINT_CAP);
  });
  test("levelFromPoints", () => {
    expect(levelFromPoints(0)).toBe(0);
    expect(levelFromPoints(999)).toBe(0);
    expect(levelFromPoints(1000)).toBe(1);
    expect(levelFromPoints(5432)).toBe(5);
  });
  test("applyDailyCap respects remaining budget", () => {
    expect(applyDailyCap(800, 500)).toBe(200);
    expect(applyDailyCap(1000, 100)).toBe(0);
    expect(applyDailyCap(0, 250)).toBe(250);
  });
});
