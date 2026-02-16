import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between border-b pb-4">
        <Link
          href="/dashboard"
          className="text-xl font-semibold hover:underline"
        >
          Print
        </Link>
        <SignOutButton>
          <Button variant="outline">Log out</Button>
        </SignOutButton>
      </header>
      {children}
    </div>
  );
}
