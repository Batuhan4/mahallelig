import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { tr } from "@/constants/i18n";
import { palette } from "@/constants/theme";

export default function Welcome() {
  const [name, setName] = useState("");

  return (
    <Screen>
      <View className="flex-1 justify-between py-10">
        {/* Identity block */}
        <View>
          <View className="flex-row items-center gap-2">
            <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
            <Text
              className="text-navy-900"
              style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2 }}
            >
              MAHALLELİG · 2026 SEZONU
            </Text>
          </View>
          <View className="h-px bg-navy-900/15 mt-2 mb-1" />

          {/* Stamp/serial */}
          <View className="flex-row items-center justify-between mt-1">
            <Text
              className="text-steel-500"
              style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 10, letterSpacing: 0.8 }}
            >
              S/N · 0001 / İST
            </Text>
            <View className="px-2 py-0.5 border border-navy-900/30 rounded-sm">
              <Text
                className="text-navy-900"
                style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 9, letterSpacing: 1.2 }}
              >
                ÖN KAYIT
              </Text>
            </View>
          </View>
        </View>

        {/* Hero */}
        <View>
          <Text
            className="text-navy-900"
            style={{ fontFamily: "Fraunces_700Bold", fontSize: 64, letterSpacing: -3, lineHeight: 60 }}
          >
            {tr.onboarding.welcomeTitle.split(" ")[0]}
            <Text style={{ color: palette.terra500, fontFamily: "Fraunces_400Italic" }}>.</Text>
          </Text>
          <Text
            className="text-navy-900 -mt-1"
            style={{ fontFamily: "Fraunces_400Italic", fontSize: 30, letterSpacing: -0.8, lineHeight: 32 }}
          >
            {tr.onboarding.welcomeTitle.split(" ").slice(1).join(" ")}
          </Text>

          <View className="h-px bg-navy-900/15 my-5" />

          <Text
            className="text-steel-700"
            style={{ fontFamily: "Inter_500Medium", fontSize: 14, lineHeight: 22 }}
          >
            {tr.onboarding.welcomeSubtitle}
          </Text>
        </View>

        {/* Name input */}
        <View>
          <Text
            className="text-steel-500 mb-2"
            style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.6 }}
          >
            İSMİN
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ör. Murat"
            placeholderTextColor={palette.steel400}
            className="border border-navy-900/15 rounded-2xl px-4 py-4 text-navy-900 bg-ivory-50"
            style={{ fontFamily: "Fraunces_700Bold", fontSize: 18, letterSpacing: -0.3 }}
          />
          <View className="mt-4">
            <Button
              label={tr.onboarding.continue}
              variant={name.trim() ? "primary" : "ghost"}
              onPress={
                name.trim()
                  ? () => router.push({ pathname: "/(onboarding)/neighborhood", params: { name } })
                  : undefined
              }
            />
          </View>

          <View className="flex-row items-center justify-center mt-6 gap-2">
            <View className="h-px flex-1 bg-navy-900/10" />
            <Text
              className="text-steel-400"
              style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 9, letterSpacing: 1.4 }}
            >
              KAYIT · 1 / 3
            </Text>
            <View className="h-px flex-1 bg-navy-900/10" />
          </View>
        </View>
      </View>
    </Screen>
  );
}
