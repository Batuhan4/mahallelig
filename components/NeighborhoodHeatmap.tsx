import { Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import type { LeagueRow } from "@/services/league";

// Quintile heatmap from ivory (low) → navy (high) with terra spike for the top cell.
export function NeighborhoodHeatmap({ rows }: { rows: LeagueRow[] }) {
  const cols = 8;
  const cell = 34;
  const max = Math.max(1, ...rows.map((r) => r.weeklyPoints));
  const min = Math.min(...rows.map((r) => r.weeklyPoints));
  function color(v: number, idx: number) {
    if (idx === 0) return "#D2603A"; // top rank → terra
    const t = (v - min) / Math.max(1, max - min);
    if (t > 0.75) return "#0C2340";
    if (t > 0.5) return "#1B3A5C";
    if (t > 0.25) return "#5E7691";
    if (t > 0.05) return "#D7DEEB";
    return "#ECE3D3";
  }
  return (
    <View className="bg-ivory-50 border border-navy-900/10 rounded-2xl p-4 mt-3">
      <View className="flex-row items-baseline justify-between mb-3">
        <Text
          className="text-navy-900"
          style={{ fontFamily: "System", fontWeight: "700", fontSize: 16, letterSpacing: -0.3 }}
        >
          Mahalle ısı haritası
        </Text>
        <Text
          className="text-steel-500"
          style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 10, letterSpacing: 0.6 }}
        >
          {rows.length} mahalle
        </Text>
      </View>
      <Svg width={cols * cell + 4} height={Math.ceil(rows.length / cols) * cell + 4}>
        {rows.map((r, i) => {
          const x = (i % cols) * cell;
          const y = Math.floor(i / cols) * cell;
          return (
            <Rect
              key={r.nid}
              x={x + 2}
              y={y + 2}
              width={cell - 4}
              height={cell - 4}
              rx={4}
              fill={color(r.weeklyPoints, i)}
            />
          );
        })}
      </Svg>
      <View className="flex-row items-center mt-3 gap-1.5">
        <Text
          className="text-steel-500"
          style={{ fontFamily: "System", fontWeight: "500", fontSize: 9, letterSpacing: 0.8 }}
        >
          AZ
        </Text>
        {["#ECE3D3", "#D7DEEB", "#5E7691", "#1B3A5C", "#0C2340", "#D2603A"].map((c) => (
          <View key={c} style={{ width: 14, height: 6, borderRadius: 1.5, backgroundColor: c }} />
        ))}
        <Text
          className="text-steel-500"
          style={{ fontFamily: "System", fontWeight: "500", fontSize: 9, letterSpacing: 0.8 }}
        >
          ÇOK
        </Text>
      </View>
    </View>
  );
}
