import { useRedemptionStore } from "@/store/useRedemptionStore";

describe("useRedemptionStore", () => {
  beforeEach(() => {
    useRedemptionStore.setState({ items: [] });
  });
  test("add + markUsed", () => {
    useRedemptionStore.getState().add({
      rdid: "r1", uid: "u", rid: "x", qrPayload: "p", status: "active",
      createdAt: 0, expiresAt: 1000
    });
    expect(useRedemptionStore.getState().items[0].status).toBe("active");
    useRedemptionStore.getState().markUsed("r1");
    expect(useRedemptionStore.getState().items[0].status).toBe("used");
  });
});
