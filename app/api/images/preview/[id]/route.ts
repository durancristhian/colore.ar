import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPreviewByIdAndUserId } from "@/lib/db/previews";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const preview = await getPreviewByIdAndUserId(id, userId);

  if (preview == null) {
    return NextResponse.json({ error: "Preview not found" }, { status: 404 });
  }

  return NextResponse.redirect(preview.previewUrl, 302);
}
