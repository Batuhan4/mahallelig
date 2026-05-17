import { Text, View } from "react-native";
import { Screen, LargeTitle, SectionTitle } from "@/components/Screen";
import { KpiCard } from "@/components/KpiCard";
import { tr } from "@/constants/i18n";

export default function Business() {
  return (
    <Screen>
      <LargeTitle eyebrow="İşletme paneli" title={tr.business.title} subtitle="Mehmet Usta · Kadıköy" />

      <View className="flex-row flex-wrap -mx-1">
        <KpiCard label="Bu hafta müşteri" value="23" sub="+9 yeni" />
        <KpiCard label="Toplam redeem" value="118" sub="son 30 gün" />
      </View>
      <View className="flex-row flex-wrap -mx-1">
        <KpiCard label="Ortalama puan" value="9.400" />
        <KpiCard label="Aktif kupon" value="14" tone="accent" />
      </View>

      <SectionTitle sub="EN ÇOK TERCİH">{tr.business.topReward}</SectionTitle>
      <View className="bg-ivory-50 border border-navy-900/10 rounded-2xl overflow-hidden">
        <View className="h-1 bg-terra-500" />
        <View className="px-4 py-4">
          <Text
            className="text-navy-900"
            style={{ fontFamily: "Fraunces_700Bold", fontSize: 18, letterSpacing: -0.4 }}
          >
            Mehmet Usta · Filtre kahve
          </Text>
          <Text
            className="text-steel-500 mt-1"
            style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 11, letterSpacing: 0.4 }}
          >
            42 KEZ TERCİH EDİLDİ
          </Text>
        </View>
      </View>
    </Screen>
  );
}
