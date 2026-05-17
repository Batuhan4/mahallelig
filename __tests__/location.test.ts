import { appendRoutePoint, emptyRoute, haversineKm } from "@/services/location";

describe("location", () => {
  test("haversineKm zero for identical points", () => {
    expect(haversineKm({ lat: 41, lon: 29 }, { lat: 41, lon: 29 })).toBe(0);
  });
  test("appendRoutePoint accumulates distance", () => {
    let r = emptyRoute();
    r = appendRoutePoint(r, 41.0, 29.0, 0);
    r = appendRoutePoint(r, 41.001, 29.0, 1000);
    expect(r.points).toHaveLength(2);
    expect(r.distanceKm).toBeGreaterThan(0);
  });
});
