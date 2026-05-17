import { Text, View } from "react-native";

export function LeaderboardRow({
  rank,
  name,
  sub,
  points,
  you
}: {
  rank: number;
  name: string;
  sub?: string;
  points: number;
  you?: boolean;
}) {
  const rankStr = String(rank).padStart(2, "0");
  return (
    <View
      className={`flex-row items-center px-3 py-3.5 mb-2 rounded-xl ${
        you ? "bg-navy-900" : "bg-ivory-50 border border-navy-900/8"
      }`}
    >
      <Text
        className={`${you ? "text-terra-400" : "text-steel-500"} w-9`}
        style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 13, letterSpacing: -0.3 }}
      >
        {rankStr}
      </Text>
      <View className="flex-1 pr-2">
        <Text
          className={you ? "text-ivory-50" : "text-navy-900"}
          style={{ fontFamily: "System", fontWeight: "700", fontSize: 15, letterSpacing: -0.3 }}
          numberOfLines={1}
        >
          {name}
        </Text>
        {sub && (
          <Text
            className={you ? "text-ivory-100/60" : "text-steel-500"}
            style={{ fontFamily: "System", fontWeight: "500", fontSize: 11, marginTop: 1, letterSpacing: 0.4 }}
            numberOfLines={1}
          >
            {sub.toUpperCase()}
          </Text>
        )}
      </View>
      <View className="items-end">
        <Text
          className={you ? "text-ivory-50" : "text-navy-900"}
          style={{ fontFamily: "Menlo", fontWeight: "700", fontSize: 15, letterSpacing: -0.4 }}
        >
          {points.toLocaleString("tr-TR")}
        </Text>
        <Text
          className={you ? "text-ivory-100/60" : "text-steel-400"}
          style={{ fontFamily: "System", fontWeight: "500", fontSize: 9, letterSpacing: 0.6, marginTop: 1 }}
        >
          PUAN
        </Text>
      </View>
      {you && <View className="w-1.5 h-1.5 rounded-full bg-terra-500 ml-2" />}
    </View>
  );
}
