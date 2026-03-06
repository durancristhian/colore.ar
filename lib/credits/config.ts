// config.ts
//
// Credits system configuration. Feature flag, max balance cap, and purchase
// amount. Importable from both server and client code.
//
import { envClient } from "@/lib/env.client";

export function areCreditsEnabled(): boolean {
  return envClient.NEXT_PUBLIC_CREDITS_ENABLED === "true";
}

export function getCreditsMaxBalance(): number {
  const raw = envClient.NEXT_PUBLIC_CREDITS_MAX_BALANCE;
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : Number(envClient.NEXT_PUBLIC_CREDITS_MAX_BALANCE);
}

/** Number of credits added per purchase. Hardcoded for now; easy to change later. */
export const CREDITS_PER_PURCHASE = 2;

/**
 * Whether a user with the given balance can purchase more credits.
 * Returns false if buying would exceed the max balance cap.
 */
export function canPurchaseCredits(currentBalance: number): boolean {
  return currentBalance + CREDITS_PER_PURCHASE <= getCreditsMaxBalance();
}
