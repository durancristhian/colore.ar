// page.tsx
//
// Image detail page. Fetches image by id; shows confetti once when arriving from create (SHOW_CONFETTI_KEY in localStorage). Delete redirects to /imagenes.
// Calls notFound() when the image is missing so the response is 404 and app/not-found.tsx is used.
//
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CldImage } from "@/components/images/cld-image";
import { Label } from "@/components/ui/label";
import { LoadingMessage } from "@/components/shared/loading-message";
import { PageLayout } from "@/components/layout/page-layout";
import { BackButton } from "@/components/layout/back-button";
import { getImage } from "@/lib/server/api";
import { DEFAULT_IMAGE_DESCRIPTION } from "@/lib/server/images/constants";
import { RelativeTime } from "@/components/images/relative-time";
import { ConfettiHandler } from "@/components/shared/confetti-handler";
import { DetailActionsMenu } from "@/components/images/detail-actions";

async function ImageDetail({ id }: { id: string }) {
  let image;
  try {
    image = await getImage(id);
  } catch {
    notFound();
  }

  if (!image) {
    notFound();
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
    notFound();
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
