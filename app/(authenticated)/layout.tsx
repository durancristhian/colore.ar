// layout.tsx
//
// Layout for authenticated routes. Provides header (logo, HeaderUserMenu), PrintImageProvider,
// and main content area. Used by all routes under (authenticated).
//
import Link from "next/link";
import { Suspense } from "react";
import { HeaderUserMenu } from "@/components/header-user-menu";
import { PrintImageProvider } from "@/components/print-image-provider";
import { SparklesText } from "@/components/ui/sparkles-text";
import { getCurrentUser } from "@/lib/api";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser().catch(() => null);

  return (
    <PrintImageProvider>
      <div className="flex min-h-dvh flex-col">
        <header className="border-border bg-muted/50 border-b">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4">
            <Link href="/imagenes">
              <SparklesText className="font-serif text-xl">
                <p>Colore.ar</p>
              </SparklesText>
            </Link>
            <Suspense
              fallback={
                <div className="bg-muted size-8 animate-pulse rounded-full" />
              }
            >
              <HeaderUserMenu currentUser={currentUser} />
            </Suspense>
          </div>
        </header>
        <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 p-4">
          {children}
        </main>
      </div>
    </PrintImageProvider>
  );
}
