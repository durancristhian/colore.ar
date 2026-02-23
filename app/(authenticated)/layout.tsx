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
      <div className="flex flex-col gap-4">
        <header className="flex items-center justify-between border-b pb-4">
          <Link href="/imagenes">
            <SparklesText as={<h1 />} className="text-xl font-black">
              Colore.ar
            </SparklesText>
          </Link>
          <HeaderUserMenu />
        </header>
        {children}
      </div>
    </PrintImageProvider>
  );
}
