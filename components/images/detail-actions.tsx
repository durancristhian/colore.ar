"use client";

import { useRouter } from "next/navigation";
import { ImageActionsMenu } from "@/components/images/image-actions-menu";

export function DetailActionsMenu({
  imageId,
  imageUrl,
  prompt,
}: {
  imageId: string;
  imageUrl: string;
  prompt: string;
}) {
  const router = useRouter();

  return (
    <ImageActionsMenu
      imageId={imageId}
      imageUrl={imageUrl}
      prompt={prompt}
      onDeleteSuccess={() => router.push("/imagenes")}
    />
  );
}
