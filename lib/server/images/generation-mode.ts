// generation-mode.ts
//
// Maps user role and request flag to whether the paid model and image-from-image are allowed. Used by API and frontend.
//
import type { UserRole } from "@/lib/server/db/users";

export interface ImageGenerationOptions {
  usePaidModel: boolean;
  allowImageFromImage: boolean;
}

/**
 * Returns usePaidModel and allowImageFromImage from role and usePaidModelFromRequest. Standard role always gets false for both.
 */
export function getImageGenerationOptions(
  role: UserRole,
  credits: number,
  usePaidModelFromRequest: boolean,
): ImageGenerationOptions {
  if (role === "standard" && credits <= 0) {
    return { usePaidModel: false, allowImageFromImage: false };
  }
  return {
    usePaidModel: usePaidModelFromRequest,
    allowImageFromImage: usePaidModelFromRequest,
  };
}
