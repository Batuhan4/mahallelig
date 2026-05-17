import { neighborhoodLeaderboard, userLeaderboardForNeighborhood, seasonCountdown } from "@/services/league";
import { NEIGHBORHOODS } from "@/constants/seed/neighborhoods";

describe("league", () => {
  test("neighborhoodLeaderboard sorted desc", () => {
    const rows = neighborhoodLeaderboard();
    expect(rows).toHaveLength(NEIGHBORHOODS.length);
    for (let i = 1; i < rows.length; i++) expect(rows[i - 1].weeklyPoints).toBeGreaterThanOrEqual(rows[i].weeklyPoints);
    expect(rows[0].rank).toBe(1);
  });
  test("delta adds to base weeklyPoints", () => {
    const base = neighborhoodLeaderboard();
    const boosted = neighborhoodLeaderboard({ weeklyPointsByNid: { caferaga: 100000 } });
    expect(boosted.find((r) => r.nid === "caferaga")!.rank).toBe(1);
    expect(boosted.find((r) => r.nid === "caferaga")!.weeklyPoints).toBeGreaterThan(base.find((r) => r.nid === "caferaga")!.weeklyPoints);
  });
  test("userLeaderboardForNeighborhood includes you with isYou flag", () => {
    const rows = userLeaderboardForNeighborhood("caferaga", { uid: "me", displayName: "Murat", weeklyPoints: 9999 });
    const me = rows.find((r) => r.uid === "me");
    expect(me?.isYou).toBe(true);
    expect(rows[0].uid).toBe("me");
  });
  test("anonymous peers labeled Komşu #N", () => {
    const rows = userLeaderboardForNeighborhood("caferaga", null);
    for (const r of rows) expect(r.displayName).toMatch(/^Komşu #/);
  });
  test("seasonCountdown returns non-negative days/hours", () => {
    const c = seasonCountdown();
    expect(c.days).toBeGreaterThanOrEqual(0);
    expect(c.hours).toBeGreaterThanOrEqual(0);
  });
});
