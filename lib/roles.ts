// roles.ts
//
// User-visible labels and badge Tailwind classes per UserRole. Used by header and any role badge.
//
import type { UserRole } from "@/lib/db/users";

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  vip: "VIP",
  standard: "Estándar",
};

export const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  admin: "font-mono bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  vip: "font-mono bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  standard:
    "font-mono bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};
