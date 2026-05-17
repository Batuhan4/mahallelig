import { Pedometer } from "expo-sensors";
import { Platform } from "react-native";

export type StepSubscription = { remove: () => void };
export type StepListener = (stepsThisInterval: number) => void;

export async function isAvailable(): Promise<boolean> {
  try {
    return await Pedometer.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function getStepsToday(): Promise<number> {
  if (Platform.OS === "web") return 0;
  const end = new Date();
  const start = new Date(end);
  start.setHours(0, 0, 0, 0);
  try {
    const r = await Pedometer.getStepCountAsync(start, end);
    return r.steps ?? 0;
  } catch {
    return 0;
  }
}

export function watchSteps(listener: StepListener): StepSubscription {
  try {
    const sub = Pedometer.watchStepCount((e) => listener(e.steps));
    return { remove: () => sub.remove() };
  } catch {
    return { remove: () => {} };
  }
}
