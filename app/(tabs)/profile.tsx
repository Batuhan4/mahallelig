import { Pressable, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Badge } from "@/components/Badge";
import { tr } from "@/constants/i18n";
import { useUserStore, levelOfUser } from "@/store/useUserStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useRedemptionStore } from "@/store/useRedemptionStore";
import { findNeighborhood } from "@/services/league";
import { fireLocal } from "@/services/notifications";

const BADGES = ["Mahalle Şampiyonu", "İlk Yürüyüş", "5km Klübü", "Sabah Kuşu", "Bisiklet Dostu"];

export default function Profile() {
  const user = useUserStore((s) => s.user);
  const reset = useUserStore((s) => s.reset);
  const demoMode = useSettingsStore((s) => s.demoMode);
  const toggleDemoMode = useSettingsStore((s) => s.toggleDemoMode);
  const redemptions = useRedemptionStore((s) => s.items);
  const nhood = user ? findNeighborhood(user.neighborhoodId) : undefined;

  return (
    <Screen>
      <View className="items-center py-6 gap-2">
        <View className="w-20 h-20 rounded-full bg-brand-500 items-center justify-center">
          <Text className="text-white text-3xl font-bold">{(user?.name ?? "M")[0]}</Text>
        </View>
        <Text className="text-2xl font-bold text-ink-900 dark:text-white">{user?.name ?? "Misafir"}</Text>
        <Text className="text-ink-500">{nhood?.name ?? ""} · {nhood?.district ?? ""}</Text>
        <View className="flex-row gap-2 mt-1">
          <Badge label={`${(user?.totalPoints ?? 0).toLocaleString("tr-TR")} P`} tone="brand" />
          <Badge label={`Lv ${levelOfUser(user)}`} tone="accent" />
        </View>
      </View>

      <Text className="text-ink-700 font-semibold mb-2">{tr.profile.badges}</Text>
      <View className="flex-row flex-wrap">
        {BADGES.map((b) => (
          <View key={b} className="bg-white border border-ink-300 rounded-xl px-3 py-2 mr-2 mb-2">
            <Text className="text-ink-900 text-xs">🏅 {b}</Text>
          </View>
        ))}
      </View>

      <Text className="text-ink-700 font-semibold mt-4 mb-2">Redeem geçmişi</Text>
      {redemptions.length === 0 ? (
        <Text className="text-ink-500">Henüz redeem yok.</Text>
      ) : (
        redemptions.map((r) => (
          <View key={r.rdid} className="bg-white border border-ink-300 rounded-xl p-3 mb-2">
            <Text className="text-ink-900">{r.rid}</Text>
            <Text className="text-ink-500 text-xs">{r.status}</Text>
          </View>
        ))
      )}

      <Text className="text-ink-700 font-semibold mt-4 mb-2">{tr.profile.settings}</Text>
      <View className="bg-white border border-ink-300 rounded-xl p-3">
        <View className="flex-row items-center justify-between py-2">
          <Text className="text-ink-900">{tr.profile.demoMode}</Text>
          <Switch value={demoMode} onValueChange={toggleDemoMode} />
        </View>
        <Pressable onPress={() => fireLocal({ title: tr.push.overtakeTitle, body: tr.push.overtakeBody })} className="py-2">
          <Text className="text-brand-700 font-semibold">🔔 {tr.profile.triggerPush}</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/feed")} className="py-2"><Text className="text-brand-700">📰 Sosyal Feed</Text></Pressable>
        <Pressable onPress={() => router.push("/business")} className="py-2"><Text className="text-brand-700">🏪 Yerel İşletme Paneli</Text></Pressable>
        <Pressable onPress={() => { reset(); router.replace("/(onboarding)/welcome"); }} className="py-2"><Text className="text-red-500">↩︎ {tr.profile.signOut}</Text></Pressable>
      </View>
    </Screen>
  );
}
