import { FlatList, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { RewardCard } from "@/components/RewardCard";
import { REWARDS, type RewardPartner } from "@/constants/seed/rewards";
import { tr } from "@/constants/i18n";
import { useUserStore } from "@/store/useUserStore";

const ORDER: RewardPartner[] = ["belpa", "municipal_sports", "culture", "local", "transport"];

export default function Market() {
  const user = useUserStore((s) => s.user);
  const points = user?.totalPoints ?? 0;
  return (
    <Screen>
      <Text className="text-2xl font-bold text-ink-900 dark:text-white py-4">{tr.market.title}</Text>
      {ORDER.map((p) => {
        const rows = REWARDS.filter((r) => r.partner === p);
        if (!rows.length) return null;
        return (
          <View key={p} className="mb-5">
            <Text className="text-ink-700 font-semibold mb-2">{tr.market.categories[p]}</Text>
            <FlatList
              horizontal
              data={rows}
              keyExtractor={(r) => r.rid}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <RewardCard reward={item} userPoints={points} onPress={() => router.push(`/reward/${item.rid}`)} />}
            />
          </View>
        );
      })}
    </Screen>
  );
}
