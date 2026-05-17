import { NEIGHBORHOODS } from "@/constants/seed/neighborhoods";
import { REWARDS } from "@/constants/seed/rewards";
import { FAKE_USERS } from "@/constants/seed/fakeUsers";
import { FAKE_ACTIVITIES } from "@/constants/seed/fakeActivities";

describe("seed data", () => {
  test("32 neighborhoods with unique nid", () => {
    expect(NEIGHBORHOODS).toHaveLength(32);
    expect(new Set(NEIGHBORHOODS.map((n) => n.nid)).size).toBe(32);
  });
  test("20 rewards across 5 partners", () => {
    expect(REWARDS).toHaveLength(20);
    expect(new Set(REWARDS.map((r) => r.partner))).toEqual(new Set(["belpa", "municipal_sports", "culture", "local", "transport"]));
  });
  test("50 fake users with unique uids", () => {
    expect(FAKE_USERS).toHaveLength(50);
    expect(new Set(FAKE_USERS.map((u) => u.uid)).size).toBe(50);
  });
  test("200 fake activities, all reference known users", () => {
    expect(FAKE_ACTIVITIES).toHaveLength(200);
    const userIds = new Set(FAKE_USERS.map((u) => u.uid));
    for (const a of FAKE_ACTIVITIES) expect(userIds.has(a.uid)).toBe(true);
  });
  test("fake activities respect daily cap of 1000 points", () => {
    for (const a of FAKE_ACTIVITIES) expect(a.points).toBeLessThanOrEqual(1000);
  });
});
