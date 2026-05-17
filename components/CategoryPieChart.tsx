import { Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { partnerColors } from "@/constants/theme";
import { tr } from "@/constants/i18n";

export function CategoryPieChart({ data }: { data: { partner: string; count: number }[] }) {
  const total = data.reduce((a, b) => a + b.count, 0) || 1;
  const r = 50, cx = 64, cy = 64;
  let acc = 0;
  return (
    <View className="bg-ivory-50 border border-navy-900/10 rounded-2xl p-4 mt-3">
      <Text
        className="text-navy-900 mb-3"
        style={{ fontFamily: "Fraunces_700Bold", fontSize: 16, letterSpacing: -0.3 }}
      >
        Tercih edilen kategoriler
      </Text>
      <View className="flex-row items-center">
        <Svg width={128} height={128}>
          <Circle cx={cx} cy={cy} r={r} fill="transparent" stroke="#0C2340" strokeOpacity={0.06} strokeWidth={22} />
          <G>
            {data.map((d) => {
              const frac = d.count / total;
              const dash = 2 * Math.PI * r;
              const len = dash * frac;
              const rot = (acc / total) * 360;
              acc += d.count;
              return (
                <Circle
                  key={d.partner}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="transparent"
                  stroke={partnerColors[d.partner] ?? "#94A3B8"}
                  strokeWidth={22}
                  strokeDasharray={`${len - 2} ${dash}`}
                  strokeDashoffset={0}
                  transform={`rotate(${rot - 90}, ${cx}, ${cy})`}
                  strokeLinecap="butt"
                />
              );
            })}
          </G>
        </Svg>
        <View className="flex-1 ml-4">
          {data.map((d) => {
            const pct = Math.round((d.count / total) * 100);
            const label = (tr.market.categories as Record<string, string>)[d.partner] ?? d.partner;
            return (
              <View key={d.partner} className="flex-row items-center mb-1.5">
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    backgroundColor: partnerColors[d.partner] ?? "#94A3B8"
                  }}
                />
                <Text
                  className="text-navy-900 ml-2 flex-1"
                  style={{ fontFamily: "Inter_500Medium", fontSize: 11 }}
                  numberOfLines={1}
                >
                  {label}
                </Text>
                <Text
                  className="text-steel-500"
                  style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 11 }}
                >
                  {pct}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
