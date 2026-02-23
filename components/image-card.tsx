"use client";

import { CldImage } from "@/components/cld-image";
import { ImageActionsMenu } from "@/components/image-actions-menu";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCreatedAt } from "@/lib/format-date";
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
    <Card className="relative p-0 gap-0">
      <Link
        href={`/images/${imageId}`}
        className="flex flex-col rounded-xl"
        aria-label={`View image: ${prompt}`}
      >
        <CldImage src={imageUrl} alt={prompt} wrapperClassName="rounded-t-xl" />
        <CardHeader className="p-4 pr-12">
          <CardTitle className="line-clamp-2" title={prompt}>
            {prompt}
          </CardTitle>
          <CardDescription>
            Created {formatCreatedAt(createdAt)}
          </CardDescription>
        </CardHeader>
      </Link>
      <CardAction className="absolute top-4 right-4">
        <ImageActionsMenu imageId={imageId} imageUrl={imageUrl} />
      </CardAction>
    </Card>
  );
}
