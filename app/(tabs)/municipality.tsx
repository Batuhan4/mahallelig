import { Pressable, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { KpiCard } from "@/components/KpiCard";
import { NeighborhoodHeatmap } from "@/components/NeighborhoodHeatmap";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { tr } from "@/constants/i18n";
import { neighborhoodLeaderboard } from "@/services/league";
import { useLeagueStore } from "@/store/useLeagueStore";
import { FAKE_USERS } from "@/constants/seed/fakeUsers";
import { FAKE_ACTIVITIES } from "@/constants/seed/fakeActivities";
import { REWARDS, type RewardPartner } from "@/constants/seed/rewards";

export default function Municipality() {
  const delta = useLeagueStore((s) => s.weeklyDeltaByNid);
  const rows = neighborhoodLeaderboard({ weeklyPointsByNid: delta });

  const activeCitizens = FAKE_USERS.length + 1;
  const weeklySteps = FAKE_ACTIVITIES.reduce((a, b) => a + b.steps, 0);
  const facilityVisits = 184;
  const redeemed = 73;

  const top5 = rows.slice(0, 5);
  const low = rows[rows.length - 1];

  const partnerCount = REWARDS.reduce<Record<RewardPartner, number>>((acc, r) => ({ ...acc, [r.partner]: (acc[r.partner] ?? 0) + Math.floor(Math.random() * 20) + 5 }), {} as any);
  const pieData = Object.entries(partnerCount).map(([partner, count]) => ({ partner, count: count as number }));

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
          <Pressable className="rounded-xl bg-amber-600 mt-2 py-2"><Text className="text-white text-center font-semibold">{tr.municipality.createMission}</Text></Pressable>
        </View>
      </View>
    </Screen>
  );
}
