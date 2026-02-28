// page.tsx
//
// Image detail page. Fetches image by id; shows confetti once when arriving from create (SHOW_CONFETTI_KEY in localStorage). Delete redirects to /imagenes.
//
import Link from "next/link";
import { Suspense } from "react";
import { CldImage } from "@/components/cld-image";
import { ErrorMessage } from "@/components/error-message";
import { Label } from "@/components/ui/label";
import { LoadingMessage } from "@/components/loading-message";
import { PageLayout } from "@/components/page-layout";
import { BackButton } from "@/components/back-button";
import { getImage } from "@/lib/api";
import { DEFAULT_IMAGE_DESCRIPTION } from "@/lib/images/constants";
import { RelativeTime } from "@/components/relative-time";
import { ConfettiHandler } from "./confetti-handler";
import { DetailActionsMenu } from "./detail-actions";

async function ImageDetail({ id }: { id: string }) {
  let image;
  try {
    image = await getImage(id);
  } catch {
    return (
      <ErrorMessage
        title="Imagen no encontrada"
        description="No encontramos la imagen que buscás."
        action={
          <Link href="/imagenes" className="text-sm underline">
            Volver a imágenes
          </Link>
        }
      />
    );
  }

  if (!image) {
    return (
      <ErrorMessage
        title="Imagen no encontrada"
        description="No encontramos la imagen que buscás."
        action={
          <Link href="/imagenes" className="text-sm underline">
            Volver a imágenes
          </Link>
        }
      />
    );
  }

  return (
    <>
      <ConfettiHandler id={id} />
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
          <DetailActionsMenu
            imageId={image.id}
            imageUrl={image.imageUrl}
            prompt={image.description ?? DEFAULT_IMAGE_DESCRIPTION}
          />
        </div>
      </div>
    </>
  );
}

export default async function ImageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

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

  return (
    <PageLayout
      title="Detalles de la imagen"
      leftContent={<BackButton href="/imagenes" />}
    >
      <Suspense fallback={<LoadingMessage label="Cargando imagen..." />}>
        <ImageDetail id={id} />
      </Suspense>
    </PageLayout>
  );
}
