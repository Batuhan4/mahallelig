import { FlatList, Pressable, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { FEED } from "@/constants/seed/feed";
import { useState } from "react";

export default function Feed() {
  const [likes, setLikes] = useState<Record<string, number>>({});
  return (
    <Screen>
      <FlatList
        data={FEED}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View className="bg-white border border-ink-300 rounded-2xl p-3 mb-3">
            <Text className="text-ink-900 font-semibold">{item.author}</Text>
            <Text className="text-ink-700 mt-1">{item.text}</Text>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-ink-500 text-xs">{item.minutesAgo} dk önce</Text>
              <Pressable onPress={() => setLikes((l) => ({ ...l, [item.id]: (l[item.id] ?? item.reactions) + 1 }))}>
                <Text className="text-brand-700">♥ {likes[item.id] ?? item.reactions}</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}
