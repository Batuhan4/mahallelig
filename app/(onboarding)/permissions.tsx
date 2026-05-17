import { Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { tr } from "@/constants/i18n";
import { useUserStore, makeNewUser } from "@/store/useUserStore";
import { requestLocationPermission } from "@/services/location";
import { requestNotificationPermission } from "@/services/notifications";
import { useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function Permissions() {
  const { name, nid } = useLocalSearchParams<{ name: string; nid: string }>();
  const [loc, setLoc] = useState(false);
  const [notif, setNotif] = useState(false);
  const setUser = useUserStore((s) => s.setUser);
  const setOnboarded = useUserStore((s) => s.setOnboarded);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);

  async function finish() {
    setUser(makeNewUser({ name: String(name ?? "Misafir"), neighborhoodId: String(nid ?? "caferaga") }));
    setOnboarded(true);
    router.replace("/(tabs)");
  }

  return (
    <Screen>
      <View className="flex-1 justify-center gap-4 py-12">
        <Text className="text-3xl font-bold text-ink-900 dark:text-white">{tr.onboarding.permissionsTitle}</Text>
        <Text className="text-ink-500">{tr.onboarding.permissionsBody}</Text>
        <Pressable onPress={async () => setLoc(await requestLocationPermission())} className="border border-ink-300 rounded-xl py-3">
          <Text className="text-center text-ink-900 dark:text-white">{loc ? "✓ Konum" : tr.onboarding.grantLocation}</Text>
        </Pressable>
        <Pressable onPress={async () => { const ok = await requestNotificationPermission(); setNotif(ok); setNotificationsEnabled(ok); }} className="border border-ink-300 rounded-xl py-3">
          <Text className="text-center text-ink-900 dark:text-white">{notif ? "✓ Bildirim" : tr.onboarding.grantNotifications}</Text>
        </Pressable>
        <Pressable onPress={finish} className="rounded-xl bg-brand-500 py-4 mt-4">
          <Text className="text-center text-white font-semibold">{tr.onboarding.finish}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
