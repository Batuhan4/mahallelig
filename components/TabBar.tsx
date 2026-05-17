import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

type IconKey = "today" | "league" | "market" | "muni" | "profile";

const ROUTE_TO_ICON: Record<string, IconKey> = {
  index: "today",
  league: "league",
  market: "market",
  municipality: "muni",
  profile: "profile"
};

const LABELS: Record<IconKey, string> = {
  today: "Bugün",
  league: "Lig",
  market: "Market",
  muni: "Belediye",
  profile: "Profil"
};

function TabIcon({ kind, active }: { kind: IconKey; active: boolean }) {
  const stroke = active ? "#FAF7EF" : "#0C2340";
  const sw = 1.6;
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      {kind === "today" && (
        <>
          {/* running figure */}
          <Circle cx={15} cy={4.5} r={1.6} stroke={stroke} strokeWidth={sw} />
          <Path d="M6 21l3-5 3 1 2-3 2 4 4-1" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M9 16l2-4 4 1" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {kind === "league" && (
        <>
          {/* trophy outline */}
          <Path d="M7 4h10v3a5 5 0 0 1-10 0V4z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <Path d="M4 5h3M17 5h3" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M4 5c0 3 1.5 5 3 5M20 5c0 3-1.5 5-3 5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M9 14v3h6v-3M8 20h8" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {kind === "market" && (
        <>
          {/* gift/box */}
          <Rect x={4} y={9} width={16} height={11} rx={1.5} stroke={stroke} strokeWidth={sw} />
          <Path d="M3 9h18M12 9v11" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M12 9c-1-3-4-4-5-2.5C6 8 9 9 12 9zM12 9c1-3 4-4 5-2.5C18 8 15 9 12 9z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </>
      )}
      {kind === "muni" && (
        <>
          {/* civic building */}
          <Path d="M3 21h18" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M5 21V10l7-5 7 5v11" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <Path d="M9 21v-6h6v6" stroke={stroke} strokeWidth={sw} />
          <Path d="M12 9v1" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {kind === "profile" && (
        <>
          <Circle cx={12} cy={8} r={3.5} stroke={stroke} strokeWidth={sw} />
          <Path d="M5 20c1-4 4-6 7-6s6 2 7 6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        bottom: Math.max(insets.bottom + 4, 14),
        left: 0,
        right: 0,
        alignItems: "center"
      }}
    >
      <View
        className="bg-ivory-50 rounded-full"
        style={{
          flexDirection: "row",
          paddingHorizontal: 6,
          paddingVertical: 6,
          borderWidth: 1,
          borderColor: "rgba(12, 35, 64, 0.12)",
          shadowColor: "#0C2340",
          shadowOpacity: 0.16,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 12,
          maxWidth: 360
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const iconKey = ROUTE_TO_ICON[route.name] ?? "today";
          const { options } = descriptors[route.key];
          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
          };
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityLabel={options.tabBarAccessibilityLabel ?? LABELS[iconKey]}
              accessibilityState={focused ? { selected: true } : {}}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: focused ? 14 : 12,
                paddingVertical: 10,
                borderRadius: 999,
                backgroundColor: focused ? "#0C2340" : "transparent"
              }}
            >
              <TabIcon kind={iconKey} active={focused} />
              {focused && (
                <>
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: "#D2603A",
                      marginHorizontal: 6
                    }}
                  />
                  <Text
                    style={{
                      color: "#FAF7EF",
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 12,
                      letterSpacing: 0.2
                    }}
                  >
                    {LABELS[iconKey]}
                  </Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
