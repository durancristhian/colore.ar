// page.tsx
//
// Credits management page.
//
import { PageLayout } from "@/components/layout/page-layout";
import { BackButton } from "@/components/layout/back-button";
import { DashboardCreditos } from "./dashboard-creditos";

export const metadata = {
  title: "Mis Créditos",
  description: "Administrá y comprá más créditos para colorear imágenes",
};

export default function CreditosPage() {
  return (
    <PageLayout
      title="Mis Créditos"
      leftContent={<BackButton href="/imagenes" />}
    >
      <DashboardCreditos initialBalance={0} />
    </PageLayout>
  );
}
