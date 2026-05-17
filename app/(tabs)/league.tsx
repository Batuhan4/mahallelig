import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Screen, LargeTitle, SectionTitle } from "@/components/Screen";
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
  const insideRows = user
    ? userLeaderboardForNeighborhood(user.neighborhoodId, {
        uid: user.uid,
        displayName: user.name,
        weeklyPoints: todayPoints
      })
    : [];
  const c = seasonCountdown();
  const activeMission = missions.find((m) => m.targetNid === user?.neighborhoodId) ?? missions[0];

  return (
    <Screen scroll={false}>
      <LargeTitle
        eyebrow="MahalleLig · Sezon 1"
        title={yourNhoodRow?.name ?? "—"}
        subtitle={yourNhoodRow ? `${yourNhoodRow.district} · sıralama` : undefined}
        trailing={
          <View className="items-end">
            <Text
              className="text-terra-500"
              style={{ fontFamily: "System", fontWeight: "700", fontSize: 28, letterSpacing: -1, lineHeight: 30 }}
            >
              {yourNhoodRow ? String(yourNhoodRow.rank).padStart(2, "0") : "—"}
              <Text
                className="text-steel-400"
                style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 14 }}
              >
                /{String(outsideRows.length).padStart(2, "0")}
              </Text>
            </Text>
            <Text
              className="text-steel-500"
              style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.4 }}
            >
              SIRA
            </Text>
          </View>
        }
      />

      {/* Mission banner */}
      <View className="rounded-2xl border border-navy-900/10 bg-ivory-50 overflow-hidden mb-3">
        <View className="flex-row">
          <View className="w-1 bg-terra-500" />
          <View className="flex-1 px-4 py-3">
            <View className="flex-row items-center gap-1.5 mb-1">
              <View className="w-1 h-1 rounded-full bg-terra-500" />
              <Text
                className="text-terra-700"
                style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.4 }}
              >
                BELEDİYE GÖREVİ
              </Text>
            </View>
            {activeMission ? (
              <>
                <Text
                  className="text-navy-900"
                  style={{ fontFamily: "System", fontWeight: "700", fontSize: 15, letterSpacing: -0.3 }}
                >
                  {activeMission.title}
                </Text>
                <Text
                  className="text-steel-500 mt-0.5"
                  style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 11, letterSpacing: 0.4 }}
                >
                  +{activeMission.bonusPoints} BONUS · {c.days} GÜN
                </Text>
              </>
            ) : (
              <>
                <Text
                  className="text-navy-900"
                  style={{ fontFamily: "System", fontWeight: "700", fontSize: 15, letterSpacing: -0.3 }}
                >
                  {tr.league.weeklyMission}
                </Text>
                <Text
                  className="text-steel-500 mt-0.5"
                  style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 11, letterSpacing: 0.4 }}
                >
                  {tr.league.seasonCountdown(c.days, c.hours).toUpperCase()}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Tab switcher */}
      <View className="flex-row items-center bg-ivory-200/60 rounded-full p-1 mb-3">
        {(["inside", "outside"] as const).map((t) => {
          const isActive = tab === t;
          return (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              className={`flex-1 py-2 rounded-full ${isActive ? "bg-navy-900" : "bg-transparent"}`}
            >
              <View className="flex-row items-center justify-center gap-1.5">
                {isActive && <View className="w-1 h-1 rounded-full bg-terra-500" />}
                <Text
                  className={isActive ? "text-ivory-50" : "text-navy-900/70"}
                  style={{ fontFamily: "System", fontWeight: "600", fontSize: 12, letterSpacing: 0.2 }}
                >
                  {t === "inside" ? tr.league.tabInside : tr.league.tabOutside}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {tab === "inside" ? (
        <FlatList
          data={insideRows}
          keyExtractor={(r) => r.uid}
          renderItem={({ item }) => (
            <LeaderboardRow
              rank={item.rank}
              name={item.isYou ? `${item.displayName} · sen` : item.displayName}
              points={item.weeklyPoints}
              you={item.isYou}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      ) : (
        <FlatList
          data={outsideRows}
          keyExtractor={(r) => r.nid}
          renderItem={({ item }) => (
            <LeaderboardRow
              rank={item.rank}
              name={item.name}
              sub={item.district}
              points={item.weeklyPoints}
              you={item.nid === user?.neighborhoodId}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </Screen>
  );
}
