export type QrPayload = {
  v: 1;
  uid: string;
  rid: string;
  rdid: string;
  expiresAt: number;
};

export const REDEMPTION_TTL_MIN = 15;

export function buildQrPayload(opts: { uid: string; rid: string; rdid: string; now?: number }): QrPayload {
  const now = opts.now ?? Date.now();
  return { v: 1, uid: opts.uid, rid: opts.rid, rdid: opts.rdid, expiresAt: now + REDEMPTION_TTL_MIN * 60 * 1000 };
}

export function encodeQr(p: QrPayload): string {
  return `mahallelig://r?v=${p.v}&u=${encodeURIComponent(p.uid)}&r=${encodeURIComponent(p.rid)}&i=${encodeURIComponent(p.rdid)}&e=${p.expiresAt}`;
}

export function isExpired(p: QrPayload, now = Date.now()): boolean {
  return now >= p.expiresAt;
}
