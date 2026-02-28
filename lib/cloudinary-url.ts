// cloudinary-url.ts
//
// Parses Cloudinary image URLs.
//
/** Extracts public ID from res.cloudinary.com path; returns null if not Cloudinary or parse fails. */
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
