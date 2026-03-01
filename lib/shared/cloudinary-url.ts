// cloudinary-url.ts
//
// Parses Cloudinary CDN URLs. Used when we need the public_id from a stored
// image URL (e.g. for delete or URL building). Only handles res.cloudinary.com paths.
//
/** Extracts public_id from res.cloudinary.com path; null if host/path don't match or parse fails. */
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
