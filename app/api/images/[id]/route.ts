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
  const [authResult, { id }] = await Promise.all([auth(), params]);
  const userId = authResult.userId;
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const image = await getImageByIdAndUserId(id, userId);

  if (!image) {
    return NextResponse.json(
      { error: "Imagen no encontrada" },
      { status: 404 },
    );
  }

  return NextResponse.json(image);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [authResult, { id }] = await Promise.all([auth(), params]);
  const userId = authResult.userId;
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const deleted = await deleteImageByIdAndUserId(id, userId);

  if (!deleted) {
    return NextResponse.json(
      { error: "Imagen no encontrada" },
      { status: 404 },
    );
  }

  return new NextResponse(null, { status: 204 });
}
