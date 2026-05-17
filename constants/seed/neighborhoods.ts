export type Neighborhood = {
  nid: string;
  name: string;
  district: string;
  city: string;
  // Mahalle merkezi (yaklaşık centroid). GPS auto-detect için kullanılır.
  lat: number;
  lon: number;
  weeklyPoints: number;
  populationProxy: number;
};

export const NEIGHBORHOODS: Neighborhood[] = [
  { nid: "caferaga", name: "Caferağa", district: "Kadıköy", city: "İstanbul", lat: 40.9897, lon: 29.0258, weeklyPoints: 48200, populationProxy: 6200 },
  { nid: "moda", name: "Moda", district: "Kadıköy", city: "İstanbul", lat: 40.9824, lon: 29.0307, weeklyPoints: 51100, populationProxy: 5800 },
  { nid: "fenerbahce", name: "Fenerbahçe", district: "Kadıköy", city: "İstanbul", lat: 40.9712, lon: 29.0394, weeklyPoints: 38400, populationProxy: 4900 },
  { nid: "kozyatagi", name: "Kozyatağı", district: "Kadıköy", city: "İstanbul", lat: 40.9819, lon: 29.0905, weeklyPoints: 41700, populationProxy: 5100 },
  { nid: "suadiye", name: "Suadiye", district: "Kadıköy", city: "İstanbul", lat: 40.9612, lon: 29.0728, weeklyPoints: 22800, populationProxy: 4400 },
  { nid: "bostanci", name: "Bostancı", district: "Kadıköy", city: "İstanbul", lat: 40.9477, lon: 29.0951, weeklyPoints: 34900, populationProxy: 4600 },
  { nid: "goztepe", name: "Göztepe", district: "Kadıköy", city: "İstanbul", lat: 40.9714, lon: 29.0612, weeklyPoints: 31200, populationProxy: 4700 },
  { nid: "erenkoy", name: "Erenköy", district: "Kadıköy", city: "İstanbul", lat: 40.9683, lon: 29.0697, weeklyPoints: 29600, populationProxy: 4200 },
  { nid: "acibadem", name: "Acıbadem", district: "Kadıköy", city: "İstanbul", lat: 41.0008, lon: 29.0473, weeklyPoints: 27100, populationProxy: 3900 },
  { nid: "fikirtepe", name: "Fikirtepe", district: "Kadıköy", city: "İstanbul", lat: 40.9925, lon: 29.0617, weeklyPoints: 24800, populationProxy: 3700 },
  { nid: "cihangir", name: "Cihangir", district: "Beyoğlu", city: "İstanbul", lat: 41.0335, lon: 28.9810, weeklyPoints: 45300, populationProxy: 3300 },
  { nid: "galata", name: "Galata", district: "Beyoğlu", city: "İstanbul", lat: 41.0258, lon: 28.9745, weeklyPoints: 39800, populationProxy: 3100 },
  { nid: "kasimpasa", name: "Kasımpaşa", district: "Beyoğlu", city: "İstanbul", lat: 41.0397, lon: 28.9694, weeklyPoints: 21900, populationProxy: 4500 },
  { nid: "tarlabasi", name: "Tarlabaşı", district: "Beyoğlu", city: "İstanbul", lat: 41.0367, lon: 28.9776, weeklyPoints: 19400, populationProxy: 5200 },
  { nid: "etiler", name: "Etiler", district: "Beşiktaş", city: "İstanbul", lat: 41.0824, lon: 29.0356, weeklyPoints: 36100, populationProxy: 3800 },
  { nid: "bebek", name: "Bebek", district: "Beşiktaş", city: "İstanbul", lat: 41.0775, lon: 29.0427, weeklyPoints: 33500, populationProxy: 2900 },
  { nid: "arnavutkoy", name: "Arnavutköy", district: "Beşiktaş", city: "İstanbul", lat: 41.0686, lon: 29.0436, weeklyPoints: 28200, populationProxy: 2400 },
  { nid: "ortakoy", name: "Ortaköy", district: "Beşiktaş", city: "İstanbul", lat: 41.0489, lon: 29.0285, weeklyPoints: 31700, populationProxy: 2700 },
  { nid: "levent", name: "Levent", district: "Beşiktaş", city: "İstanbul", lat: 41.0794, lon: 29.0136, weeklyPoints: 26800, populationProxy: 3400 },
  { nid: "nisantasi", name: "Nişantaşı", district: "Şişli", city: "İstanbul", lat: 41.0490, lon: 28.9930, weeklyPoints: 35600, populationProxy: 3600 },
  { nid: "mecidiyekoy", name: "Mecidiyeköy", district: "Şişli", city: "İstanbul", lat: 41.0660, lon: 28.9929, weeklyPoints: 23400, populationProxy: 5800 },
  { nid: "kurtulus", name: "Kurtuluş", district: "Şişli", city: "İstanbul", lat: 41.0541, lon: 28.9789, weeklyPoints: 27800, populationProxy: 4200 },
  { nid: "fatih_sultanahmet", name: "Sultanahmet", district: "Fatih", city: "İstanbul", lat: 41.0086, lon: 28.9776, weeklyPoints: 30100, populationProxy: 3300 },
  { nid: "fatih_balat", name: "Balat", district: "Fatih", city: "İstanbul", lat: 41.0291, lon: 28.9486, weeklyPoints: 24900, populationProxy: 3800 },
  { nid: "fatih_fener", name: "Fener", district: "Fatih", city: "İstanbul", lat: 41.0294, lon: 28.9514, weeklyPoints: 22500, populationProxy: 3500 },
  { nid: "uskudar_kuzguncuk", name: "Kuzguncuk", district: "Üsküdar", city: "İstanbul", lat: 41.0395, lon: 29.0327, weeklyPoints: 26400, populationProxy: 2800 },
  { nid: "uskudar_beylerbeyi", name: "Beylerbeyi", district: "Üsküdar", city: "İstanbul", lat: 41.0457, lon: 29.0431, weeklyPoints: 23700, populationProxy: 3200 },
  { nid: "uskudar_camlica", name: "Çamlıca", district: "Üsküdar", city: "İstanbul", lat: 41.0287, lon: 29.0681, weeklyPoints: 20800, populationProxy: 3900 },
  { nid: "atasehir_atattepe", name: "Atatürk Mahallesi", district: "Ataşehir", city: "İstanbul", lat: 40.9866, lon: 29.1276, weeklyPoints: 25600, populationProxy: 4800 },
  { nid: "maltepe_idealtepe", name: "İdealtepe", district: "Maltepe", city: "İstanbul", lat: 40.9355, lon: 29.1320, weeklyPoints: 22100, populationProxy: 4300 },
  { nid: "bakirkoy_atakoy", name: "Ataköy", district: "Bakırköy", city: "İstanbul", lat: 40.9799, lon: 28.8629, weeklyPoints: 28900, populationProxy: 5100 },
  { nid: "sariyer_yenikoy", name: "Yeniköy", district: "Sarıyer", city: "İstanbul", lat: 41.1170, lon: 29.0640, weeklyPoints: 26700, populationProxy: 2600 }
];
