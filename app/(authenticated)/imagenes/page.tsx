// page.tsx
//
// List of user images. Fetches via listImages; shows empty state or ImageCard list; "Nueva imagen" links to /imagenes/nueva.
//
import { Suspense } from "react";
import Link from "next/link";
import { ImageSquareIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ErrorMessage } from "@/components/shared/error-message";
import { ImageCard } from "@/components/images/image-card";
import { LoadingMessage } from "@/components/shared/loading-message";
import { PageLayout } from "@/components/layout/page-layout";
import { listImages } from "@/lib/server/api";
import { DEFAULT_IMAGE_DESCRIPTION } from "@/lib/server/images/constants";
import type { ImageListItem } from "@/lib/server/api";

async function ImagesList() {
  let images: ImageListItem[] | null = null;
  let isError = false;

  try {
    images = await listImages();
  } catch {
    isError = true;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="No se pudieron cargar las imágenes"
        description="Falló la carga. Intentá de nuevo."
      />
    );
  }

  if (!images || images.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
  );
}

export default function ImagesPage() {
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
        <Suspense fallback={<LoadingMessage label="Cargando imágenes..." />}>
          <ImagesList />
        </Suspense>
      </div>
    </PageLayout>
  );
}
