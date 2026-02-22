import Link from "next/link";
import { HeaderUserMenu } from "@/components/header-user-menu";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between border-b pb-4">
        <Link href="/images" className="text-xl font-semibold hover:underline">
          Colore.ar
        </Link>
        <HeaderUserMenu />
      </header>
      {children}
    </div>
  );
}
