import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { deletePreviewByIdAndUserId } from "@/lib/db/previews";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deletePreviewByIdAndUserId(id, userId);

  if (!deleted) {
    return NextResponse.json({ error: "Preview not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
