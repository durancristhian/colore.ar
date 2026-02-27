// layout.tsx
//
// Layout for authenticated routes. Provides header (logo, HeaderUserMenu), PrintImageProvider,
// and main content area. Used by all routes under (authenticated).
//
import Link from "next/link";
import { HeaderUserMenu } from "@/components/header-user-menu";
import { PrintImageProvider } from "@/components/print-image-provider";
import { SparklesText } from "@/components/ui/sparkles-text";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <HeaderUserMenu />
          </div>
        </header>
        <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 p-4">
          {children}
        </main>
      </div>
    </PrintImageProvider>
  );
}
