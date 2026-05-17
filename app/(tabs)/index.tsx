import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Screen, LargeTitle, SectionTitle } from "@/components/Screen";
import { PointCounter } from "@/components/PointCounter";
import { ActivityCard } from "@/components/ActivityCard";
import { WeeklyTrendChart } from "@/components/WeeklyTrendChart";
import { Badge } from "@/components/Badge";
import { tr } from "@/constants/i18n";
import { useUserStore, levelOfUser } from "@/store/useUserStore";
import { useActivityStore } from "@/store/useActivityStore";
import { useLeagueStore } from "@/store/useLeagueStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { findNeighborhood } from "@/services/league";
import { isAvailable, watchSteps } from "@/services/pedometer";
import { startDemoStepStream } from "@/services/demoMode";
import { pointsForActivity, applyDailyCap } from "@/services/points";
import { backend } from "@/services/backend";

const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default function Today() {
  const user = useUserStore((s) => s.user);
  const addPoints = useUserStore((s) => s.addPoints);
  const todaySteps = useActivityStore((s) => s.todaySteps);
  const todayPoints = useActivityStore((s) => s.todayPoints);
  const addTodaySteps = useActivityStore((s) => s.addTodaySteps);
  const addTodayPoints = useActivityStore((s) => s.addTodayPoints);
  const live = useActivityStore((s) => s.liveActivity);
  const startLive = useActivityStore((s) => s.startLive);
  const pushLiveSteps = useActivityStore((s) => s.pushLiveSteps);
  const endLive = useActivityStore((s) => s.endLive);
  const pushHistory = useActivityStore((s) => s.pushHistory);
  const demoMode = useSettingsStore((s) => s.demoMode);
  const bumpUserNeighborhood = useLeagueStore((s) => s.bumpUserNeighborhood);

  const [type, setType] = useState<"walk" | "run" | "bike">("walk");
  const [trend] = useState<number[]>([3200, 4800, 6100, 2900, 8400, 5500, 7700]);

  useEffect(() => {
    let sub: { remove: () => void } | null = null;
    (async () => {
      if (demoMode) return;
      if (await isAvailable()) sub = watchSteps((n) => addTodaySteps(n));
    })();
    return () => sub?.remove();
  }, [demoMode]);

  useEffect(() => {
    if (!live) return;
    let sub: { remove: () => void } | null = null;
    if (demoMode) {
      sub = startDemoStepStream((n) => {
        pushLiveSteps(n);
        addTodaySteps(n);
      });
    } else {
      sub = watchSteps((n) => {
        pushLiveSteps(n);
        addTodaySteps(n);
      });
    }
    return () => sub?.remove();
  }, [live, demoMode]);

  function onStart() {
    startLive(type);
  }

  async function onStop() {
    const ended = endLive();
    if (!ended || !user) return;
    const distanceKm = ended.type === "bike" ? ended.distanceKm : Math.max(ended.distanceKm, ended.steps / 1300);
    const earned = pointsForActivity({ type: ended.type, steps: ended.steps, distanceKm });
    const capped = applyDailyCap(todayPoints, earned);
    addTodayPoints(capped);
    addPoints(capped);
    bumpUserNeighborhood(user.neighborhoodId, capped);
    const startedAt = Date.now() - ended.durationMin * 60000;
    pushHistory({
      aid: `act-${startedAt}`,
      uid: user.uid,
      type: ended.type,
      steps: ended.steps,
      distanceKm,
      durationMin: ended.durationMin,
      points: capped,
      startedAt,
      endedAt: Date.now()
    });
    await backend.recordActivity({
      aid: `act-${startedAt}`,
      uid: user.uid,
      type: ended.type,
      steps: ended.steps,
      distanceKm,
      durationMin: ended.durationMin,
      points: capped,
      startedAt,
      endedAt: Date.now()
    });
  }

  const nhood = user ? findNeighborhood(user.neighborhoodId) : undefined;
  const lvl = levelOfUser(user);

  return (
    <Screen>
      <LargeTitle
        eyebrow={tr.today.greeting(user?.name ?? "")}
        title={nhood?.name ? `${nhood.name}` : "Bugün"}
        subtitle={nhood?.district ? `${nhood.district} · Mahallesi` : undefined}
        trailing={<Badge label={`LV ${String(lvl).padStart(2, "0")}`} tone="ghost" mono />}
      />

      <PointCounter steps={todaySteps} points={todayPoints} />

      <SectionTitle sub={demoMode ? "DEMO MODE" : "CANLI SENSÖR"}>Aktivite</SectionTitle>
      <ActivityCard
        active={!!live}
        type={type}
        onSelectType={setType}
        onStart={onStart}
        onStop={onStop}
        source={demoMode ? tr.today.sourceDemo : tr.today.sourcePedometer}
        liveSteps={live?.steps ?? 0}
        liveDistanceKm={live?.distanceKm ?? 0}
      />

      <SectionTitle sub="HAFTALIK">Trend</SectionTitle>
      <WeeklyTrendChart values={trend} labels={DAY_LABELS} />

      <View className="flex-row items-center justify-center mt-6 mb-2 gap-2">
        <View className="h-px flex-1 bg-navy-900/10" />
        <Text
          className="text-steel-400"
          style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 9, letterSpacing: 1.6 }}
        >
          MAHALLELİG · {new Date().getFullYear()} SEZONU
        </Text>
        <View className="h-px flex-1 bg-navy-900/10" />
      </View>
    </Screen>
  );
}
