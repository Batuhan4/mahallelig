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
      style={{ position: "absolute", top: 50, left: 0, right: 0, alignItems: "center", zIndex: 9999 }}
    >
      {items.map((m) => (
        <View
          key={m.id}
          className="bg-ink-900 rounded-2xl px-4 py-3 mb-2 shadow-lg"
          style={{ maxWidth: 360, width: "92%" }}
        >
          <Text className="text-white font-semibold text-sm">🔔 {m.title}</Text>
          <Text className="text-white/80 text-xs mt-0.5">{m.body}</Text>
        </View>
      ))}
    </View>
  );
}
