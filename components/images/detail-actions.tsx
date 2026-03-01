// detail-actions.tsx
//
// Wraps ImageActionsMenu for the image detail page. Redirects to /imagenes
// after successful delete so the user doesn't stay on a removed resource.
//
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
