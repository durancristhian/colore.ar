import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between border-b py-2">
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
