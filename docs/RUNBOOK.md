# MahalleLig — Runbook

## Local geliştirme

```bash
npm install
npm start
```

`a` (Android), `i` (iOS), `w` (web).

## Test

```bash
npm test
```

## Demo Mode

`Profil → Demo Mode` switch'i açıkken adım sayar 10x hızda simüle edilir. Aktivite Başlat'a basınca cebine telefon koymadan da +47 MahallePuan animasyonu çalışır.

## Push tetikleyici

`Profil → Test push gönder` butonu lokal bildirim düşürür ("Mahalleni geçtiler!").

## Veri katmanı

Default backend = `services/backend/seedBackend.ts` (in-memory). Firestore'a geçmek için `services/backend/firebaseBackend.ts` implementasyonunu tamamlayıp `services/backend/index.ts`'te `backend = makeFirebaseBackend(env)` yap.
