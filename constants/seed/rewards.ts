export type RewardPartner = "belpa" | "municipal_sports" | "culture" | "local" | "transport";

export type Reward = {
  rid: string;
  title: string;
  partner: RewardPartner;
  cost: number;
  description: string;
  termsTr: string;
};

export const REWARDS: Reward[] = [
  { rid: "belpa-coffee-30", title: "BELPA Kafe %30 içecek", partner: "belpa", cost: 10000, description: "BELPA kafelerinde %30 içecek indirimi", termsTr: "Tek kullanımlık. 7 gün geçerli." },
  { rid: "belpa-meal-20", title: "BELPA Kafe %20 menü", partner: "belpa", cost: 14000, description: "BELPA günün menüsünde %20 indirim", termsTr: "Tek kullanımlık. Hafta sonu geçerli değil." },
  { rid: "belpa-breakfast", title: "BELPA Kahvaltı 1+1", partner: "belpa", cost: 18000, description: "Cumartesi kahvaltıda 1+1", termsTr: "Sadece cumartesi 09:00-12:00." },
  { rid: "muni-sports-day", title: "Spor Tesisi · 1 gün ücretsiz", partner: "municipal_sports", cost: 25000, description: "Belediye spor tesisinde 1 günlük tam giriş", termsTr: "Sauna hariç. 14 gün içinde kullanılmalı." },
  { rid: "muni-pool-3", title: "Yüzme Havuzu · 3 giriş", partner: "municipal_sports", cost: 32000, description: "Belediye havuzunda 3 ayrı giriş", termsTr: "30 gün içinde kullanılmalı." },
  { rid: "muni-yoga-month", title: "Yoga · 1 ay indirim", partner: "municipal_sports", cost: 28000, description: "Belediye yoga kursunda %50", termsTr: "Yeni kayıtlar için." },
  { rid: "culture-ticket-50", title: "Kültür Merkezi %50 bilet", partner: "culture", cost: 15000, description: "Tiyatro/konser biletinde %50", termsTr: "Belediye kültür merkezi etkinlikleri." },
  { rid: "culture-museum", title: "Belediye Müzesi · ücretsiz", partner: "culture", cost: 9000, description: "Müze giriş ücretsiz", termsTr: "1 kişi. 30 gün geçerli." },
  { rid: "culture-workshop", title: "Atölye %30", partner: "culture", cost: 12000, description: "Kültür merkezi atölye %30", termsTr: "Boş kontenjana göre." },
  { rid: "local-mehmet-coffee", title: "Mehmet Usta · Filtre kahve", partner: "local", cost: 8000, description: "Caferağa Mehmet Usta'da ücretsiz filtre kahve", termsTr: "Tek kullanımlık." },
  { rid: "local-ayse-simit", title: "Ayşe Teyze · Simit + çay", partner: "local", cost: 4000, description: "Mahalle fırınında simit + çay", termsTr: "Hafta içi 08:00-10:00." },
  { rid: "local-bike-service", title: "Bisiklet Servisi %25", partner: "local", cost: 20000, description: "Anlaşmalı bisikletçide bakım %25", termsTr: "30 gün geçerli." },
  { rid: "local-bookshop", title: "Mahalle Kitapçısı %15", partner: "local", cost: 11000, description: "Yerel kitapçıda %15", termsTr: "Yeni kitap, tek kullanım." },
  { rid: "local-yoga-studio", title: "Mahalle Yoga · Deneme dersi", partner: "local", cost: 13000, description: "Yerel yoga stüdyosunda ücretsiz deneme", termsTr: "Yeni üyeler." },
  { rid: "local-greengrocer", title: "Manav · ₺50 indirim", partner: "local", cost: 9500, description: "Mahalle manavında ₺50 indirim", termsTr: "₺200 ve üzeri alışverişte." },
  { rid: "transport-bus-5", title: "İETT · 5 ücretsiz geçiş", partner: "transport", cost: 16000, description: "İETT otobüsünde 5 geçiş", termsTr: "İstanbulkart'a yüklenir." },
  { rid: "transport-bike-rent", title: "Bisiklet Kiralama · 2 saat", partner: "transport", cost: 8500, description: "Belediye bisikleti 2 saat ücretsiz", termsTr: "Hafta içi geçerli." },
  { rid: "transport-ferry", title: "Vapur · 3 geçiş", partner: "transport", cost: 10500, description: "Şehir hatları 3 vapur geçişi", termsTr: "Karayolu hariç." },
  { rid: "transport-park-ride", title: "Park Et & Devam Et %20", partner: "transport", cost: 7000, description: "Belediye otoparkında %20", termsTr: "İlk 4 saat." },
  { rid: "transport-scooter", title: "Scooter · 30 dk", partner: "transport", cost: 6000, description: "Belediye scooter 30 dk ücretsiz", termsTr: "Tek kullanım." }
];
