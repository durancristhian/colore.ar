// page.tsx
//
// Home page. Redirects signed-in users to /imagenes; otherwise renders LandingContent.
//
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingContent } from "@/components/landing-content";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/imagenes");

  return (
    <main id="main-content" className="mx-auto min-h-dvh w-full max-w-lg p-4">
      <LandingContent />
    </main>
  );
}
