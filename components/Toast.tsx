import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { setInAppToastListener } from "@/services/notifications";

type Msg = { id: number; title: string; body: string };

export function ToastHost() {
  const [items, setItems] = useState<Msg[]>([]);

  useEffect(() => {
    setInAppToastListener((t) => {
      const id = Date.now() + Math.random();
      setItems((xs) => [...xs, { id, title: t.title, body: t.body }]);
      setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 4500);
    });
    return () => setInAppToastListener(null);
  }, []);

  if (items.length === 0) return null;
  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", top: 56, left: 0, right: 0, alignItems: "center", zIndex: 9999 }}
    >
      {items.map((m) => (
        <View
          key={m.id}
          className="bg-ivory-50 border border-navy-900/15 rounded-2xl mb-2 overflow-hidden"
          style={{
            maxWidth: 380,
            width: "92%",
            shadowColor: "#0C2340",
            shadowOpacity: 0.18,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 8 },
            elevation: 6
          }}
        >
          <View className="flex-row">
            <View className="w-1 bg-terra-500" />
            <View className="flex-1 px-4 py-3">
              <View className="flex-row items-center gap-1.5 mb-0.5">
                <View className="w-1 h-1 rounded-full bg-navy-900" />
                <Text
                  className="text-navy-900 text-[10px] tracking-widest"
                  style={{ fontFamily: "System", fontWeight: "600" }}
                >
                  BİLDİRİM
                </Text>
              </View>
              <Text
                className="text-navy-900"
                style={{ fontFamily: "System", fontWeight: "700", fontSize: 15, letterSpacing: -0.3 }}
              >
                {m.title}
              </Text>
              <Text
                className="text-steel-500 mt-0.5"
                style={{ fontFamily: "System", fontWeight: "500", fontSize: 12, lineHeight: 16 }}
              >
                {m.body}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
