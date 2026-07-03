import "server-only";
import { randomBytes } from "node:crypto";

// Per-guest link token: 32 URL-safe chars (base64url of 24 random bytes ≈ 192
// bits). Server-only — never generate or expose guest tokens on the client.
// The DB `guests.token` column is UNIQUE; on the astronomically rare collision
// the caller should retry.
export function generateGuestToken(): string {
  return randomBytes(24).toString("base64url");
}
