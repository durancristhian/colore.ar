// page.tsx
//
// New image page. Role-based: standard users get text-only form; admin/vip get switch for paid model
// and optional TabbedGenerateForm (image or description). On success, stores id in localStorage for
// confetti on detail page and redirects to /imagenes/:id.
//
import { PageLayout } from "@/components/layout/page-layout";
import { BackButton } from "@/components/layout/back-button";
import { getCurrentUser } from "@/lib/server/api";
import { NewImageForm } from "@/components/forms/new-image-form";

export default async function NewImagePage() {
  const currentUser = await getCurrentUser().catch(() => null);

  return (
    <PageLayout
      title="Nueva imagen"
      leftContent={<BackButton href="/imagenes" />}
    >
      <NewImageForm currentUser={currentUser} />
    </PageLayout>
  );
}
