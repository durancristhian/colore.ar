/**
 * Extracts the Cloudinary public ID from a full Cloudinary image URL.
 * Handles format: https://res.cloudinary.com/<cloud>/image/upload/<publicId>
 * or with transformations: .../image/upload/<transformations>/<publicId>
 */
export function getPublicIdFromCloudinaryUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname !== "res.cloudinary.com" ||
      !parsed.pathname.startsWith("/")
    )
      return null;
    const prefix = "/image/upload/";
    const idx = parsed.pathname.indexOf(prefix);
    if (idx === -1) return null;
    const afterUpload = parsed.pathname.slice(idx + prefix.length);
    return afterUpload || null;
  } catch {
    return null;
  }
}
