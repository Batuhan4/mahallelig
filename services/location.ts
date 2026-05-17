import * as Location from "expo-location";
import { Platform } from "react-native";

export type GeoPoint = { lat: number; lon: number; t: number };
export type Route = { points: GeoPoint[]; distanceKm: number };

export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

export async function hasLocationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

export function emptyRoute(): Route {
  return { points: [], distanceKm: 0 };
}

export function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(la1) * Math.cos(la2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function appendRoutePoint(route: Route, lat: number, lon: number, t = Date.now()): Route {
  const last = route.points[route.points.length - 1];
  const seg = last ? haversineKm(last, { lat, lon }) : 0;
  return { points: [...route.points, { lat, lon, t }], distanceKm: route.distanceKm + seg };
}

export type LocationSubscription = { remove: () => void };

// Watch GPS during a live activity. Emits the delta distance (km) for each new
// segment plus the new point. Drops jitter (segments < ~3m).
// Returns null on web or when permission isn't granted.
export async function watchPosition(
  onSegment: (deltaKm: number, point: GeoPoint) => void
): Promise<LocationSubscription | null> {
  if (Platform.OS === "web") return null;
  const granted = await hasLocationPermission();
  if (!granted) {
    const ok = await requestLocationPermission();
    if (!ok) return null;
  }
  let last: GeoPoint | null = null;
  try {
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 2000,
        distanceInterval: 5
      },
      (loc) => {
        const p: GeoPoint = {
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
          t: loc.timestamp ?? Date.now()
        };
        const delta = last ? haversineKm(last, p) : 0;
        last = p;
        // Drop GPS jitter below ~3m
        if (delta > 0.003) onSegment(delta, p);
      }
    );
    return { remove: () => sub.remove() };
  } catch {
    return null;
  }
}
