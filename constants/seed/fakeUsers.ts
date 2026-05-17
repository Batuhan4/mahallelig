import { NEIGHBORHOODS } from "./neighborhoods";

export type FakeUser = {
  uid: string;
  displayName: string;
  neighborhoodId: string;
  weeklyPoints: number;
  totalPoints: number;
  avatarSeed: string;
};

const FIRST = ["Ahmet", "Mehmet", "Ayşe", "Fatma", "Murat", "Zeynep", "Can", "Elif", "Emre", "Selin", "Burak", "Deniz", "Cem", "Ece", "Berk", "Naz", "Onur", "Pelin", "Kerem", "Sıla"];
const LAST = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Aydın", "Polat", "Arslan", "Doğan", "Koç"];

const seedRand = (s: number) => () => {
  s = (s * 9301 + 49297) % 233280;
  return s / 233280;
};

export const FAKE_USERS: FakeUser[] = (() => {
  const rand = seedRand(42);
  const pool = NEIGHBORHOODS.slice(0, 8);
  return Array.from({ length: 50 }, (_, i) => {
    const f = FIRST[Math.floor(rand() * FIRST.length)];
    const l = LAST[Math.floor(rand() * LAST.length)];
    const n = pool[i % pool.length];
    const weeklyPoints = Math.floor(rand() * 4500) + 500;
    const totalPoints = weeklyPoints * (3 + Math.floor(rand() * 6));
    return {
      uid: `seed-${i.toString().padStart(2, "0")}`,
      displayName: `${f} ${l[0]}.`,
      neighborhoodId: n.nid,
      weeklyPoints,
      totalPoints,
      avatarSeed: `seed-${i}`
    };
  });
})();
