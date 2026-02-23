import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingContent } from "./landing-content";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/imagenes");

  return (
    <div className="mx-auto w-full max-w-lg p-4 min-h-screen">
      <LandingContent />
    </div>
  );
}
