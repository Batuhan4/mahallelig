import { Text, View } from "react-native";

export function Badge({ label, tone = "brand" }: { label: string; tone?: "brand" | "accent" | "warn" | "ink" }) {
  const bg = { brand: "bg-brand-500", accent: "bg-accent-500", warn: "bg-amber-500", ink: "bg-ink-700" }[tone];
  return (
    <View className={`${bg} rounded-full px-3 py-1`}>
      <Text className="text-white text-xs font-semibold">{label}</Text>
    </View>
  );
}
