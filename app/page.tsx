import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingContent } from "@/components/landing-content";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/imagenes");

  return (
    <div className="mx-auto w-full max-w-lg p-4 min-h-dvh">
      <LandingContent />
    </div>
  );
}
