import { useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { Screen } from "@/components/Screen";
import { KpiCard } from "@/components/KpiCard";
import { NeighborhoodHeatmap } from "@/components/NeighborhoodHeatmap";
import { CategoryPieChart } from "@/components/CategoryPieChart";
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
      <Text className="text-2xl font-bold text-ink-900 dark:text-white py-4">{tr.municipality.title}</Text>

      <View className="flex-row flex-wrap">
        <KpiCard label={tr.municipality.activeCitizens} value={activeCitizens.toString()} sub="+12 bu hafta" />
        <KpiCard label={tr.municipality.weeklySteps} value={(weeklySteps / 1000).toFixed(1) + "k"} sub="+8% MoW" />
      </View>
      <View className="flex-row flex-wrap">
        <KpiCard label={tr.municipality.facilityVisits} value={facilityVisits.toString()} sub="+15% MoW" />
        <KpiCard label={tr.municipality.redeemed} value={redeemed.toString()} sub="+22% MoW" />
      </View>

      <NeighborhoodHeatmap rows={rows} />
      <CategoryPieChart data={pieData} />

      <View className="bg-white border border-ink-300 rounded-2xl p-3 mt-3">
        <Text className="text-ink-700 font-semibold mb-2">{tr.municipality.topNeighborhoods}</Text>
        {top5.map((r) => (
          <View key={r.nid} className="flex-row justify-between py-1">
            <Text className="text-ink-900">{r.rank}. {r.name}</Text>
            <Text className="text-ink-700">{r.weeklyPoints.toLocaleString("tr-TR")}</Text>
          </View>
        ))}
        <View className="mt-3 rounded-xl bg-amber-100 p-3">
          <Text className="text-amber-900 font-semibold">⚠️ {tr.municipality.lowAlert(low.name)}</Text>
          <Pressable onPress={() => setOpen(true)} className="rounded-xl bg-amber-600 mt-2 py-2">
            <Text className="text-white text-center font-semibold">{tr.municipality.createMission}</Text>
          </Pressable>
        </View>
      </View>

      {missions.length > 0 && (
        <View className="bg-white border border-ink-300 rounded-2xl p-3 mt-3">
          <Text className="text-ink-700 font-semibold mb-2">Oluşturulan görevler</Text>
          {missions.map((m) => (
            <View key={m.id} className="py-1">
              <Text className="text-ink-900">🏁 {m.title}</Text>
              <Text className="text-ink-500 text-xs">{m.targetNid} · +{m.bonusPoints} bonus</Text>
            </View>
          ))}
        </View>
      )}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-2xl p-4 w-full max-w-md gap-3">
            <Text className="text-ink-900 text-xl font-bold">Yeni görev — {low.name}</Text>
            <Text className="text-ink-500 text-xs">Düşük aktiviteyi yükseltmek için görev oluştur.</Text>
            <View className="gap-1">
              <Text className="text-ink-700 text-xs">Başlık</Text>
              <TextInput value={title} onChangeText={setTitle} className="border border-ink-300 rounded-xl px-3 py-2 text-ink-900" />
            </View>
            <View className="gap-1">
              <Text className="text-ink-700 text-xs">Bonus puan</Text>
              <TextInput value={bonus} onChangeText={setBonus} keyboardType="numeric" className="border border-ink-300 rounded-xl px-3 py-2 text-ink-900" />
            </View>
            <View className="flex-row gap-2 mt-2">
              <Pressable onPress={() => setOpen(false)} className="flex-1 bg-ink-300/40 rounded-xl py-3">
                <Text className="text-ink-900 text-center font-semibold">İptal</Text>
              </Pressable>
              <Pressable onPress={submit} className="flex-1 bg-brand-500 rounded-xl py-3">
                <Text className="text-white text-center font-semibold">Oluştur</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
