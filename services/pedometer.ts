import { Pedometer } from "expo-sensors";
import { Platform } from "react-native";

export type StepSubscription = { remove: () => void };
export type StepListener = (deltaSteps: number) => void;

export async function isAvailable(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    return await Pedometer.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    const { status } = await Pedometer.requestPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

// Today total since midnight. iOS pulls from Apple Health; Android from Health Connect/sensor.
export async function getStepsToday(): Promise<number> {
  if (Platform.OS === "web") return 0;
  const end = new Date();
  const start = new Date(end);
  start.setHours(0, 0, 0, 0);
  try {
    const r = await Pedometer.getStepCountAsync(start, end);
    return r?.steps ?? 0;
  } catch {
    return 0;
  }
}

// Subscribe to live step count. Listener fires with the **delta** since the
// previous event (computed internally — expo's raw watchStepCount delivers
// the cumulative count since the subscription was created).
export function watchSteps(listener: StepListener): StepSubscription {
  if (Platform.OS === "web") return { remove: () => {} };
  let last = 0;
  try {
    const sub = Pedometer.watchStepCount((e) => {
      const total = e?.steps ?? 0;
      const delta = total - last;
      last = total;
      if (delta > 0) listener(delta);
    });
    return { remove: () => sub.remove() };
  } catch {
    return { remove: () => {} };
  }
}
