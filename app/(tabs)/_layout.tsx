import { Tabs } from "expo-router";
import { tr } from "@/constants/i18n";
import { FloatingTabBar } from "@/components/TabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: tr.tabs.today }} />
      <Tabs.Screen name="league" options={{ title: tr.tabs.league }} />
      <Tabs.Screen name="market" options={{ title: tr.tabs.market }} />
      <Tabs.Screen name="municipality" options={{ title: tr.tabs.muni }} />
      <Tabs.Screen name="profile" options={{ title: tr.tabs.profile }} />
    </Tabs>
  );
}
