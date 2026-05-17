import { Text, View } from "react-native";

type Tone = "navy" | "terra" | "field" | "bronze" | "ghost";

const STYLES: Record<Tone, { bg: string; border: string; text: string }> = {
  navy: { bg: "bg-navy-900", border: "border-navy-900", text: "text-ivory-100" },
  terra: { bg: "bg-terra-500", border: "border-terra-500", text: "text-ivory-50" },
  field: { bg: "bg-field-500", border: "border-field-500", text: "text-ivory-50" },
  bronze: { bg: "bg-bronze-500", border: "border-bronze-500", text: "text-ivory-50" },
  ghost: { bg: "bg-transparent", border: "border-navy-900/20", text: "text-navy-900" }
};

export function Badge({
  label,
  tone = "navy",
  mono = false
}: {
  label: string;
  tone?: Tone;
  mono?: boolean;
}) {
  const s = STYLES[tone];
  return (
    <View className={`${s.bg} border ${s.border} rounded-full px-2.5 py-1`}>
      <Text
        className={`${s.text} text-[11px]`}
        style={{ fontFamily: mono ? "IBMPlexMono_500Medium" : "Inter_600SemiBold", letterSpacing: 0.4 }}
      >
        {label}
      </Text>
    </View>
  );
}
