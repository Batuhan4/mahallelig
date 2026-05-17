import { Pressable, Text, View } from "react-native";
import { tr } from "@/constants/i18n";
import { Button } from "@/components/Button";

type Type = "walk" | "run" | "bike";
const LABEL: Record<Type, string> = { walk: tr.today.activityTypeWalk, run: tr.today.activityTypeRun, bike: tr.today.activityTypeBike };
const ICON: Record<Type, string> = { walk: "🚶", run: "🏃", bike: "🚴" };

export function ActivityCard({
  active,
  type,
  onSelectType,
  onStart,
  onStop,
  source,
  liveSteps,
  liveDistanceKm
}: {
  active: boolean;
  type: Type;
  onSelectType: (t: Type) => void;
  onStart: () => void;
  onStop: () => void;
  source: string;
  liveSteps: number;
  liveDistanceKm: number;
}) {
  return (
    <View className="rounded-2xl bg-ivory-50 border border-navy-900/10 p-4 mt-4 overflow-hidden">
      <View className="flex-row items-center justify-between mb-3">
        <Text
          className="text-steel-500"
          style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1.6 }}
        >
          AKTİVİTE TÜRÜ
        </Text>
        {active && (
          <View className="flex-row items-center gap-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
            <Text
              className="text-terra-700"
              style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1.6 }}
            >
              CANLI
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row gap-1.5 mb-4">
        {(Object.keys(LABEL) as Type[]).map((t) => {
          const isActive = type === t;
          return (
            <Pressable
              key={t}
              onPress={() => onSelectType(t)}
              className={`flex-1 py-2.5 rounded-xl border ${isActive ? "bg-navy-900 border-navy-900" : "bg-transparent border-navy-900/15"}`}
            >
              <Text
                className={`text-center ${isActive ? "text-ivory-50" : "text-navy-900"}`}
                style={{ fontFamily: "Inter_600SemiBold", fontSize: 13 }}
              >
                {ICON[t]}  {LABEL[t]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {active ? (
        <View>
          <Text
            className="text-steel-500"
            style={{ fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 0.6 }}
          >
            KAYNAK · {source.toUpperCase()}
          </Text>
          <View className="flex-row items-baseline gap-2 mt-1.5 mb-1">
            <Text
              className="text-navy-900"
              style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 36, letterSpacing: -1.4 }}
            >
              {liveSteps.toLocaleString("tr-TR")}
            </Text>
            <Text
              className="text-steel-500"
              style={{ fontFamily: "Inter_500Medium", fontSize: 12, letterSpacing: 0.4 }}
            >
              adım
            </Text>
          </View>
          <Text
            className="text-steel-500 mb-3"
            style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 12 }}
          >
            {liveDistanceKm.toFixed(2)} km
          </Text>
          <Button label={tr.today.stopActivity} variant="danger" onPress={onStop} />
        </View>
      ) : (
        <Button label={tr.today.startActivity} variant="primary" onPress={onStart} />
      )}
    </View>
  );
}
