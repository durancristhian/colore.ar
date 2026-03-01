// env.server.ts
//
// Server-only env validation. Import from "@/lib/env.server" only in server code.
// All values are validated as non-empty when present; required vars throw at build/runtime if missing.
//

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const nonEmptyString = z.string().min(1, "Must not be empty");

export const env = createEnv({
  server: {
    TURSO_DATABASE_URL: nonEmptyString,
    TURSO_AUTH_TOKEN: nonEmptyString,
    CLOUDINARY_CLOUD_NAME: nonEmptyString,
    CLOUDINARY_UPLOAD_PRESET: nonEmptyString,
    CLOUDINARY_API_KEY: nonEmptyString,
    CLOUDINARY_API_SECRET: nonEmptyString,
    OPEN_ROUTER_API_KEY: nonEmptyString,
    OPEN_ROUTER_IMAGE_MODEL: nonEmptyString,
    POLLINATIONS_API_KEY: nonEmptyString,
    TELEGRAM_BOTID: nonEmptyString,
    TELEGRAM_CHATID: nonEmptyString,
    PROMPT_PREFIX: nonEmptyString,
    PROMPT_SUFFIX: nonEmptyString,
    PROMPT_IMAGE_PREFIX: nonEmptyString,
  },
  experimental__runtimeEnv: process.env,
});
