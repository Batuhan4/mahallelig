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
import { FAKE_USERS } from "@/constants/seed/fakeUsers";
import { FAKE_ACTIVITIES } from "@/constants/seed/fakeActivities";
import { REWARDS, type RewardPartner } from "@/constants/seed/rewards";

export default function Municipality() {
  const delta = useLeagueStore((s) => s.weeklyDeltaByNid);
  const missions = useLeagueStore((s) => s.missions);
  const addMission = useLeagueStore((s) => s.addMission);
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
          <View className="items-end">
            <View className="px-2 py-0.5 rounded-sm border border-navy-900/30">
              <Text
                className="text-navy-900"
                style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 10, letterSpacing: 1.6 }}
              >
                İBB · v1
              </Text>
            </View>
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
            style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.6 }}
          >
            TOPLAM HAFTALIK ADIM
          </Text>
          <View className="flex-row items-baseline gap-2 mt-1">
            <Text
              className="text-ivory-50"
              style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 36, letterSpacing: -1.2 }}
            >
              {(weeklySteps / 1000).toFixed(1)}k
            </Text>
            <Text
              className="text-terra-400"
              style={{ fontFamily: "Inter_600SemiBold", fontSize: 12 }}
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
                style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 12, letterSpacing: -0.2 }}
              >
                {String(r.rank).padStart(2, "0")}
              </Text>
              <View>
                <Text
                  className="text-navy-900"
                  style={{ fontFamily: "Fraunces_700Bold", fontSize: 14, letterSpacing: -0.2 }}
                >
                  {r.name}
                </Text>
                <Text
                  className="text-steel-500"
                  style={{ fontFamily: "Inter_500Medium", fontSize: 10, letterSpacing: 0.4 }}
                >
                  {r.district.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text
              className="text-navy-900"
              style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 13, letterSpacing: -0.3 }}
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
            style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.4 }}
          >
            UYARI · DÜŞÜK AKTİVİTE
          </Text>
          <Text
            className="text-navy-900 mt-1"
            style={{ fontFamily: "Fraunces_700Bold", fontSize: 15, letterSpacing: -0.3 }}
          >
            {low.name} mahallesi
          </Text>
          <Text
            className="text-steel-500 mt-0.5 mb-3"
            style={{ fontFamily: "Inter_500Medium", fontSize: 12 }}
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
                    style={{ fontFamily: "Fraunces_700Bold", fontSize: 14, letterSpacing: -0.2 }}
                  >
                    {m.title}
                  </Text>
                  <Text
                    className="text-terra-500"
                    style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 12 }}
                  >
                    +{m.bonusPoints}
                  </Text>
                </View>
                <Text
                  className="text-steel-500 ml-3"
                  style={{ fontFamily: "Inter_500Medium", fontSize: 10, letterSpacing: 0.4 }}
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
                style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.6 }}
              >
                YENİ GÖREV · {low.name.toUpperCase()}
              </Text>
              <Text
                className="text-navy-900 mt-1.5"
                style={{ fontFamily: "Fraunces_700Bold", fontSize: 22, letterSpacing: -0.8 }}
              >
                Mahallene canlandırma görevi
              </Text>
              <Text
                className="text-steel-500 mt-1 mb-4"
                style={{ fontFamily: "Inter_500Medium", fontSize: 12, lineHeight: 17 }}
              >
                Düşük aktiviteyi yükseltmek için yerel bir aktivite tetikleyin.
              </Text>

              <View className="mb-3">
                <Text
                  className="text-steel-500 mb-1.5"
                  style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.4 }}
                >
                  BAŞLIK
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  className="border border-navy-900/15 rounded-xl px-3 py-3 text-navy-900 bg-ivory-100/60"
                  style={{ fontFamily: "Fraunces_700Bold", fontSize: 14, letterSpacing: -0.2 }}
                />
              </View>

              <View className="mb-4">
                <Text
                  className="text-steel-500 mb-1.5"
                  style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.4 }}
                >
                  BONUS PUAN
                </Text>
                <TextInput
                  value={bonus}
                  onChangeText={setBonus}
                  keyboardType="numeric"
                  className="border border-navy-900/15 rounded-xl px-3 py-3 text-navy-900 bg-ivory-100/60"
                  style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 16, letterSpacing: -0.3 }}
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
