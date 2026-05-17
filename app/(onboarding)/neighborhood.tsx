import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { NEIGHBORHOODS } from "@/constants/seed/neighborhoods";
import { tr } from "@/constants/i18n";

export default function PickNeighborhood() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <Screen scroll={false}>
      <Text className="text-2xl font-bold text-ink-900 dark:text-white py-4">{tr.onboarding.pickNeighborhood}</Text>
      <FlatList
        data={NEIGHBORHOODS}
        keyExtractor={(n) => n.nid}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelected(item.nid)}
            className={`border rounded-xl p-3 mb-2 ${selected === item.nid ? "border-brand-500 bg-brand-50" : "border-ink-300"}`}
          >
            <Text className="text-ink-900 font-semibold">{item.name}</Text>
            <Text className="text-ink-500 text-xs">{item.district}, {item.city}</Text>
          </Pressable>
        )}
      />
      <Pressable
        disabled={!selected}
        onPress={() => router.push({ pathname: "/(onboarding)/permissions", params: { name, nid: selected ?? "" } })}
        className={`rounded-xl py-4 mt-3 ${selected ? "bg-brand-500" : "bg-ink-300"}`}
      >
        <Text className="text-center text-white font-semibold">{tr.onboarding.continue}</Text>
      </Pressable>
    </Screen>
  );
}
