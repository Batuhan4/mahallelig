import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { tr } from "@/constants/i18n";
import { palette } from "@/constants/theme";
import { useGoogleAuth, useAppleAuth, type SocialUser } from "@/services/auth";

function GoogleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 48 48">
      <Path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <Path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <Path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <Path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </Svg>
  );
}

function AppleIcon({ color = "#ffffff" }: { color?: string }) {
  return (
    <Svg width={17} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"
      />
    </Svg>
  );
}

export default function Welcome() {
  const [name, setName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  function onSocialUser(u: SocialUser) {
    router.push({
      pathname: "/(onboarding)/neighborhood",
      params: { name: u.name, email: u.email, avatar: u.picture ?? "" }
    });
  }

  const { signIn: signInGoogle } = useGoogleAuth(onSocialUser);
  const { signIn: signInApple } = useAppleAuth(onSocialUser);

  return (
    <Screen>
      <View className="flex-1 justify-between py-10">
        {/* Identity block */}
        <View>
          <View className="flex-row items-center gap-2">
            <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
            <Text
              className="text-navy-900"
              style={{ fontFamily: "System", fontWeight: "600", fontSize: 10, letterSpacing: 2 }}
            >
              MAHALLELİG · 2026 SEZONU
            </Text>
          </View>
          <View className="h-px bg-navy-900/15 mt-2 mb-1" />

          <View className="flex-row items-center justify-between mt-1">
            <Text
              className="text-steel-500"
              style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 10, letterSpacing: 0.8 }}
            >
              S/N · 0001 / İST
            </Text>
            <View className="px-2 py-0.5 border border-navy-900/30 rounded-sm">
              <Text
                className="text-navy-900"
                style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 9, letterSpacing: 1.2 }}
              >
                ÖN KAYIT
              </Text>
            </View>
          </View>
        </View>

        {/* Hero */}
        <View>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            className="text-navy-900"
            style={{ fontFamily: "System", fontWeight: "700", fontSize: 48, letterSpacing: -2, lineHeight: 50 }}
          >
            {tr.onboarding.welcomeTitle.split(" ")[0]}
            <Text style={{ color: palette.terra500, fontFamily: "System", fontWeight: "400", fontStyle: "italic" }}>.</Text>
          </Text>
          <Text
            numberOfLines={1}
            className="text-navy-900 mt-1"
            style={{ fontFamily: "System", fontWeight: "400", fontStyle: "italic", fontSize: 24, letterSpacing: -0.6, lineHeight: 28 }}
          >
            {tr.onboarding.welcomeTitle.split(" ").slice(1).join(" ")}
          </Text>

          <View className="h-px bg-navy-900/15 my-5" />

          <Text
            className="text-steel-700"
            style={{ fontFamily: "System", fontWeight: "500", fontSize: 14, lineHeight: 22 }}
          >
            {tr.onboarding.welcomeSubtitle}
          </Text>
        </View>

        {/* Auth block */}
        <View>
          {!showNameInput ? (
            <>
              {/* Apple sign-in — siyah, HIG kurallarına uygun, en üstte */}
              <Pressable
                onPress={signInApple}
                style={{ backgroundColor: "#000000" }}
                className="rounded-2xl px-5 py-4 flex-row items-center justify-center"
              >
                <AppleIcon color="#ffffff" />
                <Text
                  className="ml-2"
                  style={{ color: "#ffffff", fontFamily: "System", fontWeight: "600", fontSize: 15, letterSpacing: -0.1 }}
                >
                  Apple ile devam et
                </Text>
              </Pressable>

              {/* Google sign-in */}
              <Pressable
                onPress={signInGoogle}
                className="bg-ivory-50 border border-navy-900/15 rounded-2xl px-5 py-4 flex-row items-center justify-center mt-3"
              >
                <GoogleIcon />
                <Text
                  className="text-navy-900 ml-3"
                  style={{ fontFamily: "System", fontWeight: "600", fontSize: 15, letterSpacing: -0.1 }}
                >
                  Google ile devam et
                </Text>
              </Pressable>

              {/* Guest option */}
              <Pressable onPress={() => setShowNameInput(true)} className="mt-4 py-2">
                <Text
                  className="text-steel-500 text-center"
                  style={{ fontFamily: "System", fontWeight: "500", fontSize: 13 }}
                >
                  veya{" "}
                  <Text
                    style={{
                      fontFamily: "System",
                      fontWeight: "600",
                      color: palette.navy900,
                      textDecorationLine: "underline"
                    }}
                  >
                    giriş yapmadan devam et
                  </Text>
                </Text>
              </Pressable>

              <Text
                className="text-steel-400 text-center mt-3"
                style={{ fontFamily: "System", fontWeight: "500", fontSize: 11, lineHeight: 16 }}
              >
                Verilerin cihazında kalır. KVKK uyarınca rota, sağlık ve konum bilgilerin{"\n"}
                hiçbir zaman üçüncü tarafa aktarılmaz.
              </Text>
            </>
          ) : (
            <>
              <Text
                className="text-steel-500 mb-2"
                style={{ fontFamily: "System", fontWeight: "600", fontSize: 9, letterSpacing: 1.6 }}
              >
                İSMİN
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                autoFocus
                placeholder="Ör. Murat"
                placeholderTextColor={palette.steel400}
                className="border border-navy-900/15 rounded-2xl px-4 py-4 text-navy-900 bg-ivory-50"
                style={{ fontFamily: "System", fontWeight: "700", fontSize: 18, letterSpacing: -0.3 }}
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
              <Pressable onPress={() => setShowNameInput(false)} className="mt-3 py-2">
                <Text
                  className="text-steel-500 text-center"
                  style={{ fontFamily: "System", fontWeight: "500", fontSize: 13 }}
                >
                  ← sosyal hesapla devam et
                </Text>
              </Pressable>
            </>
          )}

          <View className="flex-row items-center justify-center mt-6 gap-2">
            <View className="h-px flex-1 bg-navy-900/10" />
            <Text
              className="text-steel-400"
              style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 9, letterSpacing: 1.4 }}
            >
              {showNameInput ? "MİSAFİR" : "GİRİŞ"} · 1 / 3
            </Text>
            <View className="h-px flex-1 bg-navy-900/10" />
          </View>
        </View>
      </View>
    </Screen>
  );
}
