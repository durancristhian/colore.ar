export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * True when NEXT_PUBLIC_USE_OPEN_ROUTER_FOR_IMAGES is "true" or "1" (case-insensitive).
 * Shared by client (UI tab) and server (API) to gate image-from-image generation.
 */
export function isImageFromImageEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_USE_OPEN_ROUTER_FOR_IMAGES;
  if (raw === undefined || raw === null) return false;
  return /^(true|1)$/i.test(String(raw).trim());
}

export function isImageTypeAllowed(type: string): boolean {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type);
}

export function isImageSizeValid(size: number): boolean {
  return size <= MAX_IMAGE_SIZE_BYTES;
}

export function isImageFileValid(file: File): boolean {
  return isImageTypeAllowed(file.type) && isImageSizeValid(file.size);
}
