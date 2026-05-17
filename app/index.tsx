import { Redirect } from "expo-router";
import { useUserStore } from "@/store/useUserStore";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { palette } from "@/constants/theme";

export default function Index() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration(() => setHydrated(true));
    if (useUserStore.persist.hasHydrated()) setHydrated(true);
    return () => unsub();
  }, []);
  const onboarded = useUserStore((s) => s.onboarded);
  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-ivory-100">
        <ActivityIndicator color={palette.navy900} />
      </View>
    );
  }
  return <Redirect href={onboarded ? "/(tabs)" : "/(onboarding)/welcome"} />;
}
