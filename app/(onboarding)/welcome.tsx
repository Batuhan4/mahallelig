import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { tr } from "@/constants/i18n";
import { palette } from "@/constants/theme";
import { useGoogleAuth, type GoogleUser } from "@/services/auth";

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

export default function Welcome() {
  const [name, setName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const { signIn, isMock } = useGoogleAuth((u: GoogleUser) => {
    // Google'dan gelen kullanıcı: doğrudan mahalle seçimine.
    router.push({
      pathname: "/(onboarding)/neighborhood",
      params: { name: u.name, email: u.email, avatar: u.picture ?? "" }
    });
  });

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
            adjustsFontSizeToFit
            numberOfLines={1}
            className="text-navy-900"
            style={{ fontFamily: "Fraunces_700Bold", fontSize: 48, letterSpacing: -2, lineHeight: 50 }}
          >
            {tr.onboarding.welcomeTitle.split(" ")[0]}
            <Text style={{ color: palette.terra500, fontFamily: "Fraunces_400Italic" }}>.</Text>
          </Text>
          <Text
            numberOfLines={1}
            className="text-navy-900 mt-1"
            style={{ fontFamily: "Fraunces_400Italic", fontSize: 24, letterSpacing: -0.6, lineHeight: 28 }}
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

        {/* Auth block */}
        <View>
          {!showNameInput ? (
            <>
              {/* Google sign-in button */}
              <Pressable
                onPress={signIn}
                className="bg-ivory-50 border border-navy-900/15 rounded-2xl px-5 py-4 flex-row items-center justify-center"
              >
                <GoogleIcon />
                <Text
                  className="text-navy-900 ml-3"
                  style={{ fontFamily: "Inter_600SemiBold", fontSize: 15, letterSpacing: -0.1 }}
                >
                  Google ile devam et
                </Text>
              </Pressable>

              {/* Guest option */}
              <Pressable onPress={() => setShowNameInput(true)} className="mt-4 py-3">
                <Text
                  className="text-steel-500 text-center"
                  style={{ fontFamily: "Inter_500Medium", fontSize: 13 }}
                >
                  veya{" "}
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
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
                style={{ fontFamily: "Inter_500Medium", fontSize: 11, lineHeight: 16 }}
              >
                Verilerin cihazında kalır. KVKK uyarınca rota, sağlık ve konum bilgilerin{"\n"}
                hiçbir zaman üçüncü tarafa aktarılmaz.
              </Text>
            </>
          ) : (
            <>
              <Text
                className="text-steel-500 mb-2"
                style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.6 }}
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
              <Pressable onPress={() => setShowNameInput(false)} className="mt-3 py-2">
                <Text
                  className="text-steel-500 text-center"
                  style={{ fontFamily: "Inter_500Medium", fontSize: 13 }}
                >
                  ← Google ile devam et
                </Text>
              </Pressable>
            </>
          )}

          <View className="flex-row items-center justify-center mt-6 gap-2">
            <View className="h-px flex-1 bg-navy-900/10" />
            <Text
              className="text-steel-400"
              style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 9, letterSpacing: 1.4 }}
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
