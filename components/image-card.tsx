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
import { ImageActionsMenu } from "@/components/image-actions-menu";
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
    <Item
      asChild
      variant="outline"
      size="sm"
      className="items-start rounded-xl"
    >
      <Link
        href={`/imagenes/${imageId}`}
        aria-label={`Ver imagen: ${prompt}`}
        className="gap-4"
      >
        <ItemMedia variant="image" className="size-36 shrink-0 rounded-lg">
          <CldImage
            src={imageUrl}
            alt={prompt}
            wrapperClassName="!size-36 !w-36 !h-36 rounded-lg"
            objectFit="cover"
          />
        </ItemMedia>
        <ItemContent className="min-w-0 h-36 flex-1 gap-2">
          <ItemTitle title={prompt} className="line-clamp-2 text-base">
            {prompt}
          </ItemTitle>
          <ItemDescription>
            <RelativeTime date={createdAt} />
          </ItemDescription>
          <div
            className="mt-auto"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ImageActionsMenu
              imageId={imageId}
              imageUrl={imageUrl}
              prompt={prompt}
              variant="outline"
            />
          </div>
        </ItemContent>
      </Link>
    </Item>
  );
}
