import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { insertImage, listImagesByUserId } from "@/lib/db/images";
import { generateImageForEnv } from "@/lib/images/generator";
import { imageStore } from "@/lib/images/store";
import type {
  CreateImageRequest,
  CreateImageResponse,
  ImageListItem,
} from "@/lib/images/types";

function getCloudinaryPublicUrl(publicId: string): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("CLOUDINARY_CLOUD_NAME is not set");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const images: ImageListItem[] = await listImagesByUserId(userId);
  return NextResponse.json(images);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as unknown;
    const { description } = body as Partial<CreateImageRequest>;

    if (typeof description !== "string" || description.trim() === "") {
      return NextResponse.json(
        { error: "description is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    const trimmedDescription = description.trim();
    const id = crypto.randomUUID();
    const buffer = await generateImageForEnv(trimmedDescription);
    const publicId = await imageStore.save(buffer);
    const url = getCloudinaryPublicUrl(publicId);

    await insertImage({
      id,
      userId,
      description: trimmedDescription,
      imageUrl: url,
    });

    return NextResponse.json<CreateImageResponse>({ id, url });
  } catch (error) {
    console.error("Image creation failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    const isConfigError =
      (message.includes("OPEN_ROUTER") &&
        message.includes("environment variable")) ||
      (message.includes("POLLINATIONS_API_KEY") &&
        message.includes("environment variable"));
    if (isConfigError) {
      return NextResponse.json(
        {
          error: "Image generation is not configured",
          details: message,
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create image" },
      { status: 500 },
    );
  }
}
