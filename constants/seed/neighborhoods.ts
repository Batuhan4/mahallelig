export type Neighborhood = {
  nid: string;
  name: string;
  district: string;
  city: string;
  weeklyPoints: number;
  populationProxy: number;
};

export const NEIGHBORHOODS: Neighborhood[] = [
  { nid: "caferaga", name: "Caferağa", district: "Kadıköy", city: "İstanbul", weeklyPoints: 48200, populationProxy: 6200 },
  { nid: "moda", name: "Moda", district: "Kadıköy", city: "İstanbul", weeklyPoints: 51100, populationProxy: 5800 },
  { nid: "fenerbahce", name: "Fenerbahçe", district: "Kadıköy", city: "İstanbul", weeklyPoints: 38400, populationProxy: 4900 },
  { nid: "kozyatagi", name: "Kozyatağı", district: "Kadıköy", city: "İstanbul", weeklyPoints: 41700, populationProxy: 5100 },
  { nid: "suadiye", name: "Suadiye", district: "Kadıköy", city: "İstanbul", weeklyPoints: 22800, populationProxy: 4400 },
  { nid: "bostanci", name: "Bostancı", district: "Kadıköy", city: "İstanbul", weeklyPoints: 34900, populationProxy: 4600 },
  { nid: "goztepe", name: "Göztepe", district: "Kadıköy", city: "İstanbul", weeklyPoints: 31200, populationProxy: 4700 },
  { nid: "erenkoy", name: "Erenköy", district: "Kadıköy", city: "İstanbul", weeklyPoints: 29600, populationProxy: 4200 },
  { nid: "acibadem", name: "Acıbadem", district: "Kadıköy", city: "İstanbul", weeklyPoints: 27100, populationProxy: 3900 },
  { nid: "fikirtepe", name: "Fikirtepe", district: "Kadıköy", city: "İstanbul", weeklyPoints: 24800, populationProxy: 3700 },
  { nid: "cihangir", name: "Cihangir", district: "Beyoğlu", city: "İstanbul", weeklyPoints: 45300, populationProxy: 3300 },
  { nid: "galata", name: "Galata", district: "Beyoğlu", city: "İstanbul", weeklyPoints: 39800, populationProxy: 3100 },
  { nid: "kasimpasa", name: "Kasımpaşa", district: "Beyoğlu", city: "İstanbul", weeklyPoints: 21900, populationProxy: 4500 },
  { nid: "tarlabasi", name: "Tarlabaşı", district: "Beyoğlu", city: "İstanbul", weeklyPoints: 19400, populationProxy: 5200 },
  { nid: "etiler", name: "Etiler", district: "Beşiktaş", city: "İstanbul", weeklyPoints: 36100, populationProxy: 3800 },
  { nid: "bebek", name: "Bebek", district: "Beşiktaş", city: "İstanbul", weeklyPoints: 33500, populationProxy: 2900 },
  { nid: "arnavutkoy", name: "Arnavutköy", district: "Beşiktaş", city: "İstanbul", weeklyPoints: 28200, populationProxy: 2400 },
  { nid: "ortakoy", name: "Ortaköy", district: "Beşiktaş", city: "İstanbul", weeklyPoints: 31700, populationProxy: 2700 },
  { nid: "levent", name: "Levent", district: "Beşiktaş", city: "İstanbul", weeklyPoints: 26800, populationProxy: 3400 },
  { nid: "nisantasi", name: "Nişantaşı", district: "Şişli", city: "İstanbul", weeklyPoints: 35600, populationProxy: 3600 },
  { nid: "mecidiyekoy", name: "Mecidiyeköy", district: "Şişli", city: "İstanbul", weeklyPoints: 23400, populationProxy: 5800 },
  { nid: "kurtulus", name: "Kurtuluş", district: "Şişli", city: "İstanbul", weeklyPoints: 27800, populationProxy: 4200 },
  { nid: "fatih_sultanahmet", name: "Sultanahmet", district: "Fatih", city: "İstanbul", weeklyPoints: 30100, populationProxy: 3300 },
  { nid: "fatih_balat", name: "Balat", district: "Fatih", city: "İstanbul", weeklyPoints: 24900, populationProxy: 3800 },
  { nid: "fatih_fener", name: "Fener", district: "Fatih", city: "İstanbul", weeklyPoints: 22500, populationProxy: 3500 },
  { nid: "uskudar_kuzguncuk", name: "Kuzguncuk", district: "Üsküdar", city: "İstanbul", weeklyPoints: 26400, populationProxy: 2800 },
  { nid: "uskudar_beylerbeyi", name: "Beylerbeyi", district: "Üsküdar", city: "İstanbul", weeklyPoints: 23700, populationProxy: 3200 },
  { nid: "uskudar_camlica", name: "Çamlıca", district: "Üsküdar", city: "İstanbul", weeklyPoints: 20800, populationProxy: 3900 },
  { nid: "atasehir_atattepe", name: "Atatürk Mahallesi", district: "Ataşehir", city: "İstanbul", weeklyPoints: 25600, populationProxy: 4800 },
  { nid: "maltepe_idealtepe", name: "İdealtepe", district: "Maltepe", city: "İstanbul", weeklyPoints: 22100, populationProxy: 4300 },
  { nid: "bakirkoy_atakoy", name: "Ataköy", district: "Bakırköy", city: "İstanbul", weeklyPoints: 28900, populationProxy: 5100 },
  { nid: "sariyer_yenikoy", name: "Yeniköy", district: "Sarıyer", city: "İstanbul", weeklyPoints: 26700, populationProxy: 2600 }
];
