import { useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { Screen, LargeTitle, SectionTitle } from "@/components/Screen";
import { KpiCard } from "@/components/KpiCard";
import { NeighborhoodHeatmap } from "@/components/NeighborhoodHeatmap";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { Button } from "@/components/Button";
import { tr } from "@/constants/i18n";
import { neighborhoodLeaderboard } from "@/services/league";
import { fireLocal } from "@/services/notifications";
import { useLeagueStore } from "@/store/useLeagueStore";
import { useMuniAuthStore, MUNI_DEMO_CREDS } from "@/store/useMuniAuthStore";
import { palette } from "@/constants/theme";
import { FAKE_USERS } from "@/constants/seed/fakeUsers";
import { FAKE_ACTIVITIES } from "@/constants/seed/fakeActivities";
import { REWARDS, type RewardPartner } from "@/constants/seed/rewards";

function MuniLoginGate() {
  const signIn = useMuniAuthStore((s) => s.signIn);
  // Demo akışı için: input'lar hazır geliyor — sunum sırasında tek tıkla giriş.
  const [email, setEmail] = useState(MUNI_DEMO_CREDS.email);
  const [password, setPassword] = useState(MUNI_DEMO_CREDS.password);
  const [error, setError] = useState("");

  function submit() {
    const ok = signIn(email, password);
    if (!ok) {
      setError(tr.municipality.authError);
    }
  }

  return (
    <Screen>
      <View className="flex-1 justify-center py-10">
        {/* Brand strip */}
        <View>
          <View className="flex-row items-center gap-2">
            <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
            <Text
              className="text-navy-900"
              style={{ fontFamily: "System", fontWeight: "600", fontSize: 10, letterSpacing: 2 }}
            >
              BELEDİYE PANELİ · ERİŞİM
            </Text>
          </View>
          <View className="h-px bg-navy-900/15 mt-2 mb-1" />
          <View className="flex-row items-center justify-between mt-1">
            <Text
              className="text-steel-500"
              style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 10, letterSpacing: 0.8 }}
            >
              S/N · 0001 / İBB
            </Text>
            <View className="px-2 py-0.5 border border-navy-900/30 rounded-sm">
              <Text
                className="text-navy-900"
                style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 9, letterSpacing: 1.2 }}
              >
                BLD · v1
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-10">
          <Text
            adjustsFontSizeToFit
            numberOfLines={2}
            className="text-navy-900"
            style={{ fontFamily: "System", fontWeight: "700", fontSize: 36, letterSpacing: -1.4, lineHeight: 38 }}
          >
            Belediye yetkili
            <Text style={{ color: palette.terra500, fontFamily: "System", fontWeight: "400", fontStyle: "italic" }}> girişi</Text>
            <Text style={{ color: palette.terra500, fontFamily: "System", fontWeight: "400", fontStyle: "italic" }}>.</Text>
          </Text>
          <View className="h-px bg-navy-900/15 my-5" />
          <Text
            className="text-steel-700"
            style={{ fontFamily: "System", fontWeight: "500", fontSize: 13, lineHeight: 20 }}
          >
            {tr.municipality.authSubtitle}
          </Text>
        </View>

        <View className="mt-8">
          <Text
            className="text-steel-500 mb-1.5"
            style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.6 }}
          >
            {tr.municipality.authEmail}
          </Text>
          <TextInput
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (error) setError("");
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="ornek@ibb.gov.tr"
            placeholderTextColor={palette.steel400}
            className="border border-navy-900/15 rounded-2xl px-4 py-3.5 text-navy-900 bg-ivory-50"
            style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 14, letterSpacing: -0.1 }}
          />

          <View className="mt-4">
            <Text
              className="text-steel-500 mb-1.5"
              style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.6 }}
            >
              {tr.municipality.authPassword}
            </Text>
            <TextInput
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (error) setError("");
              }}
              secureTextEntry
              placeholder="••••"
              placeholderTextColor={palette.steel400}
              className="border border-navy-900/15 rounded-2xl px-4 py-3.5 text-navy-900 bg-ivory-50"
              style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 14, letterSpacing: 2 }}
            />
          </View>

          {error ? (
            <View className="flex-row items-center mt-3 gap-2">
              <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
              <Text
                className="text-terra-700"
                style={{ fontFamily: "System", fontWeight: "600", fontSize: 11, letterSpacing: 0.2 }}
              >
                {error}
              </Text>
            </View>
          ) : null}

          <View className="mt-5">
            <Button label={tr.municipality.authSubmit} variant="secondary" onPress={submit} />
          </View>
        </View>

        {/* Demo hint */}
        <View className="mt-8 bg-ivory-50 border border-navy-900/10 rounded-2xl overflow-hidden">
          <View className="h-1 bg-terra-500" />
          <View className="px-4 py-3">
            <Text
              className="text-steel-500"
              style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.6 }}
            >
              {tr.municipality.authDemoHint}
            </Text>
            <View className="flex-row mt-2 gap-6">
              <View>
                <Text
                  className="text-steel-400"
                  style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.2 }}
                >
                  E-POSTA
                </Text>
                <Text
                  className="text-navy-900 mt-0.5"
                  style={{ fontFamily: "Menlo", fontWeight: "700", fontSize: 13, letterSpacing: -0.2 }}
                >
                  {MUNI_DEMO_CREDS.email}
                </Text>
              </View>
              <View>
                <Text
                  className="text-steel-400"
                  style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.2 }}
                >
                  ŞİFRE
                </Text>
                <Text
                  className="text-navy-900 mt-0.5"
                  style={{ fontFamily: "Menlo", fontWeight: "700", fontSize: 13, letterSpacing: -0.2 }}
                >
                  {MUNI_DEMO_CREDS.password}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

export default function Municipality() {
  const authed = useMuniAuthStore((s) => s.authed);
  if (!authed) return <MuniLoginGate />;
  return <MunicipalityPanel />;
}

function MunicipalityPanel() {
  const delta = useLeagueStore((s) => s.weeklyDeltaByNid);
  const missions = useLeagueStore((s) => s.missions);
  const addMission = useLeagueStore((s) => s.addMission);
  const signOut = useMuniAuthStore((s) => s.signOut);
  const rows = neighborhoodLeaderboard({ weeklyPointsByNid: delta });

  const activeCitizens = FAKE_USERS.length + 1;
  const weeklySteps = FAKE_ACTIVITIES.reduce((a, b) => a + b.steps, 0);
  const facilityVisits = 184;
  const redeemed = 73;

  const top5 = rows.slice(0, 5);
  const low = rows[rows.length - 1];

  const pieData = useMemo(() => {
    const partnerCount = REWARDS.reduce<Record<RewardPartner, number>>(
      (acc, r) => ({ ...acc, [r.partner]: (acc[r.partner] ?? 0) + Math.floor(Math.random() * 20) + 5 }),
      {} as Record<RewardPartner, number>
    );
    return Object.entries(partnerCount).map(([partner, count]) => ({ partner, count }));
  }, []);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Sabah yürüyüşü buluşması");
  const [bonus, setBonus] = useState("200");

  function submit() {
    const bonusN = Math.max(0, parseInt(bonus, 10) || 0);
    addMission({ targetNid: low.nid, title, bonusPoints: bonusN });
    fireLocal({
      title: "Yeni mahalle görevi",
      body: `${low.name} için: ${title} (+${bonusN} bonus)`
    });
    setOpen(false);
  }

  return (
    <Screen>
      <LargeTitle
        eyebrow="Belediye paneli"
        title={tr.municipality.title}
        subtitle="Mahalle sağlık & hareket göstergeleri"
        trailing={
          <View className="items-end gap-1.5">
            <View className="px-2 py-0.5 rounded-sm border border-navy-900/30">
              <Text
                className="text-navy-900"
                style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 10, letterSpacing: 1.6 }}
              >
                İBB · v1
              </Text>
            </View>
            <Pressable
              onPress={signOut}
              className="px-2 py-0.5 rounded-sm border border-terra-700/40 active:bg-terra-100"
            >
              <Text
                className="text-terra-700"
                style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 10, letterSpacing: 1.6 }}
              >
                ÇIKIŞ
              </Text>
            </Pressable>
          </View>
        }
      />

      {/* Headline stat bar */}
      <View className="bg-navy-900 rounded-2xl overflow-hidden mb-4">
        <View className="h-1 flex-row">
          <View className="flex-1 bg-terra-500" />
          <View className="w-8 bg-bronze-500" />
        </View>
        <View className="px-5 py-4">
          <Text
            className="text-ivory-100/60"
            style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.6 }}
          >
            TOPLAM HAFTALIK ADIM
          </Text>
          <View className="flex-row items-baseline gap-2 mt-1">
            <Text
              className="text-ivory-50"
              style={{ fontFamily: "Menlo", fontWeight: "700", fontSize: 36, letterSpacing: -1.2 }}
            >
              {(weeklySteps / 1000).toFixed(1)}k
            </Text>
            <Text
              className="text-terra-400"
              style={{ fontFamily: "System", fontWeight: "600", fontSize: 12 }}
            >
              +8% MoW
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap -mx-1">
        <KpiCard label={tr.municipality.activeCitizens} value={activeCitizens.toString()} sub="+12 bu hafta" />
        <KpiCard label={tr.municipality.facilityVisits} value={facilityVisits.toString()} sub="+15% MoW" />
      </View>
      <View className="flex-row flex-wrap -mx-1">
        <KpiCard label={tr.municipality.redeemed} value={redeemed.toString()} sub="+22% MoW" />
        <KpiCard label="Aktif Görev" value={missions.length.toString()} sub={missions.length > 0 ? "yayında" : "henüz yok"} tone="accent" />
      </View>

      <SectionTitle sub="32 MAHALLE">Isı haritası</SectionTitle>
      <NeighborhoodHeatmap rows={rows} />

      <SectionTitle sub="REDEEM ANALİTİĞİ">Kategoriler</SectionTitle>
      <CategoryPieChart data={pieData} />

      <SectionTitle sub="TOP 5">Lider mahalleler</SectionTitle>
      <View className="bg-ivory-50 border border-navy-900/10 rounded-2xl px-4 py-3">
        {top5.map((r, i) => (
          <View
            key={r.nid}
            className={`flex-row items-center justify-between py-2.5 ${i < top5.length - 1 ? "border-b border-navy-900/8" : ""}`}
          >
            <View className="flex-row items-baseline gap-3">
              <Text
                className={i === 0 ? "text-terra-500" : "text-steel-500"}
                style={{ fontFamily: "Menlo", fontWeight: "700", fontSize: 12, letterSpacing: -0.2 }}
              >
                {String(r.rank).padStart(2, "0")}
              </Text>
              <View>
                <Text
                  className="text-navy-900"
                  style={{ fontFamily: "System", fontWeight: "700", fontSize: 14, letterSpacing: -0.2 }}
                >
                  {r.name}
                </Text>
                <Text
                  className="text-steel-500"
                  style={{ fontFamily: "System", fontWeight: "500", fontSize: 10, letterSpacing: 0.4 }}
                >
                  {r.district.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text
              className="text-navy-900"
              style={{ fontFamily: "Menlo", fontWeight: "700", fontSize: 13, letterSpacing: -0.3 }}
            >
              {r.weeklyPoints.toLocaleString("tr-TR")}
            </Text>
          </View>
        ))}
      </View>

      {/* Low-activity alert */}
      <View className="bg-ivory-50 border border-terra-500/40 rounded-2xl overflow-hidden mt-4">
        <View className="h-1 bg-terra-500" />
        <View className="px-4 py-3.5">
          <Text
            className="text-terra-700"
            style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.4 }}
          >
            UYARI · DÜŞÜK AKTİVİTE
          </Text>
          <Text
            className="text-navy-900 mt-1"
            style={{ fontFamily: "System", fontWeight: "700", fontSize: 15, letterSpacing: -0.3 }}
          >
            {low.name} mahallesi
          </Text>
          <Text
            className="text-steel-500 mt-0.5 mb-3"
            style={{ fontFamily: "System", fontWeight: "500", fontSize: 12 }}
          >
            Bu hafta hareket az. Bir görev oluştur, bonus ekle.
          </Text>
          <Button label={tr.municipality.createMission} variant="primary" onPress={() => setOpen(true)} />
        </View>
      </View>

      {missions.length > 0 && (
        <>
          <SectionTitle sub={`${missions.length} AKTİF`}>Oluşturulan görevler</SectionTitle>
          <View className="bg-ivory-50 border border-navy-900/10 rounded-2xl px-4 py-2">
            {missions.map((m, i) => (
              <View
                key={m.id}
                className={`py-2.5 ${i < missions.length - 1 ? "border-b border-navy-900/8" : ""}`}
              >
                <View className="flex-row items-baseline gap-2">
                  <View className="w-1 h-1 rounded-full bg-terra-500" />
                  <Text
                    className="text-navy-900 flex-1"
                    style={{ fontFamily: "System", fontWeight: "700", fontSize: 14, letterSpacing: -0.2 }}
                  >
                    {m.title}
                  </Text>
                  <Text
                    className="text-terra-500"
                    style={{ fontFamily: "Menlo", fontWeight: "700", fontSize: 12 }}
                  >
                    +{m.bonusPoints}
                  </Text>
                </View>
                <Text
                  className="text-steel-500 ml-3"
                  style={{ fontFamily: "System", fontWeight: "500", fontSize: 10, letterSpacing: 0.4 }}
                >
                  HEDEF · {m.targetNid.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 justify-center items-center px-5" style={{ backgroundColor: "rgba(12, 35, 64, 0.55)" }}>
          <View className="bg-ivory-50 rounded-3xl w-full max-w-md overflow-hidden border border-navy-900/10">
            <View className="h-1 flex-row">
              <View className="flex-1 bg-terra-500" />
              <View className="w-8 bg-bronze-500" />
            </View>
            <View className="px-5 py-5">
              <Text
                className="text-steel-500"
                style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.6 }}
              >
                YENİ GÖREV · {low.name.toUpperCase()}
              </Text>
              <Text
                className="text-navy-900 mt-1.5"
                style={{ fontFamily: "System", fontWeight: "700", fontSize: 22, letterSpacing: -0.8 }}
              >
                Mahallene canlandırma görevi
              </Text>
              <Text
                className="text-steel-500 mt-1 mb-4"
                style={{ fontFamily: "System", fontWeight: "500", fontSize: 12, lineHeight: 17 }}
              >
                Düşük aktiviteyi yükseltmek için yerel bir aktivite tetikleyin.
              </Text>

              <View className="mb-3">
                <Text
                  className="text-steel-500 mb-1.5"
                  style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.4 }}
                >
                  BAŞLIK
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  className="border border-navy-900/15 rounded-xl px-3 py-3 text-navy-900 bg-ivory-100/60"
                  style={{ fontFamily: "System", fontWeight: "700", fontSize: 14, letterSpacing: -0.2 }}
                />
              </View>

              <View className="mb-4">
                <Text
                  className="text-steel-500 mb-1.5"
                  style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.4 }}
                >
                  BONUS PUAN
                </Text>
                <TextInput
                  value={bonus}
                  onChangeText={setBonus}
                  keyboardType="numeric"
                  className="border border-navy-900/15 rounded-xl px-3 py-3 text-navy-900 bg-ivory-100/60"
                  style={{ fontFamily: "Menlo", fontWeight: "700", fontSize: 16, letterSpacing: -0.3 }}
                />
              </View>

              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Button label="İptal" variant="ghost" onPress={() => setOpen(false)} />
                </View>
                <View className="flex-1">
                  <Button label="Oluştur" variant="primary" onPress={submit} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
