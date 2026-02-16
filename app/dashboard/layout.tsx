import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <Link
          href="/dashboard"
          className="text-xl font-semibold hover:underline"
        >
          print
        </Link>
        <SignOutButton>
          <Button variant="ghost">Log out</Button>
        </SignOutButton>
      </header>
      {children}
    </div>
  );
}
