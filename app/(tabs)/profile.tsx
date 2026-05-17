import { Image, Pressable, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/Screen";
import { Badge } from "@/components/Badge";
import { tr } from "@/constants/i18n";
import { useUserStore, levelOfUser } from "@/store/useUserStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useRedemptionStore } from "@/store/useRedemptionStore";
import { useActivityStore } from "@/store/useActivityStore";
import { findNeighborhood } from "@/services/league";
import { fireLocal, requestNotificationPermission } from "@/services/notifications";
import { REWARDS } from "@/constants/seed/rewards";

const BADGES = ["Mahalle Şampiyonu", "İlk Yürüyüş", "5km Klübü", "Sabah Kuşu", "Bisiklet Dostu"];

const ACTIVITY_ICON = { walk: "🚶", run: "🏃", bike: "🚴" } as const;

function formatAgo(ts: number) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "az önce";
  if (min < 60) return `${min} dk önce`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} sa önce`;
  return `${Math.floor(hr / 24)} g önce`;
}

export default function Profile() {
  const user = useUserStore((s) => s.user);
  const reset = useUserStore((s) => s.reset);
  const demoMode = useSettingsStore((s) => s.demoMode);
  const toggleDemoMode = useSettingsStore((s) => s.toggleDemoMode);
  const redemptions = useRedemptionStore((s) => s.items);
  const history = useActivityStore((s) => s.history);
  const nhood = user ? findNeighborhood(user.neighborhoodId) : undefined;
  const avatarSeed = user?.avatarSeed ?? user?.uid ?? "guest";
  const avatarUri = `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(avatarSeed)}&size=200&radius=50&backgroundColor=eef2ff,e0e7ff,c7d2fe`;

  function onPushTest() {
    // Don't await — Chrome's permission prompt blocks the page; just fire toast immediately
    // and try the Notification API in the background.
    void requestNotificationPermission();
    fireLocal({ title: tr.push.overtakeTitle, body: tr.push.overtakeBody });
  }

  return (
    <Screen>
      <View className="items-center py-6 gap-2">
        <View className="w-24 h-24 rounded-full overflow-hidden bg-brand-50 items-center justify-center">
          <Image
            source={{ uri: avatarUri }}
            style={{ width: 96, height: 96 }}
            accessibilityLabel="Avatar"
          />
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

      <Text className="text-ink-700 font-semibold mt-4 mb-2">Aktivite geçmişi</Text>
      {history.length === 0 ? (
        <Text className="text-ink-500">Henüz aktivite kaydı yok. Bugün ekranından bir aktivite başlat.</Text>
      ) : (
        history.slice(0, 6).map((a) => (
          <View key={a.aid} className="bg-white border border-ink-300 rounded-xl p-3 mb-2 flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">{ACTIVITY_ICON[a.type]}</Text>
              <View>
                <Text className="text-ink-900 font-semibold">
                  {a.distanceKm.toFixed(2)} km · {a.steps.toLocaleString("tr-TR")} adım
                </Text>
                <Text className="text-ink-500 text-xs">{a.durationMin} dk · {formatAgo(a.startedAt)}</Text>
              </View>
            </View>
            <Text className="text-brand-700 font-bold">+{a.points}</Text>
          </View>
        ))
      )}

      <Text className="text-ink-700 font-semibold mt-4 mb-2">Redeem geçmişi</Text>
      {redemptions.length === 0 ? (
        <Text className="text-ink-500">Henüz redeem yok.</Text>
      ) : (
        redemptions.map((r) => {
          const reward = REWARDS.find((x) => x.rid === r.rid);
          const statusLabel = r.status === "active" ? "🟢 Aktif" : r.status === "used" ? "✓ Kullanıldı" : "⏳ Süresi doldu";
          return (
            <View key={r.rdid} className="bg-white border border-ink-300 rounded-xl p-3 mb-2">
              <Text className="text-ink-900 font-semibold">{reward?.title ?? r.rid}</Text>
              <Text className="text-ink-500 text-xs">{statusLabel} · {formatAgo(r.createdAt)}</Text>
            </View>
          );
        })
      )}

      <Text className="text-ink-700 font-semibold mt-4 mb-2">{tr.profile.settings}</Text>
      <View className="bg-white border border-ink-300 rounded-xl p-3">
        <View className="flex-row items-center justify-between py-2">
          <Text className="text-ink-900">{tr.profile.demoMode}</Text>
          <Switch value={demoMode} onValueChange={toggleDemoMode} />
        </View>
        <Pressable onPress={onPushTest} className="py-2">
          <Text className="text-brand-700 font-semibold">🔔 {tr.profile.triggerPush}</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/feed")} className="py-2"><Text className="text-brand-700">📰 Sosyal Feed</Text></Pressable>
        <Pressable onPress={() => router.push("/business")} className="py-2"><Text className="text-brand-700">🏪 Yerel İşletme Paneli</Text></Pressable>
        <Pressable onPress={() => { reset(); router.replace("/(onboarding)/welcome"); }} className="py-2"><Text className="text-red-500">↩︎ {tr.profile.signOut}</Text></Pressable>
      </View>
    </Screen>
  );
}
