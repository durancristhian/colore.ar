// query-keys.ts
//
// Centralized React Query keys for cache and invalidation. Use instead of ad-hoc string arrays.
//
export const queryKeys = {
  images: {
    all: ["images"] as const,
    detail: (id: string) => ["image", id] as const,
  },
  user: {
    me: ["user", "me"] as const,
  },
} as const;
