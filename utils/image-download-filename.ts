import sanitize from "sanitize-filename";

function formatHMS(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}-${minutes}-${seconds}`;
}

export function buildImageDownloadFilename(prompt: string, date: Date): string {
  const prefix = sanitize(prompt).slice(0, 20) || "image";
  return `${prefix}-${formatHMS(date)}.png`;
}
