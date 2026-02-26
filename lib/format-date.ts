// format-date.ts
//
// Date formatting for display. formatRawDate: locale string; getRelative: relative time with fallback. Uses @yaireo/relative-time (es).
//
import RelativeTimeLib from "@yaireo/relative-time";

const relativeTime = new RelativeTimeLib({ locale: "es" });

/** Returns locale-formatted date string; returns raw input on parse error. */
export function formatRawDate(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    return date.toLocaleString("es");
  } catch {
    return createdAt;
  }
}

/** Returns relative time string; uses rawFallback when date is invalid or relative-time lib fails. */
export function getRelative(date: string, rawFallback: string): string {
  try {
    const dateObj = new Date(date);
    if (Number.isNaN(dateObj.getTime())) return rawFallback;
    return relativeTime.from(dateObj);
  } catch {
    return rawFallback;
  }
}
