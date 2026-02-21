import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { insertImage, listImagesByUserId } from "@/lib/db/images";
import {
  ALLOWED_IMAGE_TYPES,
  isImageFromImageEnabled,
  isImageSizeValid,
  isImageTypeAllowed,
} from "@/lib/images/constants";
import {
  generateImageForEnv,
  generateImageFromImage,
} from "@/lib/images/generator";
import { imageStore } from "@/lib/images/store";
import type { CreateImageResponse, ImageListItem } from "@/lib/images/types";

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
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          error:
            "Content-Type must be multipart/form-data with description and optional image.",
        },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const description = formData.get("description");
    const image = formData.get("image");

    const hasImage =
      image instanceof File &&
      image.size > 0 &&
      image.type.startsWith("image/");
    const hasDescription =
      typeof description === "string" && description.trim() !== "";

    if (hasImage && hasDescription) {
      return NextResponse.json(
        { error: "Send either description or image, not both." },
        { status: 400 },
      );
    }
    if (!hasImage && !hasDescription) {
      return NextResponse.json(
        { error: "Either description or image is required." },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();

    if (hasImage && image instanceof File) {
      if (!isImageFromImageEnabled()) {
        return NextResponse.json(
          { error: "Generation from image is not available." },
          { status: 403 },
        );
      }
      if (!isImageTypeAllowed(image.type)) {
        return NextResponse.json(
          {
            error: `Image type must be one of: ${ALLOWED_IMAGE_TYPES.join(", ")}.`,
          },
          { status: 400 },
        );
      }
      if (!isImageSizeValid(image.size)) {
        return NextResponse.json(
          { error: "Image size must be at most 10MB." },
          { status: 400 },
        );
      }

      const sourceBuffer = Buffer.from(await image.arrayBuffer());
      const sourcePublicId = await imageStore.save(sourceBuffer);
      const sourceImageUrl = getCloudinaryPublicUrl(sourcePublicId);

      const buffer = await generateImageFromImage(sourceImageUrl);
      const publicId = await imageStore.save(buffer);
      const url = getCloudinaryPublicUrl(publicId);

      await insertImage({
        id,
        userId,
        description: null,
        imageUrl: url,
        sourceImageUrl,
      });

      return NextResponse.json<CreateImageResponse>({ id, url });
    }

    const trimmedDescription = (description as string).trim();
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
          error: "Generation is not available right now.",
          details: message,
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
