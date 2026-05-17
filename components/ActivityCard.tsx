import { Pressable, Text, View } from "react-native";
import { tr } from "@/constants/i18n";

type Type = "walk" | "run" | "bike";
const LABEL: Record<Type, string> = { walk: tr.today.activityTypeWalk, run: tr.today.activityTypeRun, bike: tr.today.activityTypeBike };
const ICON: Record<Type, string> = { walk: "🚶", run: "🏃", bike: "🚴" };

export function ActivityCard({
  active, type, onSelectType, onStart, onStop, source, liveSteps, liveDistanceKm
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
    <View className="rounded-2xl bg-white border border-ink-300 p-4 mt-4">
      <View className="flex-row justify-between items-center mb-3">
        {(Object.keys(LABEL) as Type[]).map((t) => (
          <Pressable key={t} onPress={() => onSelectType(t)} className={`flex-1 mx-1 py-2 rounded-xl ${type === t ? "bg-ink-900" : "bg-ink-300/40"}`}>
            <Text className={`text-center font-semibold ${type === t ? "text-white" : "text-ink-700"}`}>{ICON[t]} {LABEL[t]}</Text>
          </Pressable>
        ))}
      </View>
      {active ? (
        <>
          <Text className="text-ink-500 text-sm">Canlı · {source}</Text>
          <Text className="text-ink-900 text-2xl font-bold">{liveSteps.toLocaleString("tr-TR")} adım · {liveDistanceKm.toFixed(2)} km</Text>
          <Pressable onPress={onStop} className="rounded-xl bg-danger bg-red-500 mt-3 py-3">
            <Text className="text-center text-white font-semibold">{tr.today.stopActivity}</Text>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={onStart} className="rounded-xl bg-accent-500 py-3">
          <Text className="text-center text-white font-semibold">{tr.today.startActivity}</Text>
        </Pressable>
      )}
    </View>
  );
}
