import { Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { KpiCard } from "@/components/KpiCard";
import { tr } from "@/constants/i18n";

export default function Business() {
  return (
    <Screen>
      <Text className="text-2xl font-bold text-ink-900 dark:text-white py-4">{tr.business.title}</Text>
      <View className="flex-row flex-wrap">
        <KpiCard label="Bu hafta müşteri" value="23" sub="+9 yeni" />
        <KpiCard label="Toplam redeem" value="118" sub="son 30 gün" />
      </View>
      <View className="flex-row flex-wrap">
        <KpiCard label="Ortalama puan" value="9.400" />
        <KpiCard label="Aktif kupon" value="14" />
      </View>
      <Text className="text-ink-700 font-semibold mt-3 mb-2">{tr.business.topReward}</Text>
      <View className="bg-white border border-ink-300 rounded-2xl p-3">
        <Text className="text-ink-900 font-semibold">Mehmet Usta · Filtre kahve</Text>
        <Text className="text-ink-500 text-xs">42 kez tercih edildi</Text>
      </View>
    </Screen>
  );
}
