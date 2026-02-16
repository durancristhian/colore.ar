import { NextRequest, NextResponse } from "next/server";
import { getPreviewById } from "@/lib/db/previews";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const preview = await getPreviewById(id);

  if (preview == null) {
    return NextResponse.json({ error: "Preview not found" }, { status: 404 });
  }

  return NextResponse.redirect(preview.previewUrl, 302);
}
