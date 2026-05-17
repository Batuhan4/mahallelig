import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

declare const window: { Notification?: typeof Notification } & Record<string, unknown>;

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") {
    if (typeof window === "undefined" || !window.Notification) return false;
    const Notif = window.Notification;
    if (Notif.permission === "granted") return true;
    if (Notif.permission === "denied") return false;
    const r = await Notif.requestPermission();
    return r === "granted";
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

let inAppToastListener: ((t: { title: string; body: string }) => void) | null = null;
export function setInAppToastListener(fn: ((t: { title: string; body: string }) => void) | null) {
  inAppToastListener = fn;
}

export async function fireLocal({ title, body }: { title: string; body: string }) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.Notification && window.Notification.permission === "granted") {
      new window.Notification(title, { body });
    }
    inAppToastListener?.({ title, body });
    return;
  }
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null
  });
}
