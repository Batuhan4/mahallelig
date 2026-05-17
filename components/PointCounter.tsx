import { Text, View } from "react-native";

export function PointCounter({ steps, points }: { steps: number; points: number }) {
  return (
    <View className="rounded-2xl bg-navy-900 overflow-hidden">
      <View className="h-1 flex-row">
        <View className="flex-1 bg-terra-500" />
        <View className="w-8 bg-bronze-500" />
      </View>
      <View className="px-5 py-5">
        <View className="flex-row items-center gap-1.5 mb-1">
          <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
          <Text
            className="text-ivory-100/70"
            style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1.6 }}
          >
            BUGÜN · ADIM
          </Text>
        </View>
        <Text
          className="text-ivory-50"
          style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 52, letterSpacing: -2.2, lineHeight: 56 }}
        >
          {steps.toLocaleString("tr-TR")}
        </Text>

        <View className="flex-row mt-3 pt-3 border-t border-ivory-100/10 items-end justify-between">
          <View>
            <Text
              className="text-ivory-100/60"
              style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.4 }}
            >
              MAHALLEPUAN
            </Text>
            <View className="flex-row items-baseline gap-1 mt-0.5">
              <Text
                className="text-terra-400"
                style={{ fontFamily: "Fraunces_700Bold", fontSize: 22, letterSpacing: -0.6 }}
              >
                +{points.toLocaleString("tr-TR")}
              </Text>
              <Text
                className="text-ivory-100/50"
                style={{ fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 0.4 }}
              >
                P
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text
              className="text-ivory-100/60"
              style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.4 }}
            >
              GÜNLÜK HEDEF
            </Text>
            <Text
              className="text-ivory-50 mt-0.5"
              style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 12, letterSpacing: 0.4 }}
            >
              {steps.toLocaleString("tr-TR")} / 10.000
            </Text>
          </View>
        </View>

        <View className="mt-3 h-1 bg-ivory-100/10 rounded-full overflow-hidden">
          <View
            className="h-full bg-terra-500"
            style={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }}
          />
        </View>
      </View>
    </View>
  );
}
