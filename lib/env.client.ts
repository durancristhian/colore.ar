// env.client.ts
//
// Client-safe env (NEXT_PUBLIC_* only). Safe to import in client components and layout.
//

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const envClient = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1, "Must not be empty"),
    NEXT_PUBLIC_CREDITS_ENABLED: z.string().min(1, "Must not be empty"),
    NEXT_PUBLIC_CREDITS_MAX_BALANCE: z.string().min(1, "Must not be empty"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CREDITS_ENABLED: process.env.NEXT_PUBLIC_CREDITS_ENABLED,
    NEXT_PUBLIC_CREDITS_MAX_BALANCE:
      process.env.NEXT_PUBLIC_CREDITS_MAX_BALANCE,
  },
});
