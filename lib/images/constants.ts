export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function isImageTypeAllowed(type: string): boolean {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type);
}

export function isImageSizeValid(size: number): boolean {
  return size <= MAX_IMAGE_SIZE_BYTES;
}

export function isImageFileValid(file: File): boolean {
  return isImageTypeAllowed(file.type) && isImageSizeValid(file.size);
}
