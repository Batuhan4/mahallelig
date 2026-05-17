import "../global.css";
import { useEffect } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { ToastHost } from "@/components/Toast";
import { useAppFonts } from "@/services/useAppFonts";
import { palette } from "@/constants/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useAppFonts();

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: palette.ivory100 }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.ivory100 }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.ivory100 }
        }}
      >
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="reward/[rid]"
          options={{
            presentation: "modal",
            headerShown: true,
            headerStyle: { backgroundColor: palette.ivory100 },
            headerTitleStyle: { fontFamily: "System", fontWeight: "700", color: palette.navy900 },
            headerTintColor: palette.terra500,
            title: "Ödül"
          }}
        />
        <Stack.Screen
          name="feed"
          options={{
            presentation: "modal",
            headerShown: true,
            headerStyle: { backgroundColor: palette.ivory100 },
            headerTitleStyle: { fontFamily: "System", fontWeight: "700", color: palette.navy900 },
            headerTintColor: palette.terra500,
            title: "Sosyal Feed"
          }}
        />
        <Stack.Screen
          name="business"
          options={{
            presentation: "modal",
            headerShown: true,
            headerStyle: { backgroundColor: palette.ivory100 },
            headerTitleStyle: { fontFamily: "System", fontWeight: "700", color: palette.navy900 },
            headerTintColor: palette.terra500,
            title: "Yerel İşletme"
          }}
        />
      </Stack>
      <ToastHost />
    </GestureHandlerRootView>
  );
}
