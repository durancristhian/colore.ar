"use client";

import { CldImage } from "@/components/cld-image";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { RelativeTime } from "@/components/relative-time";
import Link from "next/link";

interface ImageCardProps {
  imageId: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
}

export function ImageCard({
  imageId,
  imageUrl,
  prompt,
  createdAt,
}: ImageCardProps) {
  return (
    <Item asChild variant="outline" size="sm">
      <Link
        href={`/imagenes/${imageId}`}
        className="flex items-start rounded-xl"
        aria-label={`Ver imagen: ${prompt}`}
      >
        <ItemMedia variant="image" className="size-36 shrink-0 rounded-lg">
          <CldImage
            src={imageUrl}
            alt={prompt}
            wrapperClassName="!size-36 !w-36 !h-36 rounded-lg"
          />
        </ItemMedia>
        <ItemContent className="min-w-0 gap-2">
          <ItemTitle title={prompt} className="line-clamp-2 text-base">
            {prompt}
          </ItemTitle>
          <ItemDescription>
            <RelativeTime date={createdAt} />
          </ItemDescription>
        </ItemContent>
      </Link>
    </Item>
  );
}
