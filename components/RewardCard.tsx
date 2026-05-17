import { Pressable, Text, View } from "react-native";
import { tr } from "@/constants/i18n";
import { partnerColors } from "@/constants/theme";
import type { Reward } from "@/constants/seed/rewards";

export function RewardCard({ reward, userPoints, onPress }: { reward: Reward; userPoints: number; onPress: () => void }) {
  const enough = userPoints >= reward.cost;
  return (
    <Pressable onPress={onPress} className="bg-white border border-ink-300 rounded-2xl p-4 mr-3 w-64">
      <View className="rounded-lg h-20 mb-3" style={{ backgroundColor: partnerColors[reward.partner] + "33" }} />
      <Text className="text-ink-900 font-semibold">{reward.title}</Text>
      <Text className="text-ink-500 text-xs mt-1">{reward.description}</Text>
      <View className="flex-row justify-between items-center mt-3">
        <Text className="text-ink-900 font-bold">{reward.cost.toLocaleString("tr-TR")} P</Text>
        <Text className={`text-xs font-semibold ${enough ? "text-accent-500" : "text-amber-600"}`}>
          {enough ? tr.market.enoughPoints : tr.market.needPoints(reward.cost - userPoints)}
        </Text>
      </View>
    </Pressable>
  );
}
