import * as Location from "expo-location";

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

export type Route = { points: { lat: number; lon: number; t: number }[]; distanceKm: number };

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
