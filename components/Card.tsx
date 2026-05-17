import { View } from "react-native";
import { ReactNode } from "react";

// Refined ivory card with hairline border + optional navy stripe ornament
export function Card({
  children,
  stripe = false,
  className = ""
}: {
  children: ReactNode;
  stripe?: boolean;
  className?: string;
}) {
  return (
    <View
      className={`bg-ivory-50 rounded-2xl border border-navy-900/10 overflow-hidden ${className}`}
    >
      {stripe && (
        <View className="h-1 flex-row">
          <View className="flex-1 bg-navy-900" />
          <View className="w-4 bg-terra-500" />
          <View className="w-2 bg-bronze-500" />
        </View>
      )}
      <View className="p-4">{children}</View>
    </View>
  );
}

// Bare card without padding (when contents define their own)
export function BareCard({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`bg-ivory-50 rounded-2xl border border-navy-900/10 overflow-hidden ${className}`}
    >
      {children}
    </View>
  );
}
