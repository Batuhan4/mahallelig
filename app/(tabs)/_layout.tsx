import { Tabs } from "expo-router";
import { tr } from "@/constants/i18n";
import { Text } from "react-native";

const ICONS: Record<string, string> = { index: "🏃", league: "🏆", market: "🎁", municipality: "🏛️", profile: "👤" };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#6366F1",
        tabBarIcon: ({ focused }) => <Text style={{ fontSize: focused ? 22 : 18 }}>{ICONS[route.name] ?? "•"}</Text>
      })}
    >
      <Tabs.Screen name="index" options={{ title: tr.tabs.today }} />
      <Tabs.Screen name="league" options={{ title: tr.tabs.league }} />
      <Tabs.Screen name="market" options={{ title: tr.tabs.market }} />
      <Tabs.Screen name="municipality" options={{ title: tr.tabs.muni }} />
      <Tabs.Screen name="profile" options={{ title: tr.tabs.profile }} />
    </Tabs>
  );
}
