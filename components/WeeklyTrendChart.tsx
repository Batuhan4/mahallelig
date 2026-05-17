import { View, Text } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

export function WeeklyTrendChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(1, ...values);
  const width = 280;
  const height = 120;
  const barW = width / values.length - 8;
  return (
    <View className="bg-white border border-ink-300 rounded-2xl p-4 mt-4">
      <Text className="text-ink-700 font-semibold mb-2">Son 7 gün</Text>
      <Svg width={width} height={height + 20}>
        {values.map((v, i) => {
          const h = (v / max) * height;
          return (
            <Rect key={i} x={i * (barW + 8) + 4} y={height - h} width={barW} height={h} fill="#6366F1" rx={4} />
          );
        })}
        {labels.map((l, i) => (
          <SvgText key={i} x={i * (barW + 8) + 4 + barW / 2} y={height + 15} fontSize={10} fill="#64748B" textAnchor="middle">{l}</SvgText>
        ))}
      </Svg>
    </View>
  );
}
