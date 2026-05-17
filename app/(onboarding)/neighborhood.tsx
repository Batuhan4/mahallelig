import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { NEIGHBORHOODS } from "@/constants/seed/neighborhoods";
import { findNearestNeighborhood } from "@/services/league";
import { getCurrentLocation } from "@/services/location";
import { tr } from "@/constants/i18n";
import { palette } from "@/constants/theme";

type Mode = "loading" | "auto" | "manual" | "denied";

export default function PickNeighborhood() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [mode, setMode] = useState<Mode>("loading");
  const [auto, setAuto] = useState<{ nid: string; name: string; district: string; distanceKm: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loc = await getCurrentLocation();
      if (cancelled) return;
      if (!loc) {
        setMode("denied");
        return;
      }
      const nearest = findNearestNeighborhood(loc.lat, loc.lon);
      if (!nearest) {
        setMode("manual");
        return;
      }
      setAuto({
        nid: nearest.neighborhood.nid,
        name: nearest.neighborhood.name,
        district: nearest.neighborhood.district,
        distanceKm: nearest.distanceKm
      });
      setMode("auto");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function continueWithAuto() {
    if (!auto) return;
    router.push({ pathname: "/(onboarding)/permissions", params: { name, nid: auto.nid } });
  }

  function continueWithManual() {
    if (!selected) return;
    router.push({ pathname: "/(onboarding)/permissions", params: { name, nid: selected } });
  }

  if (mode === "loading") {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
            <Text
              className="text-steel-500"
              style={{ fontFamily: "System", fontWeight: "600", fontSize: 10, letterSpacing: 1.6 }}
            >
              KAYIT · 2 / 3
            </Text>
          </View>
          <ActivityIndicator color={palette.terra500} />
          <Text
            className="text-steel-500 mt-3"
            style={{ fontFamily: "System", fontWeight: "500", fontSize: 13 }}
          >
            Konum alınıyor…
          </Text>
          <Text
            className="text-steel-400 mt-1"
            style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 10, letterSpacing: 0.6 }}
          >
            EN YAKIN MAHALLE BULUNUYOR
          </Text>
        </View>
      </Screen>
    );
  }

  if (mode === "auto" && auto) {
    return (
      <Screen>
        <View className="pt-6 pb-3">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
            <Text
              className="text-steel-500"
              style={{ fontFamily: "System", fontWeight: "600", fontSize: 10, letterSpacing: 1.6 }}
            >
              KAYIT · 2 / 3
            </Text>
          </View>
          <Text
            className="text-navy-900"
            style={{ fontFamily: "System", fontWeight: "700", fontSize: 30, letterSpacing: -1.2, lineHeight: 32 }}
          >
            Mahalleni bulduk
          </Text>
          <Text
            className="text-steel-500 mt-1.5"
            style={{ fontFamily: "System", fontWeight: "500", fontSize: 13, lineHeight: 19 }}
          >
            Konum izninle en yakın mahalleyi tespit ettik.
          </Text>
          <View className="h-px bg-navy-900/15 mt-4" />
        </View>

        {/* Auto-detect hero card */}
        <View className="bg-ivory-50 border border-navy-900/10 rounded-3xl overflow-hidden mt-2">
          <View className="h-1 flex-row">
            <View className="flex-1 bg-navy-900" />
            <View className="w-8 bg-terra-500" />
          </View>
          <View className="px-5 py-6">
            <View className="flex-row items-center gap-2">
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: palette.terra500,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: palette.ivory50
                  }}
                />
              </View>
              <Text
                className="text-terra-700"
                style={{ fontFamily: "System", fontWeight: "600", fontSize: 10, letterSpacing: 1.8 }}
              >
                OTOMATİK TESPİT
              </Text>
            </View>
            <Text
              className="text-navy-900 mt-3"
              style={{ fontFamily: "System", fontWeight: "700", fontSize: 38, letterSpacing: -1.4, lineHeight: 40 }}
            >
              {auto.name}
            </Text>
            <Text
              className="text-steel-500 mt-1"
              style={{ fontFamily: "System", fontWeight: "500", fontSize: 12, letterSpacing: 0.6 }}
            >
              {auto.district.toUpperCase()} · İSTANBUL
            </Text>

            <View className="flex-row items-center mt-4 gap-3">
              <View className="px-2 py-1 bg-navy-900/5 rounded-md">
                <Text
                  className="text-steel-700"
                  style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 11, letterSpacing: -0.2 }}
                >
                  {auto.distanceKm < 0.5 ? "BURADASIN" : `~${auto.distanceKm.toFixed(1)} KM`}
                </Text>
              </View>
              <View className="px-2 py-1 border border-navy-900/15 rounded-md">
                <Text
                  className="text-steel-500"
                  style={{ fontFamily: "Menlo", fontWeight: "500", fontSize: 10, letterSpacing: 1 }}
                >
                  GPS · ±{auto.distanceKm < 0.1 ? "50M" : "200M"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-6">
          <Button label={`${tr.onboarding.continue}`} variant="primary" onPress={continueWithAuto} />
        </View>

        <Pressable onPress={() => setMode("manual")} className="mt-3 py-3">
          <Text
            className="text-steel-500 text-center"
            style={{ fontFamily: "System", fontWeight: "500", fontSize: 13 }}
          >
            Bu değil —{" "}
            <Text
              style={{
                fontFamily: "System",
                fontWeight: "600",
                color: palette.navy900,
                textDecorationLine: "underline"
              }}
            >
              listeden seç
            </Text>
          </Text>
        </Pressable>
      </Screen>
    );
  }

  // mode === "manual" || "denied"
  return (
    <Screen scroll={false}>
      <View className="pt-6 pb-3">
        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
          <Text
            className="text-steel-500"
            style={{ fontFamily: "System", fontWeight: "600", fontSize: 10, letterSpacing: 1.6 }}
          >
            KAYIT · 2 / 3
          </Text>
        </View>
        <Text
          className="text-navy-900"
          style={{ fontFamily: "System", fontWeight: "700", fontSize: 30, letterSpacing: -1.2, lineHeight: 32 }}
        >
          {tr.onboarding.pickNeighborhood}
        </Text>
        <Text
          className="text-steel-500 mt-1.5"
          style={{ fontFamily: "System", fontWeight: "500", fontSize: 12 }}
        >
          {mode === "denied"
            ? "Konum izni verilmedi — manuel seç"
            : `${NEIGHBORHOODS.length} mahalle · İstanbul`}
        </Text>
        <View className="h-px bg-navy-900/15 mt-4" />
      </View>

      <FlatList
        data={NEIGHBORHOODS}
        keyExtractor={(n) => n.nid}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item, index }) => {
          const isSelected = selected === item.nid;
          return (
            <Pressable
              onPress={() => setSelected(item.nid)}
              className={`flex-row items-center px-3 py-3 rounded-2xl mb-1.5 border ${
                isSelected ? "bg-navy-900 border-navy-900" : "bg-transparent border-navy-900/8"
              }`}
            >
              <Text
                style={{
                  fontFamily: "Menlo",
                  fontWeight: "500",
                  fontSize: 11,
                  letterSpacing: -0.2,
                  color: isSelected ? palette.terra400 : palette.steel400,
                  width: 28
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </Text>
              <View className="flex-1">
                <Text
                  style={{
                    fontFamily: "System",
                    fontWeight: "700",
                    fontSize: 15,
                    letterSpacing: -0.3,
                    color: isSelected ? palette.ivory50 : palette.navy900
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "System",
                    fontWeight: "500",
                    fontSize: 10,
                    letterSpacing: 0.6,
                    color: isSelected ? "rgba(245, 240, 230, 0.6)" : palette.steel500,
                    marginTop: 1
                  }}
                >
                  {item.district.toUpperCase()} · {item.city.toUpperCase()}
                </Text>
              </View>
              {isSelected && <View className="w-2 h-2 rounded-full bg-terra-500" />}
            </Pressable>
          );
        }}
      />

      <View className="pt-2 pb-3">
        <Button
          label={tr.onboarding.continue}
          variant={selected ? "primary" : "ghost"}
          onPress={selected ? continueWithManual : undefined}
        />
        {auto && (
          <Pressable onPress={() => setMode("auto")} className="mt-2 py-2">
            <Text
              className="text-steel-500 text-center"
              style={{ fontFamily: "System", fontWeight: "500", fontSize: 12 }}
            >
              ← otomatik tespite dön ({auto.name})
            </Text>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}
