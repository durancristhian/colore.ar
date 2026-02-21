"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DeleteImageButton } from "@/components/delete-image-button";
import { ImagePageLayout } from "@/components/image-page-layout";
import { ImageWithActions } from "@/components/image-with-actions";
import { getImage } from "@/lib/api";

function formatCreatedAt(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    return date.toLocaleString();
  } catch {
    return createdAt;
  }
}

export default function ImageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const {
    data: image,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["image", id],
    queryFn: () => getImage(id),
    enabled: !!id,
  });

  if (!id) {
    return (
      <ImagePageLayout title="Creation" backHref="/images">
        <p className="text-sm text-destructive">
          We didn&apos;t find the creation you&apos;re looking for.
        </p>
        <Link href="/images" className="text-sm underline">
          Back to creations
        </Link>
      </ImagePageLayout>
    );
  }

  if (isLoading) {
    return (
      <ImagePageLayout title="Creation" backHref="/images">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </ImagePageLayout>
    );
  }

  if (isError || !image) {
    return (
      <ImagePageLayout title="Creation" backHref="/images">
        <p className="text-sm text-destructive">
          We didn&apos;t find the creation you&apos;re looking for.
        </p>
        <Link href="/images" className="text-sm underline">
          Back to creations
        </Link>
      </ImagePageLayout>
    );
  }

  return (
    <ImagePageLayout title="Creation details" backHref="/images">
      <main className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Prompt</p>
          <p className="text-sm">
            {image.description ?? "From uploaded image"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Created</p>
          <p className="text-sm">{formatCreatedAt(image.createdAt)}</p>
        </div>
        <div className="relative">
          <div className="absolute right-1 top-1 z-10 m-1">
            <DeleteImageButton
              imageId={image.id}
              onSuccess={() => router.push("/images")}
            />
          </div>
          <ImageWithActions
            src={image.imageUrl}
            prompt={image.description ?? "From uploaded image"}
          />
        </div>
      </main>
    </ImagePageLayout>
  );
}
