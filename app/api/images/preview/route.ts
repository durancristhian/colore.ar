import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { insertPreview } from "@/lib/db/previews";
import { generateImage } from "@/lib/images/generator";
import { imageStore } from "@/lib/images/store";
import type { CreatePreviewRequest, CreatePreviewResponse } from "@/lib/images/types";

function getCloudinaryPublicUrl(publicId: string): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("CLOUDINARY_CLOUD_NAME is not set");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as unknown;
    const { description } = body as Partial<CreatePreviewRequest>;

    if (typeof description !== "string" || description.trim() === "") {
      return NextResponse.json(
        { error: "description is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const trimmedDescription = description.trim();
    const id = crypto.randomUUID();
    const buffer = await generateImage(trimmedDescription);
    const publicId = await imageStore.save(buffer);
    const url = getCloudinaryPublicUrl(publicId);

    await insertPreview({
      id,
      userId,
      description: trimmedDescription,
      previewUrl: url,
    });

    return NextResponse.json<CreatePreviewResponse>({ id, url });
  } catch (error) {
    console.error("Preview creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create preview" },
      { status: 500 }
    );
  }
}
