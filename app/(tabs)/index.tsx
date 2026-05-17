import { useEffect, useState } from "react";
import { AppState, Pressable, Text, View } from "react-native";
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
import { isAvailable, watchSteps, getStepsToday, requestPermissions as requestMotion } from "@/services/pedometer";
import { hasLocationPermission, requestLocationPermission, watchPosition } from "@/services/location";
import { isBarometerAvailable, watchAltitudeGain } from "@/services/barometer";
import { startDemoStepStream } from "@/services/demoMode";
import { pointsForActivity, applyDailyCap } from "@/services/points";
import { backend } from "@/services/backend";

const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const TODAY_REFRESH_MS = 30_000;

export default function Today() {
  const user = useUserStore((s) => s.user);
  const addPoints = useUserStore((s) => s.addPoints);
  const todaySteps = useActivityStore((s) => s.todaySteps);
  const todayPoints = useActivityStore((s) => s.todayPoints);
  const setTodaySteps = useActivityStore((s) => s.setTodaySteps);
  const addTodaySteps = useActivityStore((s) => s.addTodaySteps);
  const addTodayPoints = useActivityStore((s) => s.addTodayPoints);
  const live = useActivityStore((s) => s.liveActivity);
  const startLive = useActivityStore((s) => s.startLive);
  const pushLiveSteps = useActivityStore((s) => s.pushLiveSteps);
  const pushLiveDistance = useActivityStore((s) => s.pushLiveDistance);
  const setLiveAltitude = useActivityStore((s) => s.setLiveAltitude);
  const endLive = useActivityStore((s) => s.endLive);
  const pushHistory = useActivityStore((s) => s.pushHistory);
  const demoMode = useSettingsStore((s) => s.demoMode);
  const bumpUserNeighborhood = useLeagueStore((s) => s.bumpUserNeighborhood);

  const [type, setType] = useState<"walk" | "bike" | "stairs">("walk");
  const [trend] = useState<number[]>([3200, 4800, 6100, 2900, 8400, 5500, 7700]);
  const [pedometerReady, setPedometerReady] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsGranted, setGpsGranted] = useState(false);
  const [motionGranted, setMotionGranted] = useState(false);
  const [baroAvailable, setBaroAvailable] = useState(false);

  // === Today total: refresh from native pedometer + live deltas while open ===
  useEffect(() => {
    if (demoMode) return;
    let alive = true;
    let interval: ReturnType<typeof setInterval> | null = null;
    let stepSub: { remove: () => void } | null = null;
    let appStateSub: { remove: () => void } | null = null;

    async function refresh() {
      if (!alive) return;
      const total = await getStepsToday();
      if (alive && total >= 0) setTodaySteps(total);
    }

    (async () => {
      const ok = await isAvailable();
      if (!alive || !ok) return;
      const motionOk = await requestMotion();
      if (!alive) return;
      setMotionGranted(motionOk);
      setPedometerReady(true);
      const locOk = await hasLocationPermission();
      if (alive) setGpsGranted(locOk);
      const baroOk = await isBarometerAvailable();
      if (alive) setBaroAvailable(baroOk);
      await refresh();
      // Periodic refresh from Health/HealthConnect — covers steps that came in
      // while the app was backgrounded.
      interval = setInterval(refresh, TODAY_REFRESH_MS);
      // Realtime deltas while screen is open
      stepSub = watchSteps((delta) => addTodaySteps(delta));
      // Re-pull total when returning from background
      const handle = AppState.addEventListener("change", (s) => {
        if (s === "active") refresh();
      });
      appStateSub = { remove: () => handle.remove() };
    })();

    return () => {
      alive = false;
      if (interval) clearInterval(interval);
      stepSub?.remove();
      appStateSub?.remove();
    };
  }, [demoMode, setTodaySteps, addTodaySteps]);

  // === Live activity: pedometer + GPS + barometer (stairs) ===
  useEffect(() => {
    if (!live) {
      setGpsActive(false);
      return;
    }
    let stepSub: { remove: () => void } | null = null;
    let geoSub: { remove: () => void } | null = null;
    let baroSub: { remove: () => void } | null = null;

    if (demoMode) {
      stepSub = startDemoStepStream((delta) => {
        pushLiveSteps(delta);
        addTodaySteps(delta);
      });
    } else {
      // Steps: walk + stairs care, bike ignores
      if (live.type !== "bike") {
        stepSub = watchSteps((delta) => {
          pushLiveSteps(delta);
          addTodaySteps(delta);
        });
      }
      // GPS: walk + bike, not stairs
      if (live.type !== "stairs") {
        (async () => {
          const granted = await hasLocationPermission();
          if (!granted) return;
          const sub = await watchPosition((deltaKm) => {
            pushLiveDistance(deltaKm);
          });
          if (sub) {
            geoSub = sub;
            setGpsActive(true);
          }
        })();
      }
      // Barometer: stairs only
      if (live.type === "stairs" && baroAvailable) {
        baroSub = watchAltitudeGain((gain) => setLiveAltitude(gain));
      }
    }

    return () => {
      stepSub?.remove();
      geoSub?.remove();
      baroSub?.remove();
      setGpsActive(false);
    };
  }, [live, demoMode, baroAvailable, pushLiveSteps, pushLiveDistance, setLiveAltitude, addTodaySteps]);

  async function onStart() {
    if (!demoMode) {
      if (type !== "bike" && !motionGranted) {
        const ok = await requestMotion();
        setMotionGranted(ok);
      }
      if (type !== "stairs" && !gpsGranted) {
        const ok = await requestLocationPermission();
        setGpsGranted(ok);
      }
    }
    startLive(type);
  }

  async function onGrantPerms() {
    if (!motionGranted) {
      const ok = await requestMotion();
      setMotionGranted(ok);
    }
    if (!gpsGranted) {
      const ok = await requestLocationPermission();
      setGpsGranted(ok);
    }
  }

  async function onStop() {
    const ended = endLive();
    if (!ended || !user) return;
    // walk: prefer GPS distance, fall back to step estimate.
    // bike: GPS only (steps ≈ 0).
    // stairs: distanceKm meaningless, altitudeM matters.
    const fromSteps = ended.steps / 1300;
    const distanceKm =
      ended.type === "bike"
        ? ended.distanceKm
        : ended.type === "stairs"
          ? 0
          : Math.max(ended.distanceKm, fromSteps);
    const earned = pointsForActivity({
      type: ended.type,
      steps: ended.steps,
      distanceKm,
      altitudeM: ended.altitudeM
    });
    const capped = applyDailyCap(todayPoints, earned);
    addTodayPoints(capped);
    addPoints(capped);
    bumpUserNeighborhood(user.neighborhoodId, capped);
    const startedAt = Date.now() - ended.durationMin * 60000;
    const record = {
      aid: `act-${startedAt}`,
      uid: user.uid,
      type: ended.type,
      steps: ended.steps,
      distanceKm,
      altitudeM: ended.altitudeM > 0 ? ended.altitudeM : undefined,
      durationMin: ended.durationMin,
      points: capped,
      startedAt,
      endedAt: Date.now()
    };
    pushHistory(record);
    await backend.recordActivity(record);
  }

  const nhood = user ? findNeighborhood(user.neighborhoodId) : undefined;
  const lvl = levelOfUser(user);
  const sourceLabel = demoMode
    ? `DEMO ${10}X`
    : pedometerReady
      ? gpsActive
        ? "PEDOMETRE + GPS"
        : "PEDOMETRE"
      : "BAĞLANIYOR…";

  return (
    <Screen>
      <LargeTitle
        eyebrow={tr.today.greeting(user?.name ?? "")}
        title={nhood?.name ? `${nhood.name}` : "Bugün"}
        subtitle={nhood?.district ? `${nhood.district} · Mahallesi` : undefined}
        trailing={<Badge label={`LV ${String(lvl).padStart(2, "0")}`} tone="ghost" mono />}
      />

      <PointCounter steps={todaySteps} points={todayPoints} />

      {!demoMode && (!motionGranted || !gpsGranted) && (
        <Pressable
          onPress={onGrantPerms}
          className="bg-ivory-50 border border-terra-500/40 rounded-2xl overflow-hidden mt-3"
        >
          <View className="h-1 bg-terra-500" />
          <View className="px-4 py-3">
            <Text
              className="text-terra-700"
              style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.4 }}
            >
              EKSİK İZİN
            </Text>
            <Text
              className="text-navy-900 mt-1"
              style={{ fontFamily: "System", fontWeight: "700", fontSize: 15, letterSpacing: -0.3 }}
            >
              {!motionGranted && !gpsGranted
                ? "Adım sayımı + Konum izni gerekli"
                : !motionGranted
                  ? "Adım sayımı izni gerekli"
                  : "Konum izni gerekli (mesafe için)"}
            </Text>
            <Text
              className="text-steel-500 mt-0.5"
              style={{ fontFamily: "System", fontWeight: "500", fontSize: 12 }}
            >
              İzin ver · gerçek sensörler devreye girsin →
            </Text>
          </View>
        </Pressable>
      )}

      <SectionTitle sub={sourceLabel}>Aktivite</SectionTitle>
      <ActivityCard
        active={!!live}
        type={type}
        onSelectType={setType}
        onStart={onStart}
        onStop={onStop}
        source={
          demoMode
            ? tr.today.sourceDemo
            : type === "stairs"
              ? baroAvailable
                ? "Pedometre + Barometre"
                : "Pedometre"
              : type === "bike"
                ? gpsActive
                  ? "GPS"
                  : "GPS bekleniyor"
                : gpsActive
                  ? "Pedometre + GPS"
                  : "Pedometre"
        }
        liveSteps={live?.steps ?? 0}
        liveDistanceKm={live?.distanceKm ?? 0}
        liveAltitudeM={live?.altitudeM ?? 0}
      />

      <SectionTitle sub="HAFTALIK">Trend</SectionTitle>
      <WeeklyTrendChart values={trend} labels={DAY_LABELS} />

      <View className="flex-row items-center justify-center mt-6 mb-2 gap-2">
        <View className="h-px flex-1 bg-navy-900/10" />
        <Text
          className="text-steel-400"
          style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 9, letterSpacing: 1.6 }}
        >
          MAHALLELİG · {new Date().getFullYear()} SEZONU
        </Text>
        <View className="h-px flex-1 bg-navy-900/10" />
      </View>
    </Screen>
  );
}
