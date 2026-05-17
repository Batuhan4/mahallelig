import type { Backend } from "./types";

export function makeFirebaseBackend(_config: Record<string, string>): Backend {
  throw new Error("firebaseBackend not yet wired — set EXPO_PUBLIC_FIREBASE_API_KEY etc. and implement.");
}
