"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatRawDate, getRelative } from "@/lib/format-date";
import { ClockIcon } from "lucide-react";

interface RelativeTimeProps {
  /** ISO date string (e.g. createdAt from API) */
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
          className="hover:underline focus:underline underline-offset-2 cursor-default outline-none focus:rounded"
          tabIndex={0}
        >
          {display}
        </time>
      </HoverCardTrigger>
      <HoverCardContent side="top" align="start" className="w-auto">
        <div className="flex items-center gap-2">
          <ClockIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <span>{raw}</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
