import { buildQrPayload, encodeQr, isExpired, REDEMPTION_TTL_MIN } from "@/services/qr";

describe("qr", () => {
  test("payload has TTL", () => {
    const t0 = 1_700_000_000_000;
    const p = buildQrPayload({ uid: "u1", rid: "r1", rdid: "rd1", now: t0 });
    expect(p.expiresAt - t0).toBe(REDEMPTION_TTL_MIN * 60 * 1000);
  });
  test("encode round-trip contains all fields", () => {
    const p = buildQrPayload({ uid: "u1", rid: "r1", rdid: "rd1", now: 1 });
    const s = encodeQr(p);
    expect(s).toContain("u=u1");
    expect(s).toContain("r=r1");
    expect(s).toContain("i=rd1");
  });
  test("isExpired flips after TTL", () => {
    const p = buildQrPayload({ uid: "u", rid: "r", rdid: "i", now: 0 });
    expect(isExpired(p, REDEMPTION_TTL_MIN * 60 * 1000 - 1)).toBe(false);
    expect(isExpired(p, REDEMPTION_TTL_MIN * 60 * 1000)).toBe(true);
  });
});
