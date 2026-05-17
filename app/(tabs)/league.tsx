import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { LeaderboardRow } from "@/components/LeaderboardRow";
import { tr } from "@/constants/i18n";
import { useUserStore } from "@/store/useUserStore";
import { useLeagueStore } from "@/store/useLeagueStore";
import { useActivityStore } from "@/store/useActivityStore";
import { neighborhoodLeaderboard, userLeaderboardForNeighborhood, seasonCountdown } from "@/services/league";

export default function League() {
  const user = useUserStore((s) => s.user);
  const delta = useLeagueStore((s) => s.weeklyDeltaByNid);
  const missions = useLeagueStore((s) => s.missions);
  const todayPoints = useActivityStore((s) => s.todayPoints);
  const [tab, setTab] = useState<"inside" | "outside">("inside");

  const outsideRows = neighborhoodLeaderboard({ weeklyPointsByNid: delta });
  const yourNhoodRow = outsideRows.find((r) => r.nid === user?.neighborhoodId);
  const insideRows = user ? userLeaderboardForNeighborhood(user.neighborhoodId, { uid: user.uid, displayName: user.name, weeklyPoints: todayPoints }) : [];
  const c = seasonCountdown();
  const activeMission = missions.find((m) => m.targetNid === user?.neighborhoodId) ?? missions[0];

  return (
    <Screen scroll={false}>
      <View className="pt-4 pb-2">
        <Text className="text-ink-500">{tr.league.title}</Text>
        <Text className="text-ink-900 dark:text-white text-2xl font-bold">{yourNhoodRow?.name ?? "—"}</Text>
        <Text className="text-ink-700">{yourNhoodRow ? tr.league.rank(yourNhoodRow.rank, outsideRows.length) : ""}</Text>
        <Text className="text-ink-500 text-xs mt-1">{tr.league.seasonCountdown(c.days, c.hours)}</Text>
      </View>

      <View className="rounded-xl bg-amber-100 p-3 mb-3">
        {activeMission ? (
          <Text className="text-amber-900 font-semibold">🏁 {activeMission.title} — +{activeMission.bonusPoints} bonus</Text>
        ) : (
          <Text className="text-amber-900 font-semibold">🏁 {tr.league.weeklyMission}</Text>
        )}
      </View>

      <View className="flex-row mb-3">
        {(["inside", "outside"] as const).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} className={`flex-1 py-2 mx-1 rounded-xl ${tab === t ? "bg-ink-900" : "bg-ink-300/40"}`}>
            <Text className={`text-center font-semibold ${tab === t ? "text-white" : "text-ink-700"}`}>
              {t === "inside" ? tr.league.tabInside : tr.league.tabOutside}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "inside" ? (
        <FlatList
          data={insideRows}
          keyExtractor={(r) => r.uid}
          renderItem={({ item }) => (
            <LeaderboardRow rank={item.rank} name={item.isYou ? `${tr.league.you} · ${item.displayName}` : item.displayName} points={item.weeklyPoints} you={item.isYou} />
          )}
        />
      ) : (
        <FlatList
          data={outsideRows}
          keyExtractor={(r) => r.nid}
          renderItem={({ item }) => (
            <LeaderboardRow rank={item.rank} name={item.name} sub={item.district} points={item.weeklyPoints} you={item.nid === user?.neighborhoodId} />
          )}
        />
      )}
    </Screen>
  );
}
