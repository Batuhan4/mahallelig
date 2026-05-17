import { useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { tr } from "@/constants/i18n";

export default function Welcome() {
  const [name, setName] = useState("");
  return (
    <Screen>
      <View className="flex-1 justify-center gap-6 py-12">
        <Text className="text-4xl font-bold text-ink-900 dark:text-white">{tr.onboarding.welcomeTitle}</Text>
        <Text className="text-base text-ink-500">{tr.onboarding.welcomeSubtitle}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="İsmin"
          placeholderTextColor="#94A3B8"
          className="border border-ink-300 rounded-xl px-4 py-3 text-ink-900 dark:text-white"
        />
        <Pressable
          accessibilityRole="button"
          disabled={!name.trim()}
          onPress={() => router.push({ pathname: "/(onboarding)/neighborhood", params: { name } })}
          className={`rounded-xl py-4 ${name.trim() ? "bg-brand-500" : "bg-ink-300"}`}
        >
          <Text className="text-center text-white font-semibold">{tr.onboarding.continue}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
