import { Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { tr } from "@/constants/i18n";
import { useUserStore, makeNewUser } from "@/store/useUserStore";
import { requestLocationPermission } from "@/services/location";
import { requestNotificationPermission } from "@/services/notifications";
import { useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { palette } from "@/constants/theme";

function PermissionRow({
  label,
  desc,
  granted,
  onPress
}: {
  label: string;
  desc: string;
  granted: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`border rounded-2xl px-4 py-4 mb-3 flex-row items-center ${
        granted ? "border-field-500/50 bg-ivory-50" : "border-navy-900/15 bg-ivory-50"
      }`}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: granted ? palette.field500 : palette.ivory200 }}
      >
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 20, color: granted ? palette.ivory50 : palette.navy900 }}>
          {granted ? "✓" : "·"}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-navy-900" style={{ fontFamily: "Fraunces_700Bold", fontSize: 15, letterSpacing: -0.3 }}>
          {label}
        </Text>
        <Text className="text-steel-500" style={{ fontFamily: "Inter_500Medium", fontSize: 12 }}>
          {desc}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 10,
          letterSpacing: 1.4,
          color: granted ? palette.field500 : palette.terra500
        }}
      >
        {granted ? "VERİLDİ" : "İSTE"}
      </Text>
    </Pressable>
  );
}

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
      <View className="pt-6 pb-3">
        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
          <Text
            className="text-steel-500"
            style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1.6 }}
          >
            KAYIT · 3 / 3
          </Text>
        </View>
        <Text
          className="text-navy-900"
          style={{ fontFamily: "Fraunces_700Bold", fontSize: 30, letterSpacing: -1.2, lineHeight: 32 }}
        >
          {tr.onboarding.permissionsTitle}
        </Text>
        <Text
          className="text-steel-500 mt-2"
          style={{ fontFamily: "Inter_500Medium", fontSize: 14, lineHeight: 20 }}
        >
          {tr.onboarding.permissionsBody}
        </Text>
        <View className="h-px bg-navy-900/15 mt-4 mb-5" />
      </View>

      <PermissionRow
        label={tr.onboarding.grantLocation}
        desc="Mahalle sınırını ve aktivite mesafesini doğrulamak için."
        granted={loc}
        onPress={async () => setLoc(await requestLocationPermission())}
      />
      <PermissionRow
        label={tr.onboarding.grantNotifications}
        desc="Bildirim ve mahalle görevleri için."
        granted={notif}
        onPress={async () => {
          const ok = await requestNotificationPermission();
          setNotif(ok);
          setNotificationsEnabled(ok);
        }}
      />

      <View className="mt-6">
        <Button label={tr.onboarding.finish} variant="primary" onPress={finish} />
        <Text
          className="text-steel-400 text-center mt-3"
          style={{ fontFamily: "Inter_500Medium", fontSize: 11 }}
        >
          İzinleri sonra her zaman ayarlardan değiştirebilirsin.
        </Text>
      </View>
    </Screen>
  );
}
