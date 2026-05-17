import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { palette } from "@/constants/theme";

type Provider = "apple" | "google" | "guest";

const PROVIDER_LABEL: Record<Provider, string> = {
  apple: "APPLE",
  google: "GOOGLE",
  guest: "MİSAFİR"
};

export default function Identity() {
  const params = useLocalSearchParams<{
    name?: string;
    email?: string;
    avatar?: string;
    provider?: string;
  }>();
  const provider = (params.provider as Provider) || "guest";
  const initialName = (params.name ?? "").trim();

  const [name, setName] = useState(initialName);

  const fromSocial = provider !== "guest";
  const hasAvatar = !!params.avatar && params.avatar.length > 0;

  function next() {
    const trimmed = name.trim();
    if (!trimmed) return;
    router.push({
      pathname: "/(onboarding)/neighborhood",
      params: { name: trimmed }
    });
  }

  function back() {
    router.back();
  }

  return (
    <Screen>
      <View className="flex-1 justify-between py-10">
        {/* Brand strip */}
        <View>
          <View className="flex-row items-center gap-2">
            <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
            <Text
              className="text-navy-900"
              style={{ fontFamily: "System", fontWeight: "600", fontSize: 10, letterSpacing: 2 }}
            >
              KAYIT · 1 / 3 · KİMLİK
            </Text>
          </View>
          <View className="h-px bg-navy-900/15 mt-2 mb-1" />
          <View className="flex-row items-center justify-between mt-1">
            <Text
              className="text-steel-500"
              style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 10, letterSpacing: 0.8 }}
            >
              KAYNAK · {PROVIDER_LABEL[provider]}
            </Text>
            {fromSocial ? (
              <View className="px-2 py-0.5 border border-field-500/40 bg-field-500/5 rounded-sm">
                <Text
                  style={{
                    fontFamily: "Menlo",
                    fontWeight: "500",
                    fontSize: 9,
                    letterSpacing: 1.2,
                    color: palette.field500
                  }}
                >
                  ✓ DOĞRULANDI
                </Text>
              </View>
            ) : (
              <View className="px-2 py-0.5 border border-navy-900/30 rounded-sm">
                <Text
                  className="text-navy-900"
                  style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 9, letterSpacing: 1.2 }}
                >
                  ANONİM
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Greeting + avatar + sub-line */}
        <View>
          <View className="flex-row items-end gap-3">
            {hasAvatar && (
              <View
                style={{
                  padding: 2,
                  borderRadius: 32,
                  backgroundColor: palette.ivory50,
                  borderWidth: 1,
                  borderColor: palette.navy900
                }}
              >
                <Image
                  source={{ uri: params.avatar }}
                  style={{ width: 56, height: 56, borderRadius: 28 }}
                  accessibilityLabel="Avatar"
                />
              </View>
            )}
            <View className="flex-1">
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                className="text-navy-900"
                style={{ fontFamily: "System", fontWeight: "700", fontSize: 40, letterSpacing: -1.6, lineHeight: 42 }}
              >
                Hoş geldin
                <Text style={{ color: palette.terra500, fontFamily: "System", fontWeight: "400", fontStyle: "italic" }}>.</Text>
              </Text>
            </View>
          </View>

          <View className="h-px bg-navy-900/15 my-5" />

          <Text
            className="text-steel-700"
            style={{ fontFamily: "System", fontWeight: "500", fontSize: 14, lineHeight: 22 }}
          >
            {provider === "apple"
              ? "Apple hesabından adın çekildi. Mahalle akışında bu şekilde gözükeceksin — istersen aşağıdan düzenleyebilirsin."
              : provider === "google"
              ? "Google hesabından adın çekildi. İstersen aşağıdan düzenleyebilirsin."
              : "Mahallendeki diğer komşulara nasıl gözükmek istersin?"}
          </Text>
        </View>

        {/* Name input */}
        <View>
          <Text
            className="text-steel-500 mb-2"
            style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.6 }}
          >
            İSMİN
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            autoFocus={!initialName}
            placeholder="Ör. Murat"
            placeholderTextColor={palette.steel400}
            className="border border-navy-900/15 rounded-2xl px-4 py-4 text-navy-900 bg-ivory-50"
            style={{ fontFamily: "System", fontWeight: "700", fontSize: 18, letterSpacing: -0.3 }}
            maxLength={40}
          />
          {fromSocial && name !== initialName && (
            <View className="flex-row items-center mt-2 gap-1.5">
              <View className="w-1 h-1 rounded-full bg-terra-500" />
              <Text
                className="text-terra-700"
                style={{ fontFamily: "System", fontWeight: "500", fontSize: 11 }}
              >
                {provider === "apple" ? "Apple" : "Google"}'dan çekilen "{initialName}" düzenlendi
              </Text>
            </View>
          )}

          <View className="mt-4">
            <Button
              label="Devam"
              variant={name.trim() ? "primary" : "ghost"}
              onPress={name.trim() ? next : undefined}
            />
          </View>

          <Pressable onPress={back} className="mt-3 py-2">
            <Text
              className="text-steel-500 text-center"
              style={{ fontFamily: "System", fontWeight: "500", fontSize: 13 }}
            >
              ← farklı bir hesapla giriş
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
