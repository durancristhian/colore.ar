/**
 * Returns an SVG string for a shimmer placeholder (animated gradient).
 * Matches the pattern from Next Cloudinary placeholders guide.
 */
function shimmerSvg(width: number, height: number): string {
  return `<svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#333" />
  <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite" />
</svg>`;
}

function toBase64(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8").toString("base64");
  }
  return btoa(unescape(encodeURIComponent(str)));
}

const cache = new Map<string, string>();

/**
 * Returns a data URL for a shimmer placeholder SVG with the given dimensions.
 * Cached per width/height so the same dimensions reuse the same data URL.
 * Works in both Node (SSR) and browser.
 */
export function getShimmerDataUrl(width: number, height: number): string {
  const key = `${width}_${height}`;
  let dataUrl = cache.get(key);
  if (!dataUrl) {
    const svg = shimmerSvg(width, height);
    const base64 = toBase64(svg);
    dataUrl = `data:image/svg+xml;base64,${base64}`;
    cache.set(key, dataUrl);
  }
  return dataUrl;
}
