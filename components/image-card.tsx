"use client";

import { CldImage } from "@/components/cld-image";
import { ImageActionsMenu } from "@/components/image-actions-menu";
import {
  Card,
  CardDescription,
  CardFooter,
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
        <CardHeader className="p-4">
          <CardTitle className="line-clamp-1" title={prompt}>
            {prompt}
          </CardTitle>
          <CardDescription>
            Created {formatCreatedAt(createdAt)}
          </CardDescription>
        </CardHeader>
        <CardFooter className="px-4 pb-4">
          <ImageActionsMenu
            imageId={imageId}
            imageUrl={imageUrl}
            prompt={prompt}
          />
        </CardFooter>
      </Link>
    </Card>
  );
}
