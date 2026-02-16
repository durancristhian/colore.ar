import { NextRequest, NextResponse } from "next/server";
import { imageStore } from "@/lib/images/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string | string[] }> }
) {
  const { id: rawId } = await params;
  const id = Array.isArray(rawId) ? rawId.join("/") : rawId;
  const buffer = await imageStore.get(id);

  if (buffer == null) {
    return NextResponse.json({ error: "Preview not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": buffer.length.toString(),
    },
  });
}
