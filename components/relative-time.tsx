"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatRawDate, getRelative } from "@/lib/format-date";

interface RelativeTimeProps {
  /** ISO date string (e.g. createdAt from API) */
  date: string;
  className?: string;
}

export function RelativeTime({ date, className }: RelativeTimeProps) {
  const raw = formatRawDate(date);
  const relative = getRelative(date, raw);

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <time dateTime={date} className={className} tabIndex={0}>
          {relative}
        </time>
      </HoverCardTrigger>
      <HoverCardContent side="top" align="start">
        {raw}
      </HoverCardContent>
    </HoverCard>
  );
}
