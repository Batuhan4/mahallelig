import { FlatList, Pressable, Text, View } from "react-native";
import { Screen, LargeTitle } from "@/components/Screen";
import { FEED } from "@/constants/seed/feed";
import { useState } from "react";

export default function Feed() {
  const [likes, setLikes] = useState<Record<string, number>>({});
  return (
    <Screen>
      <LargeTitle eyebrow="Mahalle hattı" title="Sosyal Feed" subtitle="Komşularının paylaşımları" />
      <FlatList
        data={FEED}
        keyExtractor={(p) => p.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View className="bg-ivory-50 border border-navy-900/10 rounded-2xl p-4 mb-3">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-7 h-7 rounded-full bg-navy-900 items-center justify-center">
                <Text className="text-ivory-50" style={{ fontFamily: "Fraunces_700Bold", fontSize: 11 }}>
                  {item.author.slice(0, 1).toUpperCase()}
                </Text>
              </View>
              <Text className="text-navy-900" style={{ fontFamily: "Fraunces_700Bold", fontSize: 14, letterSpacing: -0.3 }}>
                {item.author}
              </Text>
              <View className="flex-1" />
              <Text className="text-steel-400" style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 10 }}>
                {item.minutesAgo} DK
              </Text>
            </View>
            <Text className="text-navy-900" style={{ fontFamily: "Inter_500Medium", fontSize: 14, lineHeight: 20 }}>
              {item.text}
            </Text>
            <View className="h-px bg-navy-900/10 my-3" />
            <Pressable
              onPress={() => setLikes((l) => ({ ...l, [item.id]: (l[item.id] ?? item.reactions) + 1 }))}
              className="flex-row items-center gap-2 self-start"
            >
              <Text className="text-terra-500" style={{ fontFamily: "Fraunces_700Bold", fontSize: 14 }}>
                ♥
              </Text>
              <Text className="text-navy-900" style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 12 }}>
                {likes[item.id] ?? item.reactions}
              </Text>
              <Text className="text-steel-500" style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1.2 }}>
                BEĞENİ
              </Text>
            </Pressable>
          </View>
        )}
      />
    </Screen>
  );
}
