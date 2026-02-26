// route.ts
//
// Returns the current user's id and role from the DB, creating the user if they don't exist yet.
//
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/db/users";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await getOrCreateUser(userId);
  return NextResponse.json({ id: user.userId, role: user.role });
}
