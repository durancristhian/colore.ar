// download-image.ts
//
// Triggers a download of the image at src with the given filename (client-only).
//
/** Fetches image, creates object URL, triggers anchor download, revokes URL. */
export async function downloadImage(
  src: string,
  filename: string,
): Promise<void> {
  const response = await fetch(src);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
