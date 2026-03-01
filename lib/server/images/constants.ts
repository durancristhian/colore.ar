// constants.ts
//
// Allowed MIME types, max size (MAX_IMAGE_SIZE_BYTES), and validators for the images API.
//
/** Fallback when an image has no description (e.g. uploaded from file). */
export const DEFAULT_IMAGE_DESCRIPTION = "A partir de una imagen";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

/** Max size in bytes; used by isImageSizeValid and the images API. */
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

/** Max length in characters for the image prompt/description; used by UI and API. */
export const MAX_DESCRIPTION_LENGTH = 500;

/** True if type is in ALLOWED_IMAGE_TYPES. */
export function isImageTypeAllowed(type: string): boolean {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type);
}

/** True if size is within MAX_IMAGE_SIZE_BYTES. */
export function isImageSizeValid(size: number): boolean {
  return size <= MAX_IMAGE_SIZE_BYTES;
}

/** True if description length is within MAX_DESCRIPTION_LENGTH (trimmed). */
export function isDescriptionLengthValid(value: string): boolean {
  return value.trim().length <= MAX_DESCRIPTION_LENGTH;
}

/** True if file type is in ALLOWED_IMAGE_TYPES and size ≤ MAX_IMAGE_SIZE_BYTES. */
export function isImageFileValid(file: File): boolean {
  return isImageTypeAllowed(file.type) && isImageSizeValid(file.size);
}
