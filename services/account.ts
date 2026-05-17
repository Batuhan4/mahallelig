import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/store/useUserStore";
import { useActivityStore } from "@/store/useActivityStore";
import { useRedemptionStore } from "@/store/useRedemptionStore";
import { useLeagueStore } from "@/store/useLeagueStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useMuniAuthStore } from "@/store/useMuniAuthStore";

// KVKK m. 7 (silme hakkı) uyarınca tek tıkla hesap silme.
// 1) Tüm zustand store'ları in-memory sıfırla.
// 2) AsyncStorage'da "mahallelig-" prefix'li tüm key'leri sil.
// Cihazda hiçbir kalıntı bırakmaz; backend olmadığı için "24 saat" eşiği
// bekletmeden anlık silme yapar.
export async function deleteAccount() {
  useUserStore.getState().reset();
  useActivityStore.setState({
    todaySteps: 0,
    todayPoints: 0,
    history: [],
    liveActivity: null
  });
  useRedemptionStore.setState({ items: [] });
  useLeagueStore.getState().reset();
  useSettingsStore.setState({ demoMode: false, notificationsEnabled: false });
  useMuniAuthStore.getState().signOut();

  try {
    const keys = await AsyncStorage.getAllKeys();
    const ours = keys.filter((k) => k.startsWith("mahallelig-"));
    if (ours.length > 0) {
      await AsyncStorage.multiRemove(ours);
    }
  } catch {
    // AsyncStorage erişilemese bile in-memory state'i sıfırladık.
  }
}
