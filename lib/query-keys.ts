/**
 * Centralized React Query keys for cache lookups and invalidation.
 * Use these instead of ad-hoc string arrays to avoid typos and keep invalidation in sync.
 */
export const queryKeys = {
  images: {
    all: ["images"] as const,
    detail: (id: string) => ["image", id] as const,
  },
  user: {
    me: ["user", "me"] as const,
  },
} as const;
