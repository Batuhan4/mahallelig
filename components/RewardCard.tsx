import { Pressable, Text, View } from "react-native";
import { Link, type Href } from "expo-router";
import { tr } from "@/constants/i18n";
import { partnerColors } from "@/constants/theme";
import type { Reward } from "@/constants/seed/rewards";

export function RewardCard({ reward, userPoints, href }: { reward: Reward; userPoints: number; href: Href }) {
  const enough = userPoints >= reward.cost;
  const accent = partnerColors[reward.partner] ?? "#0C2340";
  return (
    <Link href={href} asChild>
      <Pressable className="bg-ivory-50 border border-navy-900/10 rounded-2xl mr-3 overflow-hidden" style={{ width: 256 }}>
        <View className="h-24" style={{ backgroundColor: accent }}>
          <View className="flex-row h-full">
            <View className="flex-1" />
            <View className="w-3 bg-ivory-100/15" />
            <View className="w-1.5 bg-terra-500/80" />
          </View>
          <View className="absolute left-3 bottom-2">
            <Text
              className="text-ivory-100/70"
              style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.4 }}
            >
              {tr.market.categories[reward.partner].toUpperCase()}
            </Text>
          </View>
        </View>
        <View className="p-3.5">
          <Text
            className="text-navy-900"
            style={{ fontFamily: "System", fontWeight: "700", fontSize: 15, letterSpacing: -0.3 }}
            numberOfLines={1}
          >
            {reward.title}
          </Text>
          <Text
            className="text-steel-500 mt-1"
            style={{ fontFamily: "System", fontWeight: "500", fontSize: 12, lineHeight: 16 }}
            numberOfLines={2}
          >
            {reward.description}
          </Text>
          <View className="h-px bg-navy-900/10 my-3" />
          <View className="flex-row justify-between items-center">
            <Text
              className="text-navy-900"
              style={{ fontFamily: "Menlo", fontWeight: "700", fontSize: 15, letterSpacing: -0.3 }}
            >
              {reward.cost.toLocaleString("tr-TR")}
              <Text className="text-steel-400" style={{ fontFamily: "System", fontWeight: "500", fontSize: 10, letterSpacing: 0.6 }}>
                {"  P"}
              </Text>
            </Text>
            <View className={`flex-row items-center gap-1.5`}>
              <View className={`w-1.5 h-1.5 rounded-full ${enough ? "bg-field-500" : "bg-terra-500"}`} />
              <Text
                className={enough ? "text-field-500" : "text-terra-700"}
                style={{ fontFamily: "System", fontWeight: "600", fontSize: 10, letterSpacing: 0.6 }}
              >
                {enough
                  ? tr.market.enoughPoints.toUpperCase()
                  : tr.market.needPoints(reward.cost - userPoints).toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
