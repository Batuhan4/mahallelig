import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View } from "react-native";
import { ReactNode } from "react";

export function Screen({
  children,
  scroll = true,
  className = "",
  contentClassName = ""
}: {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
  contentClassName?: string;
}) {
  const Wrapper = scroll ? ScrollView : View;
  return (
    <SafeAreaView className="flex-1 bg-ivory-100" edges={["top", "left", "right"]}>
      <Wrapper
        className={`flex-1 px-5 ${className}`}
        contentContainerClassName={scroll ? `pb-32 ${contentClassName}` : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}

// Editorial large-title header for screens
export function LargeTitle({
  eyebrow,
  title,
  subtitle,
  trailing
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
}) {
  return (
    <View className="pt-3 pb-5">
      <View className="flex-row items-end justify-between">
        <View className="flex-1 pr-3">
          {eyebrow && (
            <View className="flex-row items-center gap-2 mb-1">
              <View className="w-1.5 h-1.5 rounded-full bg-terra-500" />
              <View className="font-sans">
                <EyebrowText>{eyebrow}</EyebrowText>
              </View>
            </View>
          )}
          <TitleText>{title}</TitleText>
          {subtitle && <SubtitleText>{subtitle}</SubtitleText>}
        </View>
        {trailing}
      </View>
      <View className="h-px bg-navy-900/10 mt-5" />
    </View>
  );
}

import { Text } from "react-native";

function EyebrowText({ children }: { children: ReactNode }) {
  return (
    <Text
      className="text-steel-500 text-[10px] tracking-widest"
      style={{ fontFamily: "Inter_600SemiBold" }}
    >
      {String(children).toUpperCase()}
    </Text>
  );
}

function TitleText({ children }: { children: ReactNode }) {
  return (
    <Text
      className="text-navy-900 text-4xl"
      style={{ fontFamily: "Fraunces_700Bold", letterSpacing: -1.2, lineHeight: 40 }}
    >
      {children}
    </Text>
  );
}

function SubtitleText({ children }: { children: ReactNode }) {
  return (
    <Text className="text-steel-500 mt-1" style={{ fontFamily: "Inter_500Medium", fontSize: 13 }}>
      {children}
    </Text>
  );
}

// Section heading for cards/lists
export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <View className="flex-row items-baseline justify-between mt-6 mb-3">
      <Text
        className="text-navy-900"
        style={{ fontFamily: "Fraunces_700Bold", fontSize: 18, letterSpacing: -0.4 }}
      >
        {children}
      </Text>
      {sub && (
        <Text className="text-steel-500" style={{ fontFamily: "IBMPlexMono_500Medium", fontSize: 11 }}>
          {sub}
        </Text>
      )}
    </View>
  );
}

// Hairline divider
export function Hairline({ className = "" }: { className?: string }) {
  return <View className={`h-px bg-navy-900/10 ${className}`} />;
}

// Dotted ornament stripe — used as section delimiter
export function DotOrnament({ count = 24 }: { count?: number }) {
  return (
    <View className="flex-row items-center justify-center py-3">
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} className="w-0.5 h-0.5 rounded-full bg-navy-900/30 mx-0.5" />
      ))}
    </View>
  );
}
