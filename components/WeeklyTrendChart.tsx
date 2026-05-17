import { View, Text } from "react-native";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";
import { palette } from "@/constants/theme";

export function WeeklyTrendChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(1, ...values);
  const width = 300;
  const height = 100;
  const barW = width / values.length - 10;
  return (
    <View className="bg-ivory-50 border border-navy-900/10 rounded-2xl p-4 mt-4">
      <View className="flex-row items-baseline justify-between mb-3">
        <Text
          className="text-navy-900"
          style={{ fontFamily: "Fraunces_700Bold", fontSize: 16, letterSpacing: -0.3 }}
        >
          Son 7 gün
        </Text>
        <Text
          className="text-steel-500"
          style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 10, letterSpacing: 0.6 }}
        >
          {max.toLocaleString("tr-TR")} max
        </Text>
      </View>
      <Svg width={width} height={height + 22}>
        <Line x1={0} x2={width} y1={height + 1} y2={height + 1} stroke={palette.navy900} strokeOpacity={0.12} strokeWidth={1} />
        {values.map((v, i) => {
          const h = (v / max) * height;
          const isMax = v === max;
          return (
            <Rect
              key={i}
              x={i * (barW + 10) + 5}
              y={height - h}
              width={barW}
              height={h}
              fill={isMax ? palette.terra500 : palette.navy900}
              opacity={isMax ? 1 : 0.85}
              rx={3}
            />
          );
        })}
        {labels.map((l, i) => (
          <SvgText
            key={i}
            x={i * (barW + 10) + 5 + barW / 2}
            y={height + 17}
            fontSize={9}
            fontFamily="Inter_500Medium"
            fill={palette.steel500}
            textAnchor="middle"
            letterSpacing={1}
          >
            {l.toUpperCase()}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
