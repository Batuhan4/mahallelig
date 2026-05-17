import { Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { partnerColors } from "@/constants/theme";

export function CategoryPieChart({ data }: { data: { partner: string; count: number }[] }) {
  const total = data.reduce((a, b) => a + b.count, 0) || 1;
  const r = 56, cx = 70, cy = 70;
  let acc = 0;
  return (
    <View className="bg-white border border-ink-300 rounded-2xl p-3 mt-2">
      <Text className="text-ink-700 font-semibold mb-2">Tercih edilen ödül kategorileri</Text>
      <View className="flex-row items-center">
        <Svg width={140} height={140}>
          <G>
            {data.map((d) => {
              const frac = d.count / total;
              const dash = 2 * Math.PI * r;
              const len = dash * frac;
              const rot = (acc / total) * 360;
              acc += d.count;
              return (
                <Circle key={d.partner} cx={cx} cy={cy} r={r} fill="transparent"
                  stroke={partnerColors[d.partner] ?? "#94A3B8"} strokeWidth={24}
                  strokeDasharray={`${len} ${dash}`} strokeDashoffset={0}
                  transform={`rotate(${rot - 90}, ${cx}, ${cy})`} />
              );
            })}
          </G>
        </Svg>
        <View className="flex-1 ml-3">
          {data.map((d) => (
            <View key={d.partner} className="flex-row items-center mb-1">
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: partnerColors[d.partner] ?? "#94A3B8" }} />
              <Text className="text-ink-700 text-xs ml-2">{d.partner} · {d.count}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
