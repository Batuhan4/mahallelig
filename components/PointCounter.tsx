import { Text, View } from "react-native";

export function PointCounter({ steps, points }: { steps: number; points: number }) {
  return (
    <View className="rounded-2xl bg-brand-500 p-6">
      <Text className="text-white/80 text-sm">Bugünki adım</Text>
      <Text className="text-white text-5xl font-bold">{steps.toLocaleString("tr-TR")}</Text>
      <Text className="text-white/80 mt-3 text-sm">MahallePuan</Text>
      <Text className="text-white text-3xl font-bold">+{points.toLocaleString("tr-TR")}</Text>
    </View>
  );
}
