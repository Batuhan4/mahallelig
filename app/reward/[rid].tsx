import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { Screen } from "@/components/Screen";
import { REWARDS } from "@/constants/seed/rewards";
import { tr } from "@/constants/i18n";
import { useUserStore } from "@/store/useUserStore";
import { useRedemptionStore } from "@/store/useRedemptionStore";
import { buildQrPayload, encodeQr, REDEMPTION_TTL_MIN } from "@/services/qr";
import { backend } from "@/services/backend";
import { useState } from "react";

export default function RewardDetail() {
  const { rid } = useLocalSearchParams<{ rid: string }>();
  const reward = REWARDS.find((r) => r.rid === rid);
  const user = useUserStore((s) => s.user);
  const addPoints = useUserStore((s) => s.addPoints);
  const addRedemption = useRedemptionStore((s) => s.add);
  const markUsed = useRedemptionStore((s) => s.markUsed);
  const [redemption, setRedemption] = useState<null | { rdid: string; qr: string; expiresAt: number; status: "active" | "used" }>(null);

  if (!reward) return <Screen><Text className="text-ink-900 dark:text-white">Bulunamadı</Text></Screen>;

  const enough = (user?.totalPoints ?? 0) >= reward.cost;

  async function confirm() {
    if (!user || !reward || !enough) return;
    const rdid = "rd-" + Math.random().toString(36).slice(2, 10);
    const payload = buildQrPayload({ uid: user.uid, rid: reward.rid, rdid });
    const qr = encodeQr(payload);
    addPoints(-reward.cost);
    addRedemption({ rdid, uid: user.uid, rid: reward.rid, qrPayload: qr, status: "active", createdAt: Date.now(), expiresAt: payload.expiresAt });
    await backend.recordRedemption({ rdid, uid: user.uid, rid: reward.rid, qrPayload: qr, status: "active", createdAt: Date.now(), expiresAt: payload.expiresAt });
    setRedemption({ rdid, qr, expiresAt: payload.expiresAt, status: "active" });
  }

  function simulateScan() {
    if (!redemption) return;
    markUsed(redemption.rdid);
    setRedemption({ ...redemption, status: "used" });
  }

  return (
    <Screen>
      <View className="py-6 gap-3">
        <Text className="text-3xl font-bold text-ink-900 dark:text-white">{reward.title}</Text>
        <Text className="text-ink-500">{reward.description}</Text>
        <Text className="text-ink-700">{reward.termsTr}</Text>
        <Text className="text-ink-900 text-2xl font-bold mt-2">{reward.cost.toLocaleString("tr-TR")} P</Text>
        {redemption ? (
          <View className="items-center mt-6 gap-3">
            {redemption.status === "active" ? (
              <>
                <Text className="text-ink-900 dark:text-white font-semibold">{tr.reward.qrTitle}</Text>
                <View className="bg-white p-4 rounded-2xl">
                  <QRCode value={redemption.qr} size={220} />
                </View>
                <Text className="text-ink-500 text-sm">{tr.reward.qrSubtitle(REDEMPTION_TTL_MIN)}</Text>
                <Pressable onPress={simulateScan} className="rounded-xl bg-ink-900 mt-2 px-4 py-2">
                  <Text className="text-white text-xs">Demo · Kasiyer kodu okuttu</Text>
                </Pressable>
              </>
            ) : (
              <View className="items-center gap-3 mt-2">
                <View className="w-24 h-24 rounded-full bg-accent-500 items-center justify-center">
                  <Text className="text-white text-5xl">✓</Text>
                </View>
                <Text className="text-ink-900 dark:text-white text-2xl font-bold">{tr.reward.used}</Text>
                <Text className="text-ink-500 text-sm">{reward.title}</Text>
              </View>
            )}
          </View>
        ) : (
          <Pressable
            disabled={!enough}
            onPress={confirm}
            className={`rounded-xl py-4 mt-3 ${enough ? "bg-brand-500" : "bg-ink-300"}`}
          >
            <Text className="text-center text-white font-semibold">{tr.reward.confirm}</Text>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}
