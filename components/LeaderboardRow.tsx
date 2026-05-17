import { Text, View } from "react-native";

export function LeaderboardRow({ rank, name, sub, points, you }: { rank: number; name: string; sub?: string; points: number; you?: boolean }) {
  return (
    <View className={`flex-row items-center justify-between rounded-xl px-3 py-3 mb-2 ${you ? "bg-brand-50 border border-brand-500" : "bg-white border border-ink-300"}`}>
      <View className="flex-row items-center gap-3">
        <Text className="text-ink-500 w-6 text-center">{rank}</Text>
        <View>
          <Text className={`font-semibold ${you ? "text-brand-700" : "text-ink-900"}`}>{name}</Text>
          {sub && <Text className="text-ink-500 text-xs">{sub}</Text>}
        </View>
      </View>
      <Text className="font-bold text-ink-900">{points.toLocaleString("tr-TR")}</Text>
    </View>
  );
}
