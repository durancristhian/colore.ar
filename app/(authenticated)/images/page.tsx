"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteImageButton } from "@/components/delete-image-button";
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
          <Button asChild>
            <Link href="/images/new">New</Link>
          </Button>
        </div>

        {isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}

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
              <Link
                key={image.id}
                href={`/images/${image.id}`}
                className="block"
              >
                <article className="relative flex flex-col overflow-hidden rounded-md border">
                  <div className="absolute right-1 top-1 m-1">
                    <DeleteImageButton imageId={image.id} />
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.imageUrl}
                    alt={image.description ?? "From uploaded image"}
                    className="w-full rounded-t-md object-contain"
                  />
                  <div className="border-t p-2">
                    <p
                      className="line-clamp-1"
                      title={image.description ?? undefined}
                    >
                      {image.description ?? "From uploaded image"}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
