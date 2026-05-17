import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { NEIGHBORHOODS } from "@/constants/seed/neighborhoods";
import { tr } from "@/constants/i18n";
import { palette } from "@/constants/theme";

export default function PickNeighborhood() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Screen scroll={false}>
      <View className="pt-6 pb-3">
        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
          <Text
            className="text-steel-500"
            style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1.6 }}
          >
            KAYIT · 2 / 3
          </Text>
        </View>
        <Text
          className="text-navy-900"
          style={{ fontFamily: "Fraunces_700Bold", fontSize: 30, letterSpacing: -1.2, lineHeight: 32 }}
        >
          {tr.onboarding.pickNeighborhood}
        </Text>
        <Text
          className="text-steel-500 mt-1.5"
          style={{ fontFamily: "Inter_500Medium", fontSize: 12 }}
        >
          {NEIGHBORHOODS.length} mahalle · İstanbul
        </Text>
        <View className="h-px bg-navy-900/15 mt-4" />
      </View>

      <FlatList
        data={NEIGHBORHOODS}
        keyExtractor={(n) => n.nid}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item, index }) => {
          const isSelected = selected === item.nid;
          return (
            <Pressable
              onPress={() => setSelected(item.nid)}
              className={`flex-row items-center px-3 py-3 rounded-2xl mb-1.5 border ${
                isSelected ? "bg-navy-900 border-navy-900" : "bg-transparent border-navy-900/8"
              }`}
            >
              <Text
                style={{
                  fontFamily: "IBMPlexMono_500Medium",
                  fontSize: 11,
                  letterSpacing: -0.2,
                  color: isSelected ? palette.terra400 : palette.steel400,
                  width: 28
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </Text>
              <View className="flex-1">
                <Text
                  style={{
                    fontFamily: "Fraunces_700Bold",
                    fontSize: 15,
                    letterSpacing: -0.3,
                    color: isSelected ? palette.ivory50 : palette.navy900
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 10,
                    letterSpacing: 0.6,
                    color: isSelected ? "rgba(245, 240, 230, 0.6)" : palette.steel500,
                    marginTop: 1
                  }}
                >
                  {item.district.toUpperCase()} · {item.city.toUpperCase()}
                </Text>
              </View>
              {isSelected && <View className="w-2 h-2 rounded-full bg-terra-500" />}
            </Pressable>
          );
        }}
      />

      <View className="pt-2 pb-3">
        <Button
          label={tr.onboarding.continue}
          variant={selected ? "primary" : "ghost"}
          onPress={
            selected
              ? () => router.push({ pathname: "/(onboarding)/permissions", params: { name, nid: selected } })
              : undefined
          }
        />
      </View>
    </Screen>
  );
}
