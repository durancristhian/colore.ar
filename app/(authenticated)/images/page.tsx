"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCard } from "@/components/image-card";
import { LoadingMessage } from "@/components/loading-message";
import { listImages } from "@/lib/api";

export default function ImagesPage() {
  const {
    data: images,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["images"],
    queryFn: listImages,
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-1 items-center justify-between gap-4">
          <h1 className="font-semibold">Your creations</h1>
          <Button asChild size="icon" aria-label="New creation">
            <Link href="/images/new">
              <Plus className="size-4" />
            </Link>
          </Button>
        </div>

        {isLoading && <LoadingMessage label="Loading creations..." />}

        {isError && (
          <p className="text-sm text-destructive">
            Failed to load creations. Try again.
          </p>
        )}

        {!isLoading && !isError && (!images || images.length === 0) && (
          <p className="text-muted-foreground text-sm">No creations yet.</p>
        )}

        {!isLoading && !isError && images && images.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <ImageCard
                key={image.id}
                imageId={image.id}
                imageUrl={image.imageUrl}
                prompt={image.description ?? "From uploaded image"}
                createdAt={image.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
