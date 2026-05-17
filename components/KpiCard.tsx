import { Text, View } from "react-native";

export function KpiCard({ label, value, sub, tone = "default" }: { label: string; value: string; sub?: string; tone?: "default" | "accent" }) {
  return (
    <View className={`flex-1 bg-ivory-50 border border-navy-900/10 rounded-2xl px-3.5 py-3 m-1 ${tone === "accent" ? "border-terra-500/40" : ""}`}>
      <Text
        className="text-steel-500"
        style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.2 }}
      >
        {label.toUpperCase()}
      </Text>
      <Text
        className="text-navy-900 mt-1"
        style={{ fontFamily: "Menlo", fontWeight: "700", fontSize: 22, letterSpacing: -0.6 }}
      >
        {value}
      </Text>
      {sub && (
        <View className="flex-row items-center gap-1 mt-0.5">
          <View className="w-1 h-1 rounded-full bg-field-500" />
          <Text
            className="text-field-500"
            style={{ fontFamily: "System", fontWeight: "500", fontSize: 10, letterSpacing: 0.2 }}
          >
            {sub}
          </Text>
        </View>
      )}
    </View>
  );
}
