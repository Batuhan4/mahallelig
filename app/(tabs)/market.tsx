import { FlatList, Text, View } from "react-native";
import { Screen, LargeTitle } from "@/components/Screen";
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
      <LargeTitle
        eyebrow="Mahalleli özel"
        title={tr.market.title}
        subtitle={`${points.toLocaleString("tr-TR")} P · cüzdan bakiyeniz`}
        trailing={
          <View className="items-end">
            <Text
              className="text-navy-900"
              style={{ fontFamily: "Menlo", fontWeight: "700", fontSize: 24, letterSpacing: -0.6 }}
            >
              {REWARDS.length}
            </Text>
            <Text
              className="text-steel-500"
              style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.4 }}
            >
              ÖDÜL
            </Text>
          </View>
        }
      />

      {ORDER.map((p, idx) => {
        const rows = REWARDS.filter((r) => r.partner === p);
        if (!rows.length) return null;
        return (
          <View key={p} className="mb-7">
            <View className="flex-row items-baseline justify-between mb-3">
              <View className="flex-row items-baseline gap-2">
                <Text
                  className="text-steel-400"
                  style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 11, letterSpacing: 0.4 }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </Text>
                <Text
                  className="text-navy-900"
                  style={{ fontFamily: "System", fontWeight: "700", fontSize: 20, letterSpacing: -0.4 }}
                >
                  {tr.market.categories[p]}
                </Text>
              </View>
              <Text
                className="text-steel-500"
                style={{ fontFamily: "System", fontWeight: "600", fontSize: 10, letterSpacing: 0.8 }}
              >
                {rows.length} TEKLİF
              </Text>
            </View>
            <FlatList
              horizontal
              data={rows}
              keyExtractor={(r) => r.rid}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <RewardCard reward={item} userPoints={points} href={`/reward/${item.rid}`} />
              )}
            />
          </View>
        );
      })}
    </Screen>
  );
}
