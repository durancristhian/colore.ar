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
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-border bg-muted/50">
          <div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 py-4">
            <Link href="/imagenes">
              <SparklesText className="text-xl">
                <p>Colore.ar</p>
              </SparklesText>
            </Link>
            <HeaderUserMenu />
          </div>
        </header>
        <div className="mx-auto w-full max-w-lg flex-1 p-4">{children}</div>
      </div>
    </PrintImageProvider>
  );
}
