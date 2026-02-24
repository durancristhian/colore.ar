import type { UserRole } from "@/lib/db/users";

export interface ImageGenerationOptions {
  usePaidModel: boolean;
  allowImageFromImage: boolean;
}

/**
 * Returns whether to use the paid model (Open Router) and whether image-from-image is allowed.
 * Used by both API (with DB role + request body) and frontend (with currentUser.role + switch state).
 */
export function getImageGenerationOptions(
  role: UserRole,
  usePaidModelFromRequest: boolean,
): ImageGenerationOptions {
  if (role === "standard") {
    return { usePaidModel: false, allowImageFromImage: false };
  }
  return {
    usePaidModel: usePaidModelFromRequest,
    allowImageFromImage: usePaidModelFromRequest,
  };
}
