export type FeedPost = { id: string; author: string; text: string; minutesAgo: number; reactions: number };

export const FEED: FeedPost[] = [
  { id: "f1", author: "Ahmet Y.", text: "3km koştu · sabah yürüyüşü", minutesAgo: 12, reactions: 8 },
  { id: "f2", author: "Caferağa Mahallesi", text: "Haftalık 1. olduk 🏆", minutesAgo: 45, reactions: 41 },
  { id: "f3", author: "Zeynep K.", text: "BELPA kafede kahve aldım, +%30 indirim ☕", minutesAgo: 90, reactions: 14 },
  { id: "f4", author: "Mehmet D.", text: "Bugünki adım: 9.420 — kişisel rekor", minutesAgo: 130, reactions: 22 },
  { id: "f5", author: "Belediye", text: "Yeni görev: Cuma arabasız market günü — +200 bonus", minutesAgo: 240, reactions: 73 },
  { id: "f6", author: "Elif Ş.", text: "Sahil bisikleti — 7km", minutesAgo: 360, reactions: 18 },
  { id: "f7", author: "Moda Mahallesi", text: "Caferağa'yı geçtik, 1.'yiz", minutesAgo: 420, reactions: 55 },
  { id: "f8", author: "Berk A.", text: "Mehmet Usta'dan filtre kahve aldım — puanla bedava", minutesAgo: 600, reactions: 12 },
  { id: "f9", author: "Selin D.", text: "Yoga dersine başladım, ilk hafta indirim 🙏", minutesAgo: 720, reactions: 9 },
  { id: "f10", author: "Onur P.", text: "Mahalle yürüyüşü cuma 19:00 buluşuyoruz", minutesAgo: 900, reactions: 31 }
];
