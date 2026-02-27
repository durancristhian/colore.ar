// relative-time.tsx
//
// Shows relative time (e.g. "hace 2 horas") with hover card for exact date. Uses lib/format-date.
//
"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatRawDate, getRelative } from "@/lib/format-date";
import { ClockIcon } from "@phosphor-icons/react";

interface RelativeTimeProps {
  /** ISO date string from API (e.g. createdAt). */
  date: string;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  const raw = formatRawDate(date);
  const relative = getRelative(date, raw);
  const display = relative.length
    ? relative.charAt(0).toUpperCase() + relative.slice(1)
    : relative;

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <time
          dateTime={date}
          className="inline-flex cursor-default items-center gap-1.5 font-mono text-[0.9em] underline-offset-2 outline-none hover:underline focus:rounded focus:underline"
          tabIndex={0}
        >
          <ClockIcon
            className="text-muted-foreground size-4 shrink-0"
            aria-hidden
          />
          {display}
        </time>
      </HoverCardTrigger>
      <HoverCardContent side="top" align="start" className="w-auto">
        <p className="text-muted-foreground text-sm">Generada el {raw}.</p>
      </HoverCardContent>
    </HoverCard>
  );
}
