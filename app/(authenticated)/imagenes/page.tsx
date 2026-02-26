// page.tsx
//
// List of user images. Fetches via listImages; shows empty state or ImageCard list; "Nueva imagen" links to /imagenes/nueva.
//
"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ImageSquareIcon, PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ErrorMessage } from "@/components/error-message";
import { ImageCard } from "@/components/image-card";
import { LoadingMessage } from "@/components/loading-message";
import { PageLayout } from "@/components/page-layout";
import { listImages } from "@/lib/api";
import { DEFAULT_IMAGE_DESCRIPTION } from "@/lib/images/constants";
import { queryKeys } from "@/lib/query-keys";

export default function ImagesPage() {
  const {
    data: images,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.images.all,
    queryFn: listImages,
  });

  return (
    <PageLayout
      title="Tus imágenes"
      rightContent={
        <Button asChild size="sm" aria-label="Nueva imagen">
          <Link href="/imagenes/nueva" className="flex items-center gap-2">
            <PlusIcon className="size-4" />
            Nueva imagen
          </Link>
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {isLoading && <LoadingMessage label="Cargando imágenes..." />}

        {isError && (
          <ErrorMessage
            title="No se pudieron cargar las imágenes"
            description="Falló la carga. Intentá de nuevo."
          />
        )}

        {!isLoading && !isError && (!images || images.length === 0) && (
          <Empty className="border py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageSquareIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle>Aún no hay imágenes</EmptyTitle>
              <EmptyDescription>Creá tu imagen para colorear</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/imagenes/nueva">
                  <PlusIcon className="size-4" />
                  Nueva imagen
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}

        {!isLoading && !isError && images && images.length > 0 && (
          <div className="flex flex-col gap-4">
            {images.map((image) => (
              <ImageCard
                key={image.id}
                imageId={image.id}
                imageUrl={image.imageUrl}
                prompt={image.description ?? DEFAULT_IMAGE_DESCRIPTION}
                createdAt={image.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
