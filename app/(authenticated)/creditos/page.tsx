// page.tsx
//
// Credits management page.
//
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { BackButton } from "@/components/layout/back-button";
import { Credits } from "./credits";
import { getOrCreateUser } from "@/lib/server/db/users";

export default async function CreditosPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await getOrCreateUser(userId);

  if (user.role !== "standard") {
    notFound();
  }

  return (
    <PageLayout
      title="Mis créditos"
      leftContent={<BackButton href="/imagenes" />}
    >
      <Credits initialBalance={0} />
    </PageLayout>
  );
}
