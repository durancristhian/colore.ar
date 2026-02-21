"use client";

import { CldImage } from "@/components/cld-image";
import { DeleteImageButton } from "@/components/delete-image-button";
import Link from "next/link";

interface ImageCardProps {
  imageId: string;
  imageUrl: string;
  prompt: string;
}

export function ImageCard({ imageId, imageUrl, prompt }: ImageCardProps) {
  return (
    <Link href={`/images/${imageId}`} className="block">
      <article className="relative flex flex-col overflow-hidden rounded-md border">
        <div className="absolute right-1 top-1 z-10 m-1">
          <DeleteImageButton imageId={imageId} />
        </div>
        <CldImage src={imageUrl} alt={prompt} wrapperClassName="rounded-t-md" />
        <div className="border-t p-2">
          <p className="line-clamp-1" title={prompt}>
            {prompt}
          </p>
        </div>
      </article>
    </Link>
  );
}
