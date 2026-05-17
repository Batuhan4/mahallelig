import { Pressable, Text, View } from "react-native";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<Variant, { container: string; text: string }> = {
  primary: { container: "bg-terra-500 active:bg-terra-600 border border-terra-600", text: "text-ivory-50" },
  secondary: { container: "bg-navy-900 active:bg-navy-700 border border-navy-900", text: "text-ivory-50" },
  ghost: { container: "bg-transparent border border-navy-900/20 active:bg-navy-900/5", text: "text-navy-900" },
  danger: { container: "bg-transparent border border-terra-700/40 active:bg-terra-100", text: "text-terra-700" }
};

export function Button({
  label,
  onPress,
  variant = "primary",
  trailing,
  leading,
  full = true,
  small = false
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  trailing?: ReactNode;
  leading?: ReactNode;
  full?: boolean;
  small?: boolean;
}) {
  const v = VARIANTS[variant];
  return (
    <Pressable
      onPress={onPress}
      className={`${v.container} rounded-2xl ${full ? "" : "self-start"} ${small ? "px-4 py-2" : "px-5 py-4"} flex-row items-center justify-center`}
      style={{ minWidth: full ? "100%" : undefined }}
    >
      {leading && <View className="mr-2">{leading}</View>}
      <Text
        className={`${v.text}`}
        style={{
          fontFamily: "System", fontWeight: "600",
          fontSize: small ? 13 : 15,
          letterSpacing: 0.2
        }}
      >
        {label}
      </Text>
      {trailing && <View className="ml-2">{trailing}</View>}
    </Pressable>
  );
}
