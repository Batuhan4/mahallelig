import { Image, Pressable, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { Screen, LargeTitle, SectionTitle, Hairline } from "@/components/Screen";
import { Button } from "@/components/Button";
import { tr } from "@/constants/i18n";
import { useUserStore, levelOfUser } from "@/store/useUserStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useRedemptionStore } from "@/store/useRedemptionStore";
import { useActivityStore } from "@/store/useActivityStore";
import { findNeighborhood } from "@/services/league";
import { fireLocal, requestNotificationPermission } from "@/services/notifications";
import { REWARDS } from "@/constants/seed/rewards";
import { palette } from "@/constants/theme";

const BADGES = ["Mahalle Şampiyonu", "İlk Yürüyüş", "5km Klübü", "Sabah Kuşu", "Bisiklet Dostu"];
const ACTIVITY_ICON: Record<string, string> = {
  walk: "🚶",
  bike: "🚴",
  stairs: "🪜",
  run: "🏃" // legacy records before merge
};

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
  const avatarUri = `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(avatarSeed)}&size=200&radius=50&backgroundColor=F5F0E6,ECE3D3,DDD2BD`;
  const lvl = levelOfUser(user);

  function onPushTest() {
    void requestNotificationPermission();
    fireLocal({ title: tr.push.overtakeTitle, body: tr.push.overtakeBody });
  }

  return (
    <Screen>
      <LargeTitle eyebrow="Profil" title={user?.name ?? "Misafir"} />

      {/* Hero card */}
      <View className="bg-ivory-50 border border-navy-900/10 rounded-3xl overflow-hidden mb-4">
        <View className="h-1 flex-row">
          <View className="flex-1 bg-navy-900" />
          <View className="w-6 bg-terra-500" />
          <View className="w-2 bg-bronze-500" />
        </View>
        <View className="px-5 py-5 items-center">
          <View
            className="rounded-full overflow-hidden"
            style={{
              padding: 3,
              backgroundColor: "white",
              borderWidth: 2,
              borderColor: palette.navy900
            }}
          >
            <Image
              source={{ uri: avatarUri }}
              style={{ width: 96, height: 96, borderRadius: 48 }}
              accessibilityLabel="Avatar"
            />
          </View>
          <View
            className="absolute"
            style={{ top: 28, right: 36, width: 12, height: 12, borderRadius: 6, backgroundColor: palette.terra500, borderWidth: 2, borderColor: palette.ivory50 }}
          />
          <Text
            className="text-navy-900 mt-3"
            style={{ fontFamily: "Fraunces_700Bold", fontSize: 24, letterSpacing: -0.6 }}
          >
            {user?.name ?? "Misafir"}
          </Text>
          <Text
            className="text-steel-500"
            style={{ fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 0.6, marginTop: 2 }}
          >
            {(nhood?.name ?? "—").toUpperCase()} · {(nhood?.district ?? "").toUpperCase()}
          </Text>

          <Hairline className="my-4 w-full" />

          <View className="flex-row w-full">
            <View className="flex-1 items-center">
              <Text
                className="text-navy-900"
                style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 20, letterSpacing: -0.6 }}
              >
                {(user?.totalPoints ?? 0).toLocaleString("tr-TR")}
              </Text>
              <Text
                className="text-steel-500 mt-0.5"
                style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.4 }}
              >
                TOPLAM P
              </Text>
            </View>
            <View className="w-px bg-navy-900/10" />
            <View className="flex-1 items-center">
              <Text
                className="text-navy-900"
                style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 20, letterSpacing: -0.6 }}
              >
                Lv {String(lvl).padStart(2, "0")}
              </Text>
              <Text
                className="text-steel-500 mt-0.5"
                style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.4 }}
              >
                SEVİYE
              </Text>
            </View>
            <View className="w-px bg-navy-900/10" />
            <View className="flex-1 items-center">
              <Text
                className="text-navy-900"
                style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 20, letterSpacing: -0.6 }}
              >
                {history.length}
              </Text>
              <Text
                className="text-steel-500 mt-0.5"
                style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.4 }}
              >
                AKTİVİTE
              </Text>
            </View>
          </View>
        </View>
      </View>

      <SectionTitle sub={`${BADGES.length} ROZET`}>{tr.profile.badges}</SectionTitle>
      <View className="flex-row flex-wrap gap-2">
        {BADGES.map((b) => (
          <View
            key={b}
            className="bg-ivory-50 border border-navy-900/15 rounded-full px-3 py-1.5 flex-row items-center gap-1.5"
          >
            <View className="w-1.5 h-1.5 rounded-full bg-bronze-500" />
            <Text
              className="text-navy-900"
              style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 0.2 }}
            >
              {b}
            </Text>
          </View>
        ))}
      </View>

      <SectionTitle sub={`${history.length} KAYIT`}>Aktivite geçmişi</SectionTitle>
      {history.length === 0 ? (
        <View className="bg-ivory-50 border border-dashed border-navy-900/15 rounded-2xl px-4 py-5">
          <Text
            className="text-steel-500"
            style={{ fontFamily: "Inter_500Medium", fontSize: 12, textAlign: "center" }}
          >
            Henüz aktivite kaydı yok. Bugün ekranından bir aktivite başlat.
          </Text>
        </View>
      ) : (
        <View className="bg-ivory-50 border border-navy-900/10 rounded-2xl px-4 py-2">
          {history.slice(0, 6).map((a, i, arr) => {
            const headline =
              a.type === "bike"
                ? `${a.distanceKm.toFixed(2)} km`
                : a.type === "stairs"
                  ? `${Math.round((a.altitudeM ?? 0) / 3)} kat · ${a.steps.toLocaleString("tr-TR")} adım`
                  : `${a.distanceKm.toFixed(2)} km · ${a.steps.toLocaleString("tr-TR")} adım`;
            return (
            <View
              key={a.aid}
              className={`flex-row items-center py-3 ${i < arr.length - 1 ? "border-b border-navy-900/8" : ""}`}
            >
              <Text className="text-xl mr-3">{ACTIVITY_ICON[a.type] ?? "🟢"}</Text>
              <View className="flex-1">
                <Text
                  className="text-navy-900"
                  style={{ fontFamily: "Fraunces_700Bold", fontSize: 14, letterSpacing: -0.2 }}
                >
                  {headline}
                </Text>
                <Text
                  className="text-steel-500"
                  style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 10, letterSpacing: 0.4, marginTop: 1 }}
                >
                  {a.durationMin} DK · {formatAgo(a.startedAt).toUpperCase()}
                </Text>
              </View>
              <Text
                className="text-terra-500"
                style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 14 }}
              >
                +{a.points}
              </Text>
            </View>
            );
          })}
        </View>
      )}

      <SectionTitle sub={`${redemptions.length} REDEEM`}>Redeem geçmişi</SectionTitle>
      {redemptions.length === 0 ? (
        <View className="bg-ivory-50 border border-dashed border-navy-900/15 rounded-2xl px-4 py-5">
          <Text
            className="text-steel-500"
            style={{ fontFamily: "Inter_500Medium", fontSize: 12, textAlign: "center" }}
          >
            Henüz redeem yok.
          </Text>
        </View>
      ) : (
        <View className="bg-ivory-50 border border-navy-900/10 rounded-2xl px-4 py-2">
          {redemptions.map((r, i, arr) => {
            const reward = REWARDS.find((x) => x.rid === r.rid);
            const tone =
              r.status === "active" ? { color: "field", label: "AKTİF" } :
              r.status === "used" ? { color: "navy", label: "KULLANILDI" } :
              { color: "steel", label: "SÜRESİ DOLDU" };
            return (
              <View
                key={r.rdid}
                className={`py-3 ${i < arr.length - 1 ? "border-b border-navy-900/8" : ""}`}
              >
                <View className="flex-row items-baseline justify-between">
                  <Text
                    className="text-navy-900 flex-1 pr-2"
                    style={{ fontFamily: "Fraunces_700Bold", fontSize: 14, letterSpacing: -0.2 }}
                  >
                    {reward?.title ?? r.rid}
                  </Text>
                  <View className={`flex-row items-center gap-1`}>
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor:
                          tone.color === "field" ? palette.field500 :
                          tone.color === "navy" ? palette.navy900 : palette.steel400
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 9,
                        letterSpacing: 1.2,
                        color:
                          tone.color === "field" ? palette.field500 :
                          tone.color === "navy" ? palette.navy900 : palette.steel400
                      }}
                    >
                      {tone.label}
                    </Text>
                  </View>
                </View>
                <Text
                  className="text-steel-500"
                  style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 10, marginTop: 2 }}
                >
                  {formatAgo(r.createdAt).toUpperCase()}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <SectionTitle>{tr.profile.settings}</SectionTitle>
      <View className="bg-ivory-50 border border-navy-900/10 rounded-2xl">
        <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-navy-900/8">
          <View>
            <Text
              className="text-navy-900"
              style={{ fontFamily: "Fraunces_700Bold", fontSize: 14, letterSpacing: -0.2 }}
            >
              {tr.profile.demoMode}
            </Text>
            <Text
              className="text-steel-500"
              style={{ fontFamily: "Inter_500Medium", fontSize: 11 }}
            >
              Sahte pedometre akışı
            </Text>
          </View>
          <Switch
            value={demoMode}
            onValueChange={toggleDemoMode}
            trackColor={{ false: palette.ivory300, true: palette.terra500 }}
            thumbColor={palette.ivory50}
          />
        </View>
        <Pressable onPress={onPushTest} className="px-4 py-3.5 border-b border-navy-900/8 flex-row items-center justify-between">
          <Text
            className="text-navy-900"
            style={{ fontFamily: "Fraunces_700Bold", fontSize: 14, letterSpacing: -0.2 }}
          >
            🔔  {tr.profile.triggerPush}
          </Text>
          <Text className="text-terra-500" style={{ fontFamily: "Inter_600SemiBold", fontSize: 11 }}>
            GÖNDER →
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push("/feed")} className="px-4 py-3.5 border-b border-navy-900/8 flex-row items-center justify-between">
          <Text
            className="text-navy-900"
            style={{ fontFamily: "Fraunces_700Bold", fontSize: 14, letterSpacing: -0.2 }}
          >
            📰  Sosyal Feed
          </Text>
          <Text className="text-steel-400" style={{ fontFamily: "Inter_600SemiBold", fontSize: 11 }}>
            AÇ →
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push("/business")} className="px-4 py-3.5 flex-row items-center justify-between">
          <Text
            className="text-navy-900"
            style={{ fontFamily: "Fraunces_700Bold", fontSize: 14, letterSpacing: -0.2 }}
          >
            🏪  Yerel İşletme Paneli
          </Text>
          <Text className="text-steel-400" style={{ fontFamily: "Inter_600SemiBold", fontSize: 11 }}>
            AÇ →
          </Text>
        </Pressable>
      </View>

      <View className="mt-4">
        <Button
          label={tr.profile.signOut}
          variant="danger"
          onPress={() => {
            reset();
            router.replace("/(onboarding)/welcome");
          }}
        />
      </View>
    </Screen>
  );
}
