"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ImagePlus, Plus } from "lucide-react";
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
    <PageLayout
      title="Tus imágenes"
      showBackButton={false}
      rightContent={
        <Button asChild size="icon" aria-label="Nueva imagen">
          <Link href="/imagenes/nueva">
            <Plus className="size-4" />
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
                <ImagePlus className="size-6" />
              </EmptyMedia>
              <EmptyTitle>Aún no hay imágenes</EmptyTitle>
              <EmptyDescription>Creá tu imagen para colorear</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/imagenes/nueva">
                  <Plus className="size-4" />
                  Nueva imagen
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}

        {!isLoading && !isError && images && images.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <ImageCard
                key={image.id}
                imageId={image.id}
                imageUrl={image.imageUrl}
                prompt={image.description ?? "A partir de una imagen"}
                createdAt={image.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
