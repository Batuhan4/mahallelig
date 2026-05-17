import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View } from "react-native";
import { ReactNode } from "react";

export function Screen({ children, scroll = true, className = "" }: { children: ReactNode; scroll?: boolean; className?: string }) {
  const Wrapper = scroll ? ScrollView : View;
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-ink-900">
      <Wrapper className={`flex-1 px-4 ${className}`} contentContainerClassName={scroll ? "pb-8" : undefined}>
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}
