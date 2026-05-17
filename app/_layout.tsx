import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastHost } from "@/components/Toast";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="reward/[rid]" options={{ presentation: "modal", headerShown: true, title: "Ödül" }} />
        <Stack.Screen name="feed" options={{ presentation: "modal", headerShown: true, title: "Sosyal Feed" }} />
        <Stack.Screen name="business" options={{ presentation: "modal", headerShown: true, title: "Yerel İşletme" }} />
      </Stack>
      <ToastHost />
    </GestureHandlerRootView>
  );
}
