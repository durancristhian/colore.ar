"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteImage, listImages } from "@/lib/api";

export default function ImagesPage() {
  const queryClient = useQueryClient();
  const {
    data: images,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["images"],
    queryFn: listImages,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });

  function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    deleteMutation.mutate(id);
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-1 items-center justify-between gap-4">
          <h1 className="font-semibold">Your images</h1>
          <Button asChild>
            <Link href="/images/new">New</Link>
          </Button>
        </div>

        {isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}

        {isError && (
          <p className="text-sm text-destructive">
            Failed to load images. Try again.
          </p>
        )}

        {!isLoading && !isError && (!images || images.length === 0) && (
          <p className="text-muted-foreground text-sm">No images yet.</p>
        )}

        {!isLoading && !isError && images && images.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <Link
                key={image.id}
                href={`/images/${image.id}`}
                className="block"
              >
                <article className="relative flex flex-col gap-2 rounded-md border p-2">
                  <div className="absolute right-3 top-3 m-1">
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      className="size-9 p-2 hover:text-destructive"
                      aria-label="Delete image"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(image.id);
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.imageUrl}
                    alt={image.description}
                    className="w-full rounded-md border object-contain"
                  />
                  <p
                    className="line-clamp-1 text-muted-foreground text-sm"
                    title={image.description}
                  >
                    {image.description}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
