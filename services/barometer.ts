import { Barometer } from "expo-sensors";
import { Platform } from "react-native";

export type AltitudeSubscription = { remove: () => void };

export async function isBarometerAvailable(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    return await Barometer.isAvailableAsync();
  } catch {
    return false;
  }
}

// Convert pressure (hPa) to altitude relative to a baseline pressure.
// Uses the barometric formula linearized near sea level: ~8.43m per hPa drop.
function deltaAltitudeM(p0: number, p: number) {
  return 8.43 * (p0 - p);
}

// Watch barometer during a live activity and emit the running altitude gain
// (in meters) since the subscription started. Only emits monotonic increases
// (climbs); descents are clamped so floors counted are net upward.
export function watchAltitudeGain(
  onUpdate: (meters: number) => void,
  intervalMs = 1000
): AltitudeSubscription {
  if (Platform.OS === "web") return { remove: () => {} };
  let baseline: number | null = null;
  let smoothed: number | null = null;
  let maxGain = 0;
  Barometer.setUpdateInterval(intervalMs);
  const sub = Barometer.addListener(({ pressure }) => {
    if (!pressure || !isFinite(pressure)) return;
    // Low-pass exponential smoothing to kill noise
    smoothed = smoothed === null ? pressure : smoothed * 0.7 + pressure * 0.3;
    if (baseline === null) {
      baseline = smoothed;
      return;
    }
    const gain = deltaAltitudeM(baseline, smoothed);
    if (gain > maxGain + 0.3) {
      maxGain = gain;
      onUpdate(Math.max(0, maxGain));
    }
  });
  return { remove: () => sub.remove() };
}
