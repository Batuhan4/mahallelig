export const tr = {
  app: { name: "MahalleLig" },
  onboarding: {
    welcomeTitle: "MahalleLig'e Hoş Geldin",
    welcomeSubtitle: "Yürü, kazan, mahallene katkı sun.",
    continue: "Devam",
    pickNeighborhood: "Mahalleni seç",
    permissionsTitle: "Son adım",
    permissionsBody: "Adım sayımı ve aktif ulaşım rotaların için izin ver.",
    grantLocation: "Konuma izin ver",
    grantMotion: "Hareket sensörüne izin ver",
    grantNotifications: "Bildirimlere izin ver",
    finish: "Hadi Başla"
  },
  tabs: { today: "Bugün", league: "Lig", market: "Market", muni: "Belediye", profile: "Profil" },
  today: {
    greeting: (name: string) => `Merhaba ${name}`,
    todaysSteps: "Bugünki adım",
    todaysPoints: "MahallePuan",
    startActivity: "Aktivite Başlat",
    stopActivity: "Aktiviteyi Bitir",
    last7days: "Son 7 gün",
    sourcePedometer: "Pedometre",
    sourceDemo: "Demo Mode (10x)",
    activityTypeWalk: "Yürüyüş",
    activityTypeBike: "Bisiklet",
    activityTypeStairs: "Merdiven"
  },
  league: {
    title: "Mahalle Ligi",
    rank: (rank: number, total: number) => `${rank}. / ${total} mahalle`,
    tabInside: "Mahalle içi",
    tabOutside: "Mahalleler arası",
    seasonCountdown: (d: number, h: number) => `Sezon biter: ${d}g ${h}s`,
    weeklyMission: "Bu hafta arabasız market günü — +200 bonus",
    you: "Sen"
  },
  market: {
    title: "LigMarket",
    enoughPoints: "Yeterli puanın var ✓",
    needPoints: (n: number) => `${n.toLocaleString("tr-TR")} puan daha`,
    redeem: "Redeem et",
    categories: {
      belpa: "BELPA",
      municipal_sports: "Belediye Spor",
      culture: "Kültür",
      local: "Yerel İşletme",
      transport: "Ulaşım"
    }
  },
  reward: {
    redeemTitle: "Redeem onayla",
    confirm: "Onayla ve QR Üret",
    qrTitle: "Bu kodu kasiyere göster",
    qrSubtitle: (mins: number) => `${mins} dakika geçerli`,
    expired: "Süresi doldu",
    used: "Kullanıldı"
  },
  municipality: {
    title: "Belediye Paneli",
    activeCitizens: "Aktif vatandaş",
    weeklySteps: "Toplam adım/hafta",
    facilityVisits: "Tesis ziyareti",
    redeemed: "Redeem edilen ödül",
    topNeighborhoods: "Bu hafta en aktif 5 mahalle",
    lowAlert: (n: string) => `Düşük aktivite uyarısı: ${n}`,
    createMission: "Görev oluştur"
  },
  profile: {
    totalPoints: "Toplam puan",
    level: "Seviye",
    badges: "Rozetler",
    settings: "Ayarlar",
    notifications: "Bildirimler",
    language: "Dil",
    signOut: "Çıkış",
    demoMode: "Demo Mode (10x adım)",
    triggerPush: "Test push gönder"
  },
  feed: { title: "Sosyal Feed" },
  business: {
    title: "Yerel İşletme Paneli",
    customers: (n: number) => `Bu hafta ${n} müşteri MahallePuan kullandı`,
    topReward: "En sevilen ödül"
  },
  push: {
    overtakeTitle: "Mahalleni geçtiler!",
    overtakeBody: "Bu akşam yürüyüş yap +200 puan"
  },
  common: { loading: "Yükleniyor…", error: "Bir şeyler ters gitti" }
} as const;
