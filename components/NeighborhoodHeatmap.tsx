import { Text, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import type { LeagueRow } from "@/services/league";

export function NeighborhoodHeatmap({ rows }: { rows: LeagueRow[] }) {
  const cols = 8;
  const cell = 36;
  const max = Math.max(1, ...rows.map((r) => r.weeklyPoints));
  return (
    <View className="bg-white border border-ink-300 rounded-2xl p-3 mt-2">
      <Text className="text-ink-700 font-semibold mb-2">Mahalle ısı haritası</Text>
      <Svg width={cols * cell + 4} height={Math.ceil(rows.length / cols) * cell + 4}>
        {rows.map((r, i) => {
          const x = (i % cols) * cell;
          const y = Math.floor(i / cols) * cell;
          const t = r.weeklyPoints / max;
          const r8 = Math.round(99 - 80 * t);
          const g8 = Math.round(102 + 90 * t);
          const b8 = Math.round(241 - 100 * t);
          return <Rect key={r.nid} x={x + 2} y={y + 2} width={cell - 4} height={cell - 4} rx={6} fill={`rgb(${r8},${g8},${b8})`} />;
        })}
      </Svg>
    </View>
  );
}
