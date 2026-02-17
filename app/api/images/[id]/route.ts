import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  deleteImageByIdAndUserId,
  getImageByIdAndUserId,
} from "@/lib/db/images";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const image = await getImageByIdAndUserId(id, userId);

  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  return NextResponse.json(image);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteImageByIdAndUserId(id, userId);

  if (!deleted) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
