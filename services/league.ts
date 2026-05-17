import { NEIGHBORHOODS, type Neighborhood } from "@/constants/seed/neighborhoods";
import { FAKE_USERS, type FakeUser } from "@/constants/seed/fakeUsers";

export type LeagueRow = { nid: string; name: string; district: string; weeklyPoints: number; rank: number };
export type UserLeagueRow = { uid: string; displayName: string; weeklyPoints: number; rank: number; isYou: boolean };

export function neighborhoodLeaderboard(extra: { weeklyPointsByNid?: Record<string, number> } = {}): LeagueRow[] {
  const merged = NEIGHBORHOODS.map((n) => ({
    ...n,
    weeklyPoints: n.weeklyPoints + (extra.weeklyPointsByNid?.[n.nid] ?? 0)
  }));
  return merged
    .sort((a, b) => b.weeklyPoints - a.weeklyPoints)
    .map((n, i) => ({ nid: n.nid, name: n.name, district: n.district, weeklyPoints: n.weeklyPoints, rank: i + 1 }));
}

export function userLeaderboardForNeighborhood(nid: string, you: { uid: string; displayName: string; weeklyPoints: number } | null): UserLeagueRow[] {
  const peers = FAKE_USERS.filter((u) => u.neighborhoodId === nid).map(anonymize);
  const all = you ? [...peers, { uid: you.uid, displayName: you.displayName, weeklyPoints: you.weeklyPoints, isYou: true }] : peers;
  return all
    .sort((a, b) => b.weeklyPoints - a.weeklyPoints)
    .map((u, i) => ({ ...u, rank: i + 1 }));
}

function anonymize(u: FakeUser, i: number): Omit<UserLeagueRow, "rank"> {
  return { uid: u.uid, displayName: `Komşu #${i + 1}`, weeklyPoints: u.weeklyPoints, isYou: false };
}

export function findNeighborhood(nid: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.nid === nid);
}

export function seasonCountdown(now = Date.now()): { days: number; hours: number } {
  const end = new Date(now);
  const dow = end.getUTCDay(); // 0=Sun
  const daysUntilSunday = (7 - dow) % 7 || 7;
  end.setUTCDate(end.getUTCDate() + daysUntilSunday);
  end.setUTCHours(0, 0, 0, 0);
  const diff = end.getTime() - now;
  return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000) };
}
