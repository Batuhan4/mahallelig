import { Text, View } from "react-native";

export function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View className="flex-1 bg-white border border-ink-300 rounded-2xl p-3 m-1">
      <Text className="text-ink-500 text-xs">{label}</Text>
      <Text className="text-ink-900 text-xl font-bold">{value}</Text>
      {sub && <Text className="text-accent-500 text-xs mt-1">{sub}</Text>}
    </View>
  );
}
