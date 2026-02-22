"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfettiFireworks } from "@/components/confetti-fireworks";
import { DeleteImageButton } from "@/components/delete-image-button";
import { PageLayout } from "@/components/page-layout";
import { ImageWithActions } from "@/components/image-with-actions";
import { getImage } from "@/lib/api";
import { formatCreatedAt } from "@/lib/format-date";

const SHOW_CONFETTI_KEY = "show-confetti";

export default function ImageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const [showConfetti, setShowConfetti] = useState(false);

  const {
    data: image,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["image", id],
    queryFn: () => getImage(id),
    enabled: !!id,
  });

  // When we have the image and came from the new page, show confetti once then unmount
  useEffect(() => {
    if (!id || !image) return;
    try {
      if (localStorage.getItem(SHOW_CONFETTI_KEY) === id) {
        queueMicrotask(() => setShowConfetti(true));
      }
    } catch {
      // ignore localStorage errors
    }
  }, [id, image]);

  const handleConfettiComplete = () => {
    try {
      localStorage.removeItem(SHOW_CONFETTI_KEY);
    } catch {
      // ignore
    }
    setShowConfetti(false);
  };

  if (!id) {
    return (
      <PageLayout title="Creation details" backHref="/images">
        <p className="text-sm text-destructive">
          We didn&apos;t find the creation you&apos;re looking for.
        </p>
        <Link href="/images" className="text-sm underline">
          Back to creations
        </Link>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout title="Creation details" backHref="/images">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </PageLayout>
    );
  }

  if (isError || !image) {
    return (
      <PageLayout title="Creation details" backHref="/images">
        <p className="text-sm text-destructive">
          We didn&apos;t find the creation you&apos;re looking for.
        </p>
        <Link href="/images" className="text-sm underline">
          Back to creations
        </Link>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Creation details" backHref="/images">
      {showConfetti ? (
        <ConfettiFireworks onComplete={handleConfettiComplete} />
      ) : null}
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
    </PageLayout>
  );
}
