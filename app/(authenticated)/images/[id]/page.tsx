"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DeleteImageButton } from "@/components/delete-image-button";
import { ImagePageLayout } from "@/components/image-page-layout";
import { ImageWithPrint } from "@/components/image-with-print";
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
      <ImagePageLayout title="Image" backHref="/images">
        <p className="text-sm text-destructive">Invalid image.</p>
        <Link href="/images" className="text-sm underline">
          Back to images
        </Link>
      </ImagePageLayout>
    );
  }

  if (isLoading) {
    return (
      <ImagePageLayout title="Image" backHref="/images">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </ImagePageLayout>
    );
  }

  if (isError || !image) {
    return (
      <ImagePageLayout title="Image" backHref="/images">
        <p className="text-sm text-destructive">Image not found.</p>
        <Link href="/images" className="text-sm underline">
          Back to images
        </Link>
      </ImagePageLayout>
    );
  }

  return (
    <ImagePageLayout title="Image details" backHref="/images">
      <main className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Prompt</p>
          <p className="text-sm">{image.description}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Created</p>
          <p className="text-sm">{formatCreatedAt(image.createdAt)}</p>
        </div>
        <div className="relative">
          <div className="absolute right-1 top-1 m-1">
            <DeleteImageButton
              imageId={image.id}
              onSuccess={() => router.push("/images")}
            />
          </div>
          <ImageWithPrint src={image.imageUrl} alt={image.description} />
        </div>
      </main>
    </ImagePageLayout>
  );
}
