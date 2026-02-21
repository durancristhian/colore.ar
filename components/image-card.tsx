"use client";

import Link from "next/link";
import { DeleteImageButton } from "@/components/delete-image-button";

interface ImageCardProps {
  imageId: string;
  imageUrl: string;
  prompt: string;
}

export function ImageCard({ imageId, imageUrl, prompt }: ImageCardProps) {
  return (
    <Link href={`/images/${imageId}`} className="block">
      <article className="relative flex flex-col overflow-hidden rounded-md border">
        <div className="absolute right-1 top-1 m-1">
          <DeleteImageButton imageId={imageId} />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={prompt}
          className="w-full rounded-t-md object-contain"
        />
        <div className="border-t p-2">
          <p className="line-clamp-2" title={prompt}>
            {prompt}
          </p>
        </div>
      </article>
    </Link>
  );
}
