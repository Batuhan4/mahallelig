import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { REWARDS } from "@/constants/seed/rewards";
import { tr } from "@/constants/i18n";
import { useUserStore } from "@/store/useUserStore";
import { useRedemptionStore } from "@/store/useRedemptionStore";
import { buildQrPayload, encodeQr, REDEMPTION_TTL_MIN } from "@/services/qr";
import { backend } from "@/services/backend";
import { partnerColors, palette } from "@/constants/theme";
import { useEffect, useState } from "react";

export default function RewardDetail() {
  const { rid } = useLocalSearchParams<{ rid: string }>();
  const reward = REWARDS.find((r) => r.rid === rid);
  const user = useUserStore((s) => s.user);
  const addPoints = useUserStore((s) => s.addPoints);
  const addRedemption = useRedemptionStore((s) => s.add);
  const markUsed = useRedemptionStore((s) => s.markUsed);
  const [redemption, setRedemption] = useState<null | {
    rdid: string;
    qr: string;
    expiresAt: number;
    status: "active" | "used";
  }>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!redemption || redemption.status !== "active") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [redemption]);

  if (!reward) {
    return (
      <Screen>
        <View className="py-10 items-center">
          <Text
            className="text-navy-900"
            style={{ fontFamily: "Fraunces_700Bold", fontSize: 18 }}
          >
            Bu ödül bulunamadı.
          </Text>
        </View>
      </Screen>
    );
  }

  const enough = (user?.totalPoints ?? 0) >= reward.cost;
  const accent = partnerColors[reward.partner] ?? palette.navy900;

  async function confirm() {
    if (!user || !reward || !enough) return;
    const rdid = "rd-" + Math.random().toString(36).slice(2, 10);
    const payload = buildQrPayload({ uid: user.uid, rid: reward.rid, rdid });
    const qr = encodeQr(payload);
    addPoints(-reward.cost);
    addRedemption({
      rdid,
      uid: user.uid,
      rid: reward.rid,
      qrPayload: qr,
      status: "active",
      createdAt: Date.now(),
      expiresAt: payload.expiresAt
    });
    await backend.recordRedemption({
      rdid,
      uid: user.uid,
      rid: reward.rid,
      qrPayload: qr,
      status: "active",
      createdAt: Date.now(),
      expiresAt: payload.expiresAt
    });
    setRedemption({ rdid, qr, expiresAt: payload.expiresAt, status: "active" });
  }

  function simulateScan() {
    if (!redemption) return;
    markUsed(redemption.rdid);
    setRedemption({ ...redemption, status: "used" });
  }

  const ttlSeconds = redemption ? Math.max(0, Math.floor((redemption.expiresAt - now) / 1000)) : 0;
  const ttlMin = Math.floor(ttlSeconds / 60);
  const ttlSec = ttlSeconds % 60;

  return (
    <Screen>
      {/* Hero */}
      <View className="rounded-3xl overflow-hidden mb-4 border border-navy-900/10">
        <View className="h-44" style={{ backgroundColor: accent }}>
          <View className="absolute inset-0">
            <View className="absolute top-3 left-4">
              <Text
                className="text-ivory-100/70"
                style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1.6 }}
              >
                {tr.market.categories[reward.partner].toUpperCase()}
              </Text>
            </View>
            <View className="absolute bottom-0 left-0 right-0 flex-row">
              <View className="flex-1" />
              <View className="w-10 bg-ivory-100/15" />
              <View className="w-3 bg-terra-500/80" />
            </View>
          </View>
        </View>
        <View className="bg-ivory-50 px-5 py-5">
          <View className="flex-row items-start justify-between gap-3">
            <Text
              className="text-navy-900 flex-1"
              style={{ fontFamily: "Fraunces_700Bold", fontSize: 26, letterSpacing: -1, lineHeight: 28 }}
            >
              {reward.title}
            </Text>
            <View className="items-end">
              <Text
                className="text-navy-900"
                style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 22, letterSpacing: -0.6 }}
              >
                {reward.cost.toLocaleString("tr-TR")}
              </Text>
              <Text
                className="text-steel-500"
                style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.4 }}
              >
                PUAN
              </Text>
            </View>
          </View>
          <Text
            className="text-steel-500 mt-2"
            style={{ fontFamily: "Inter_500Medium", fontSize: 13, lineHeight: 18 }}
          >
            {reward.description}
          </Text>

          <View className="h-px bg-navy-900/10 my-4" />

          <View className="flex-row items-center gap-2">
            <Badge label="KOŞULLAR" tone="ghost" />
            <View className="w-1 h-1 rounded-full bg-steel-400" />
            <Text
              className="text-steel-500 flex-1"
              style={{ fontFamily: "Inter_500Medium", fontSize: 12, lineHeight: 17 }}
            >
              {reward.termsTr}
            </Text>
          </View>
        </View>
      </View>

      {/* Redeem state */}
      {redemption ? (
        <View className="bg-ivory-50 border border-navy-900/10 rounded-3xl overflow-hidden">
          <View className="h-1 flex-row">
            <View className="flex-1 bg-terra-500" />
            <View className="w-6 bg-navy-900" />
          </View>
          {redemption.status === "active" ? (
            <View className="px-5 py-5 items-center">
              <View className="flex-row items-center gap-1.5 mb-1">
                <View className="w-1 h-1 rounded-full bg-terra-500" />
                <Text
                  className="text-terra-700"
                  style={{ fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.6 }}
                >
                  AKTİF KOD
                </Text>
              </View>
              <Text
                className="text-navy-900"
                style={{ fontFamily: "Fraunces_700Bold", fontSize: 18, letterSpacing: -0.4 }}
              >
                {tr.reward.qrTitle}
              </Text>

              <View
                className="bg-ivory-100 rounded-2xl p-4 mt-4"
                style={{ borderWidth: 1, borderColor: "rgba(12, 35, 64, 0.12)" }}
              >
                <QRCode value={redemption.qr} size={220} color={palette.navy900} backgroundColor={palette.ivory100} />
              </View>

              <View className="flex-row items-center gap-2 mt-4">
                <Text
                  className="text-steel-500"
                  style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1.4 }}
                >
                  GEÇERLİ
                </Text>
                <Text
                  className="text-navy-900"
                  style={{ fontFamily: "IBMPlexMono_700Bold", fontSize: 22, letterSpacing: -0.6 }}
                >
                  {String(ttlMin).padStart(2, "0")}:{String(ttlSec).padStart(2, "0")}
                </Text>
                <Text
                  className="text-steel-500"
                  style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1.4 }}
                >
                  / {REDEMPTION_TTL_MIN} DK
                </Text>
              </View>

              <View className="w-full mt-5">
                <Button label="Demo · Kasiyer kodu okuttu" variant="secondary" onPress={simulateScan} small />
              </View>
            </View>
          ) : (
            <View className="px-5 py-8 items-center">
              <View
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: palette.field500 }}
              >
                <Text className="text-ivory-50" style={{ fontFamily: "Fraunces_700Bold", fontSize: 44 }}>✓</Text>
              </View>
              <Text
                className="text-navy-900 mt-4"
                style={{ fontFamily: "Fraunces_700Bold", fontSize: 26, letterSpacing: -1 }}
              >
                {tr.reward.used}
              </Text>
              <Text
                className="text-steel-500 mt-1"
                style={{ fontFamily: "Inter_500Medium", fontSize: 12 }}
              >
                {reward.title}
              </Text>
              <View className="mt-4 px-3 py-1.5 rounded-sm border border-field-500/40">
                <Text
                  className="text-field-500"
                  style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1.6 }}
                >
                  KASİYER DOĞRULADI
                </Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View>
          <Button
            label={enough ? tr.reward.confirm : `Yetersiz · ${(reward.cost - (user?.totalPoints ?? 0)).toLocaleString("tr-TR")} P daha`}
            variant={enough ? "primary" : "ghost"}
            onPress={enough ? confirm : undefined}
          />
          <Text
            className="text-steel-400 text-center mt-3"
            style={{ fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 0.4 }}
          >
            Onayla → QR ode, kasiyere göster, kullan.
          </Text>
        </View>
      )}
    </Screen>
  );
}
