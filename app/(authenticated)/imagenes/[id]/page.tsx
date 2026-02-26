// page.tsx
//
// Image detail page. Fetches image by id; shows confetti once when arriving from create (SHOW_CONFETTI_KEY in localStorage). Delete redirects to /imagenes.
//
"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfettiFireworks } from "@/components/confetti-fireworks";
import { CldImage } from "@/components/cld-image";
import { ErrorMessage } from "@/components/error-message";
import { ImageActionsMenu } from "@/components/image-actions-menu";
import { Label } from "@/components/ui/label";
import { LoadingMessage } from "@/components/loading-message";
import { PageLayout } from "@/components/page-layout";
import { BackButton } from "@/components/back-button";
import { getImage } from "@/lib/api";
import { DEFAULT_IMAGE_DESCRIPTION } from "@/lib/images/constants";
import { RelativeTime } from "@/components/relative-time";
import { queryKeys } from "@/lib/query-keys";

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
    queryKey: queryKeys.images.detail(id),
    queryFn: () => getImage(id),
    enabled: !!id,
  });

  // Show confetti once when coming from new-image flow (key set on create success).
  useEffect(() => {
    if (!id || !image) return;
    try {
      if (localStorage.getItem(SHOW_CONFETTI_KEY) === id) {
        queueMicrotask(() => setShowConfetti(true));
      }
    } catch {}
  }, [id, image]);

  const handleConfettiComplete = () => {
    try {
      localStorage.removeItem(SHOW_CONFETTI_KEY);
    } catch {
      // Ignore localStorage errors (e.g. private mode).
    }
    setShowConfetti(false);
  };

  if (!id) {
    return (
      <PageLayout
        title="Detalles de la imagen"
        leftContent={<BackButton href="/imagenes" />}
      >
        <ErrorMessage
          title="Imagen no encontrada"
          description="No encontramos la imagen que buscás."
          action={
            <Link href="/imagenes" className="text-sm underline">
              Volver a imágenes
            </Link>
          }
        />
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout
        title="Detalles de la imagen"
        leftContent={<BackButton href="/imagenes" />}
      >
        <LoadingMessage label="Cargando imagen..." />
      </PageLayout>
    );
  }

  if (isError || !image) {
    return (
      <PageLayout
        title="Detalles de la imagen"
        leftContent={<BackButton href="/imagenes" />}
      >
        <ErrorMessage
          title="Imagen no encontrada"
          description="No encontramos la imagen que buscás."
          action={
            <Link href="/imagenes" className="text-sm underline">
              Volver a imágenes
            </Link>
          }
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Detalles de la imagen"
      leftContent={<BackButton href="/imagenes" />}
    >
      {showConfetti ? (
        <ConfettiFireworks onComplete={handleConfettiComplete} />
      ) : null}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>{image.description ? "Lo que pediste" : "Origen"}</Label>
          <p>
            {image.description ? image.description : DEFAULT_IMAGE_DESCRIPTION}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Creado</Label>
          <p>
            <RelativeTime date={image.createdAt} />
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <CldImage
            src={image.imageUrl}
            alt={image.description ?? DEFAULT_IMAGE_DESCRIPTION}
            wrapperClassName="rounded-md border"
          />
          <ImageActionsMenu
            imageId={image.id}
            imageUrl={image.imageUrl}
            prompt={image.description ?? DEFAULT_IMAGE_DESCRIPTION}
            onDeleteSuccess={() => router.push("/imagenes")}
          />
        </div>
      </div>
    </PageLayout>
  );
}
