import RelativeTimeLib from "@yaireo/relative-time";

const relativeTime = new RelativeTimeLib({ locale: "es" });

export function formatRawDate(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    return date.toLocaleString("es");
  } catch {
    return createdAt;
  }
}

/**
 * Returns a relative time string (e.g. "2 hours ago") for the given ISO date.
 * Uses rawFallback when the date is invalid or the relative-time lib fails.
 */
export function getRelative(date: string, rawFallback: string): string {
  try {
    const dateObj = new Date(date);
    if (Number.isNaN(dateObj.getTime())) return rawFallback;
    return relativeTime.from(dateObj);
  } catch {
    return rawFallback;
  }
}
