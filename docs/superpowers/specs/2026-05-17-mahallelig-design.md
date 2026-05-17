# MahalleLig — Ürün Tasarımı (PRD)

> **Hackathon:** Geleceğin Çözümleri Yarışması · **Dikey 2: Aktif Şehir** · **Hedef Yıl:** 2035
> **Versiyon:** v1 (tasarım) · **Tarih:** 2026-05-17
> **Teslimat:** Sunum + çalışan MVP (React Native + Expo)
> **Kapsam:** Solo geliştirici, 1-2 hafta sprint

---

## İçindekiler

1. [Ürün Vizyonu & Problem](#1-ürün-vizyonu--problem)
2. [Hedef Kullanıcı & Persona](#2-hedef-kullanıcı--persona)
3. [Ürün Özellikleri — 9 Ekran](#3-ürün-özellikleri--9-ekran)
4. [Demo Akışı — Jüri Sunum Senaryosu](#4-demo-akışı--jüri-sunum-senaryosu)
5. [Teknik Mimari](#5-teknik-mimari)
6. [Sprint Planı, Başarı Metrikleri & Sunum](#6-sprint-planı-başarı-metrikleri--sunum)

---

## 1. Ürün Vizyonu & Problem

### Problem

- Türkiye'de yetişkinlerin ~%33'ü yetersiz aktif (DSÖ benzeri kıyas)
- Belediye spor tesisleri (BELPA vb.) yetersiz kullanılıyor — ortalama doluluk düşük
- Vatandaş ile belediye arasında **somut bir aktif yaşam teşvik mekanizması yok**
- Yerel işletmeler dijital sadakat kanallarından mahrum

### Çözüm — Tek Cümle

> **MahalleLig**, vatandaşın her adımını belediyenin sağlık altyapısı ve yerel ekonomiye bağlayan akıllı şehir uygulamasıdır. Yürürsen kahveni alırsın; mahallen lig şampiyonu olursa tesisten ücretsiz yararlanırsın.

### Üç Tarafa Değer

| Taraf | Kazanç |
|---|---|
| **Vatandaş** | Sağlık + somut indirim/ayrıcalık + topluluk hissi |
| **Belediye** | Halk sağlığı KPI + tesis doluluk oranı + veriye dayalı planlama |
| **Yerel işletme** | Yeni müşteri + dijital sadakat kanalı (komisyon yok) |

### 2035 Vizyonu

Her büyükşehrin "MahalleLig" altyapısı var; mahalleler arası yıllık şampiyonalar; sağlık verisi anonim olarak belediye planlamasına girer; arabasız mobilite varsayılan davranış. Şehirler tesis sayısıyla değil, **mahalle lig puanıyla** ölçülür.

### Dikey 2 Eşleşmesi

- ✓ **Kentsel sağlık** — mahalle bazlı sağlık teşviki
- ✓ **Aktif ulaşım** — yürüyüş + bisiklet ödüllendirme
- ✓ **Kamusal sağlık altyapısı** — belediye tesis entegrasyonu
- ✓ **Akıllı şehir uygulaması** — mobil + belediye API'leri

---

## 2. Hedef Kullanıcı & Persona

### Birincil — Vatandaş

**Murat, 34, Kadıköy Caferağa Mahallesi**
- Beyaz yaka, ofis çalışanı, günde ~3.500 adım (hedef: 8.000)
- Telefonunda Google Fit/Apple Health var ama hiç açmıyor
- Mahalle BELPA'sını biliyor ama "ben gitmiyorum oraya" diyor
- Komşularıyla tanışmıyor, mahallesine aidiyet hissi düşük
- Motivasyonu: **somut kazanım** (puan için değil, ücretsiz kahve için yürür)

### İkincil — Belediye Yetkilisi

**Ayşe, 42, Belediye Spor & Sağlık Müdürlüğü**
- Tesis doluluk raporlarını manuel hazırlıyor
- "Hangi mahalleler aktif?" sorusunu cevaplayamıyor
- BELPA bütçesinin hangi mahalleye gideceğine veri olmadan karar veriyor
- KPI'ları: tesis kullanım oranı, kayıtlı vatandaş sayısı, etkinlik katılımı

### Üçüncül — Yerel İşletme (MVP'de yok, vizyonda var)

Mahalle kahvecisi/bisikletçi/spor mağazası — küçük indirim karşılığı yeni müşteri.

### Kim DEĞİL

- Profesyonel sporcu (Strava'ya yetişmiyoruz)
- Quantified-self meraklısı (Garmin/WHOOP var)
- Genel fitness app kullanıcısı (Nike Run Club var)

**Farkımız:** Diğer fitness app'leri "kendin için" hareket et der. MahalleLig **"mahallen için, ödül için, belediyen için"** der. Sosyal + ekonomik + yerel.

---

## 3. Ürün Özellikleri — 9 Ekran

### Bölümleme

- **A) Core (gerçek mantık çalışır — 4):** Bugün · Mahalle Ligi · LigMarket · Belediye Paneli
- **B) Destek (tıklanabilir mock — 5):** Onboarding · Profil · Sosyal Feed · Yerel İşletme Paneli · Push Notification

---

### Ekran 1 · "Bugün" (Vatandaş Ana Sayfa) — CORE

**Amaç:** Vatandaşın bugünki katkısını ve mahalle durumunu tek bakışta göster.

**Bileşenler:**
- Üstte: kullanıcı adı + mahalle rozeti (örn. "Caferağa Mahallesi · Lv 3")
- Büyük kart: bugünki adım + kazanılan MahallePuan (canlı sayar)
- Aktivite durumu: yürüyüş / bisiklet / koşu (sensörden otomatik)
- Mini grafik: son 7 günün adım trendi
- Alt eylem: **"Aktivite Başlat"** butonu

**İki sayım modu:**
- **Pasif:** Pedometer arka planda her zaman gün boyu adım sayar, otomatik puan
- **Aktif:** "Aktivite Başlat" GPS rotası kayda alır, bonus puanla biter (rota görselleştirilir)

**Demo değeri:** Sahnede telefonu cebine koy, sayaç gerçek zamanlı artar, bittiğinde **"+47 MahallePuan"** animasyonu.

---

### Ekran 2 · "Mahalle Ligi" (Liderlik Tablosu) — CORE

**Amaç:** Sosyal rekabet + topluluk hissi. Mahallenin haftalık sıralaması.

**Bileşenler:**
- Üst: mahallenin haftalık toplam puanı + il/ilçedeki sırası ("Caferağa: 4. / 32 mahalle")
- Tab 1: **Mahalle içi sıralama** (sen ve komşuların — komşular anonim "Komşu #1, #2", sen gerçek adınla)
- Tab 2: **Mahalleler arası sıralama** (il bazında)
- Haftanın görevi banner'ı: "Bu hafta arabasız market günü — +200 bonus"
- Geri sayım: "Sezon biter: 3g 11s"

---

### Ekran 3 · "LigMarket" (Ödül Katalogu + Redeem) — CORE

**Amaç:** Puanın somut karşılığını göster. Belediye + yerel işletme entegrasyonunun yüzü.

**Bileşenler:**
- Kategori şeritleri: **Belediye Tesisleri · BELPA · Kültür · Yerel İşletme · Ulaşım**
- Örnek ödül kartları (seed data):
  - BELPA Kafe — 10.000 puan → %30 içecek indirimi
  - Belediye Spor Tesisi — 25.000 puan → 1 günlük ücretsiz giriş
  - Kültür Merkezi — 15.000 puan → etkinlik bileti indirimi
  - Yerel Kahveci (Mehmet Usta) — 8.000 puan → ücretsiz filtre kahve
  - Bisiklet Servisi — 20.000 puan → bakım indirimi
- Kart üstüne: "Yeterli puanın var ✓" / "X puan daha"
- Redeem ekranı: **QR kod üret** (işletme okutur, demo'da statik QR)

---

### Ekran 4 · "Belediye Paneli" (Admin Dashboard — Mockup) — CORE

**Amaç:** Jüriye "iki taraflı düşündük" demek. Belediye için karar destek aracı.

**Erişim (MVP):** App içinde her kullanıcıya açık 5. tab "Belediye". Demo amaçlı tüm vatandaşlar görebilir.
**Erişim (gerçek üründe — v2):** Belediye personeli için ayrı role-based auth, vatandaşa görünmez.

**Bileşenler:**
- Üstte 4 KPI: **Aktif vatandaş · Toplam adım/hafta · Tesis ziyareti · Redeem edilen ödül**
- Mahalle ısı haritası: hangi mahalleler en aktif (renk yoğunluğu)
- Pasta grafik: en çok tercih edilen ödül kategorileri
- Liste: "Bu hafta en aktif 5 mahalle" + "Düşük aktivite uyarısı: Suadiye"
- Aksiyon önerisi: "Suadiye için yeni görev oluştur" butonu (mock)

---

### Ekran 5 · Onboarding — MOCK (ama tıklanabilir, state kaydeder)

**3 step:**
1. Welcome — "MahalleLig'e Hoş Geldin"
2. Mahalle seç (dropdown — 32 mahalle seed)
3. İzinler (konum + bildirim) → "Hadi Başla"

Form yazdığını kaydeder, gerçek user profile yaratır.

---

### Ekran 6 · Profil — MOCK (statik)

- Avatar (dicebear seed)
- İsim, mahalle, toplam puan, level
- Kazanılan rozetler grid
- "Ayarlar" linki → statik liste (bildirim aç/kapa, dil, çıkış)

---

### Ekran 7 · Sosyal Feed — MOCK

8-10 sahte post:
- "Ahmet 3km koştu · 30dk önce"
- "Caferağa mahallesi haftalık 1. oldu · 🏆"
- Like/yorum butonları tıklanır ama efekt yok

---

### Ekran 8 · Yerel İşletme Paneli — MOCK

Belediye Paneli'nin işletme-odaklı variant'ı:
- "Bu hafta 23 müşteri MahallePuan kullandı"
- Redeem geçmişi listesi
- En sevilen ödülün

---

### Ekran 9 · Push Notification — MOCK (lokal)

Expo Notifications ile lokal notif:
- "Mahalleni geçtiler! Bu akşam yürüyüş yap +200 puan"
- Demo'da gizli buton ile tetiklenir

---

## 4. Demo Akışı — Jüri Sunum Senaryosu

**Toplam süre:** ~7 dakika sunum + 3 dakika Q&A. Telefon ekranı projeksiyona aynalanır.

### Sahne 0 · Açılış Hook (0:00 → 0:45)

- **Slayt 1:** "Yetişkinlerin %33'ü yetersiz aktif. BELPA salonlarının ortalama doluluk oranı düşük. Vatandaş ile belediye arasında hareket eden bir köprü yok."
- **Slayt 2:** "MahalleLig: yürüdüğün her adımı belediyenin sağlık altyapısı ve mahallendeki ekonomiye bağlayan akıllı şehir uygulaması."
- **Slayt 3:** Persona kartı (Murat, 34, Caferağa)

### Sahne 1 · Onboarding (0:45 → 1:30)

- "MahalleLig'e Hoş Geldin Murat" → mahalle seç → izinler → "Hadi Başla"
- **Söylenecek:** "30 saniyede içeride. KVKK labirenti yok."

### Sahne 2 · İlk Aktivite & Puan Kazanımı (1:30 → 3:00)

- "Aktivite Başlat" → adım sayar (Demo Mode 10x hız) → "+47 MahallePuan" animasyonu
- **Söylenecek:** "Murat ofise yürüdü. Telefonu cebinde. Hiçbir şey yapmadı. Puan kazandı."

### Sahne 3 · Sosyal Motivasyon — Mahalle Ligi (3:00 → 4:00)

- Mahalle Ligi → Caferağa 4./32 → tab değiştir → sen 7. → arabasız market banner
- Sosyal Feed → "Caferağa mahallesi haftalık 1. oldu 🏆"
- **Söylenecek:** "Strava'dan ayrılıyoruz. Murat kendisi için değil, mahallesi için yürüyor."
- **Yumurta:** Sahnede push notification düşer → "Caferağa mahallesi az önce Moda'yı geçti — 3.'sün!"

### Sahne 4 · Somut Ödül — LigMarket Redeem (4:00 → 5:30)

- LigMarket → BELPA Kafe → "Redeem et" → QR ekranda
- "Bu kodu BELPA kasiyerine göster"
- **Söylenecek:** "Değer döngüsü kapanıyor. Adımı → BELPA doluluğu, yerel kahvecinin müşterisi, mahallenin sağlık skoru."

### Sahne 5 · İki Taraflı Düşündük — Belediye Paneli (5:30 → 6:30)

- Tab değiştir → 4 KPI kart → mahalle ısı haritası → pasta grafik → "Suadiye'de aktivite düştü — yeni görev oluştur"
- Bonus 10sn: Yerel İşletme Paneli → "Mehmet Usta bu hafta 23 yeni müşteri"
- **Söylenecek:** "Belediye için karar destek aracı. Hangi mahalleye bütçe? Hangi tesise yatırım? Veri ile cevaplanıyor."

### Sahne 6 · 2035 Vizyonu & Kapanış (6:30 → 7:00)

- **Slayt — 2035 hedef tablosu:**
  - Türkiye'nin tüm büyükşehirlerinde MahalleLig altyapısı
  - Mahalleler arası yıllık şampiyona
  - Anonim sağlık verisi → 5 yıllık belediye planlamasına girdi
  - Arabasız mobilite = standart davranış
- **Kapanış:** "MahalleLig sadece bir fitness app değil. Belediyenin pasif hizmetini, vatandaşın aktif yaşamına dönüştüren bir yönetişim aracı. 2035'te şehirler tesis sayısıyla değil, **mahalle lig puanıyla** ölçülecek."

### Q&A — Hazır Cevaplar

| Soru | Cevap |
|---|---|
| Belediye neden alsın? | Tesis doluluk + halk sağlığı KPI + veriye dayalı planlama. ROI: 1 yıl pilot BELPA doluluğunda %15 artış hedefi. |
| Sahtekarlık? (telefonu sallayarak) | Sensor fusion + GPS hız tutarlılığı + günlük cap. v2'de Apple Health/Google Fit imzalı veri. |
| Mahremiyet? | Tüm veri anonim & aggregate. Belediye sadece mahalle bazlı toplam görür. KVKK uyumlu. |
| Yerel işletme neden? | Komisyon yok. Reklam değil sadakat. Müşteri başı maliyet sıfır. |
| Diğer şehirler? | Mahalle/ödül tabloları config-driven; her belediye kendi seed data'sıyla 1 haftada açılır. |

---

## 5. Teknik Mimari

### Stack

| Katman | Seçim | Neden |
|---|---|---|
| Framework | **React Native + Expo SDK 51+** | Tek tıkla QR demo, EAS Build, native API kolay |
| Router | **Expo Router 3 (file-based)** | Setup minimum, tab + stack hazır, deep link bedava |
| UI | **NativeWind (Tailwind for RN)** | Hızlı styling, dark mode bedava |
| State | **Zustand + AsyncStorage persist** | Redux yok, 5 dakikada store |
| Backend | **Firebase (Auth + Firestore)** | Anonymous auth = login ekranı yok; Firestore live updates |
| Sensörler | **expo-sensors (Pedometer) + expo-location** | iOS/Android tek API; foreground yeterli |
| Push | **expo-notifications (lokal)** | Demo için lokal trigger, FCM gerekmez |
| Charts | **victory-native veya react-native-svg-charts** | Belediye paneli grafikler |
| QR | **react-native-qrcode-svg** | Redeem ekranında üretim |
| Deploy | **Expo Go (demo) + EAS Update (OTA)** | Jüri telefonuna QR ile aç |

### Sistem Diyagramı

```
┌─────────────────────────────────────────────┐
│  Expo App (iOS + Android, tek kod)          │
│                                             │
│  ┌─────────────┐   ┌──────────────────┐    │
│  │ Native API  │   │ React tree       │    │
│  │  Pedometer  │──▶│  - Zustand store │    │
│  │  Location   │   │  - Expo Router   │    │
│  │  Notif      │   │  - NativeWind    │    │
│  └─────────────┘   └────────┬─────────┘    │
│                             │              │
└─────────────────────────────┼──────────────┘
                              │ Firestore SDK
                              ▼
┌─────────────────────────────────────────────┐
│  Firebase                                   │
│                                             │
│  Auth (Anonymous)  ──▶  uid                 │
│                                             │
│  Firestore Collections:                     │
│    /users/{uid}                             │
│    /activities/{aid}                        │
│    /neighborhoods/{nid}                     │
│    /rewards/{rid}                           │
│    /redemptions/{rdid}                      │
└─────────────────────────────────────────────┘
```

### Veri Modeli (Firestore)

```ts
// users/{uid}
{
  uid: string,
  name: string,
  avatarSeed: string,
  neighborhoodId: string,    // "caferaga"
  totalPoints: number,
  level: number,             // floor(points / 1000)
  badges: string[],
  createdAt: Timestamp
}

// activities/{aid}
{
  uid: string,
  type: "walk" | "run" | "bike",
  steps: number,
  distanceKm: number,
  durationMin: number,
  points: number,
  startedAt: Timestamp,
  endedAt: Timestamp
}

// neighborhoods/{nid}        (seed, statik)
{
  nid: string,                // "caferaga"
  name: string,
  district: string,
  city: string,
  weeklyPoints: number,
  populationProxy: number
}

// rewards/{rid}              (seed, statik)
{
  rid: string,
  title: string,
  partner: "belpa" | "municipal_sports" | "culture" | "local" | "transport",
  cost: number,
  imageUrl: string,
  description: string,
  termsTr: string
}

// redemptions/{rdid}
{
  uid: string,
  rid: string,
  qrPayload: string,
  status: "active" | "used" | "expired",
  createdAt: Timestamp,
  expiresAt: Timestamp
}
```

### Klasör Yapısı

```
app/
  _layout.tsx                 (root, auth bootstrap)
  (onboarding)/
    welcome.tsx
    neighborhood.tsx
    permissions.tsx
  (tabs)/
    _layout.tsx               (5 tab)
    index.tsx                 (Bugün)
    league.tsx                (Mahalle Ligi)
    market.tsx                (LigMarket)
    municipality.tsx          (Belediye Paneli)
    profile.tsx
  reward/[rid].tsx            (Redeem detay + QR)
  feed.tsx                    (Sosyal Feed - modal)
  business.tsx                (Yerel İşletme Paneli - mock)
components/
  PointCounter.tsx
  ActivityCard.tsx
  LeaderboardRow.tsx
  RewardCard.tsx
  KpiCard.tsx
  NeighborhoodHeatmap.tsx
services/
  firebase.ts
  pedometer.ts
  location.ts
  points.ts                   (puan hesap formülü)
  qr.ts
store/
  useUserStore.ts
  useActivityStore.ts
  useLeagueStore.ts
constants/
  seed/
    neighborhoods.ts          (32 İstanbul mahallesi)
    rewards.ts                (20 ödül)
    fakeUsers.ts              (50 sahte vatandaş + geçmiş aktivite)
  theme.ts
```

### Puan Hesabı (MVP)

- 1.000 adım = 10 puan
- 1 km yürüyüş = 50 puan
- 1 km bisiklet = 30 puan
- 1 km koşu = 80 puan
- Aktif ulaşım bonusu (mahalle dışına GPS) = +%20
- Günlük cap: 1.000 puan (sahtekarlık ön)

### Sensor Stratejisi

- Pedometer foreground only (MVP'de background gerekmez)
- Location accuracy: BestForNavigation, 5 sn aralık
- Fallback: sensor erişimi yoksa "Manuel aktivite ekle" butonu (mock)

### Demo Hileleri (legit)

1. **Seed user'lar canlı:** Firestore'da 50 fake user, leaderboard otomatik canlı
2. **Demo Mode:** Adımı 10x hızlandırır, sahnede 30sn = 300 adım hissi
3. **Push tetikleyici:** Profil ekranında gizli buton, sahne 3'te tetiklenir
4. **QR redeem statik:** Demo'da gerçek okutma yok, ekrana yansıt, "İşletme bu kodu okutuyor" de

### Hata Yönetimi & Test

- **Hata:** Sentry `expo-sentry` ile bağlı; demo'da crash görünmesin
- **Test:** Unit test yok (zaman dar). Manuel checklist: onboarding → activity → reward → redeem → leaderboard refresh
- **Offline:** AsyncStorage cache, "stale data" banner

### Risk Listesi

| Risk | Olasılık | Etki | Mitigasyon |
|---|---|---|---|
| Pedometer iOS izin reddi | Orta | Yüksek | Onboarding'de net izin açıklaması + manuel fallback |
| Firestore quota (free tier) | Düşük | Orta | Demo'da spark plan yeterli |
| Sahnede internet yok | Düşük | Çok yüksek | Cache + telefon hotspot yedek |
| Expo Go versiyon uyumsuzluğu | Düşük | Yüksek | Demo öncesi jüri telefonlarına test |

---

## 6. Sprint Planı, Başarı Metrikleri & Sunum

### 14-Günlük Solo Sprint

**Hafta 1 — Foundation & Core**

| Gün | Yapılacaklar | Kabul kriteri |
|---|---|---|
| 1 | Expo SDK 51 + Router + NativeWind + Zustand kur. Firebase + Anonymous Auth + Firestore. | `expo start` çalışır, anon uid Firestore'da |
| 2 | Seed data: 32 mahalle + 20 ödül + 50 fake user + 200 fake activity. Yükleme scripti. | Firestore'da seed, query çalışır |
| 3 | Onboarding 3-step. User profile yaratımı. AsyncStorage persist. | İlk açılışta wizard, sonra tab bar |
| 4 | Bugün ekranı: Pedometer, canlı sayaç, puan hesabı, Firestore yazma. | Telefonda yürürken adım artar, kayıt düşer |
| 5 | Mahalle Ligi: 2 tab, Firestore live query, banner. | Sıralama canlı, başka cihazdan güncellenir |
| 6 | LigMarket: kategoriler, ödül kartları, Redeem + QR. | 5 kategori dolu, redeem → QR, Firestore kayıt |
| 7 | **Buffer + mid-prova.** Hata düzelt. 1-2 arkadaş test. | Core 3 ekran kararlı |

**Hafta 2 — Belediye + Mock'lar + Cila**

| Gün | Yapılacaklar | Kabul kriteri |
|---|---|---|
| 8 | Belediye Paneli: 4 KPI, ısı haritası, pasta grafik. | KPI'lar canlı, heatmap renkli |
| 9 | Profil: avatar, istatistik, rozet grid, ayarlar (statik). | Profil yansıtıcı |
| 10 | Sosyal Feed + Yerel İşletme Paneli mock. | Tıklanabilir, dolu hissi |
| 11 | Push notification (lokal) + Demo Mode (10x). | Notif düşer, demo mode çalışır |
| 12 | UI cila: animasyon, dark mode, splash, app icon. | Göz dolduran görünüm |
| 13 | **Sunum slaytları + 3 kez prova.** Q&A cebinde. | 7 dk'da bitir, takılma yok |
| 14 | EAS build + final fix + buffer. Yedek video. | Kurulu, internet kesilse video var |

### Başarı Metrikleri

**Hackathon (sunum günü):**
- ✅ 9 ekran ekrana gelir, crash yok
- ✅ Core döngü (aktivite → puan → redeem) canlı
- ✅ Demo 7 dakikada tamamlanır
- ✅ Jüri Q&A %80'ine cevap hazır
- 🏆 Stretch: kategoride finalist

**Ürün KPI (6 ay pilot):**

| KPI | Hedef |
|---|---|
| Kayıtlı / mahalle nüfusu | %15 |
| Haftada en az 1 aktivite | %40 |
| Aylık redeem oranı | %25 |
| BELPA tesisi doluluk artışı | %15 |
| Belediye dashboard haftalık kullanım | 3 yetkili / hafta |
| 30 gün retention | %35 |

**Sosyal etki:**
- Yetersiz aktif vatandaş oranında lokal düşüş: -%10 (1 yıl)
- Aktif ulaşım modu paylaşımında artış: +%5
- Belediye–vatandaş NPS: +20 puan

### Sunum Günü Checklist

**Teknik:**
- [ ] Telefon %100 + powerbank
- [ ] Kablolar (yedek)
- [ ] Hotspot test
- [ ] Wi-Fi mahallin SSID/şifresi
- [ ] Expo Go + projeksiyon aynalama test
- [ ] Firestore seed dolu, leaderboard canlı
- [ ] Demo Mode aktif
- [ ] QR statik kartı yazdırılmış
- [ ] Push notif manuel test

**Yedek planlar:**
- [ ] **Plan B:** Telefon arıza → Expo web build link
- [ ] **Plan C:** İnternet yok → 2dk demo video USB'de
- [ ] **Plan D:** Hepsi giderse → Figma static slaytta

**Sunum:**
- [ ] Konuşma 3 kez prova
- [ ] Hook 30 sn ezberli
- [ ] Q&A 10 soru hazır
- [ ] Bekleme tutumu net

### Post-MVP Yol Haritası

**v1.1 (1 ay sonra):**
- Apple Health / Google Fit imzalı veri
- Anonim user research (10 kişi)
- 1 mahalle pilot deal (muhtarlık)

**v2 (3-6 ay):**
- BELPA API gerçek entegrasyon (QR okutucu pilot)
- Yerel işletme self-serve web paneli
- Mahalle yarışma sezonları (4 haftalık)
- Resmi belediye web dashboard

**v3 (1 yıl):**
- AI görev önerisi (yürüyüş paternine göre)
- AR mahalle rotası (kültürel keşif + puan)
- Ortak görev: "Mahalle birlikte 1M adım = yeni park bankı"
- Anonim sağlık veri → belediye 5 yıllık planına girdi

---

## Ekler

### A. Yarışma Kategorisi Eşleşmesi (özetle)

| Kategori başlığı | MahalleLig karşılığı |
|---|---|
| Kentsel sağlık | Mahalle bazlı aktivite teşviki, sağlık KPI |
| Aktif ulaşım | Yürüyüş + bisiklet ödüllendirme, arabasız görevler |
| Kamusal sağlık altyapısı | BELPA/spor tesisi entegrasyonu, ödül akışı |
| Akıllı şehir uygulamaları | Mobil app + belediye veri dashboard |

### B. Anahtar Mesajlar (sunumda tekrar edilecek)

1. *"Vatandaş yürüdükçe sadece sağlığına yatırım yapmıyor; belediyenin sosyal imkanlarından indirim, öncelik ve ayrıcalık kazanıyor."*
2. *"MahalleLig, belediye imkanlarını pasif hizmetten aktif yaşam teşvikine dönüştürür."*
3. *"2035'te şehirler tesis sayısıyla değil, mahalle lig puanıyla ölçülecek."*
