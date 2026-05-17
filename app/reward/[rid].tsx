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
import { useMemo, useState } from "react";

export default function RewardDetail() {
  const { rid } = useLocalSearchParams<{ rid: string }>();
  const reward = REWARDS.find((r) => r.rid === rid);
  const user = useUserStore((s) => s.user);
  const addPoints = useUserStore((s) => s.addPoints);
  const addRedemption = useRedemptionStore((s) => s.add);
  const [redeemed, setRedeemed] = useState<null | { qr: string; expiresAt: number }>(null);

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
    setRedeemed({ qr, expiresAt: payload.expiresAt });
  }

  return (
    <Screen>
      <View className="py-6 gap-3">
        <Text className="text-3xl font-bold text-ink-900 dark:text-white">{reward.title}</Text>
        <Text className="text-ink-500">{reward.description}</Text>
        <Text className="text-ink-700">{reward.termsTr}</Text>
        <Text className="text-ink-900 text-2xl font-bold mt-2">{reward.cost.toLocaleString("tr-TR")} P</Text>
        {redeemed ? (
          <View className="items-center mt-6 gap-3">
            <Text className="text-ink-900 dark:text-white font-semibold">{tr.reward.qrTitle}</Text>
            <View className="bg-white p-4 rounded-2xl">
              <QRCode value={redeemed.qr} size={220} />
            </View>
            <Text className="text-ink-500 text-sm">{tr.reward.qrSubtitle(REDEMPTION_TTL_MIN)}</Text>
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
