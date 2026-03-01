// api.ts
//
// Application API/Server Actions. Contains actions for: createImage, listImages, getImage, deleteImage, getCurrentUser, submitFeedback.
//
"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getOrCreateUser, type UserRole } from "@/lib/server/db/users";
import { ErrorCode, ErrorCodeType } from "@/lib/shared/errors";
import {
  insertImage,
  listImagesByUserId,
  getImageByIdAndUserId,
  deleteImageByIdAndUserId,
} from "@/lib/server/db/images";
import {
  isDescriptionLengthValid,
  isImageSizeValid,
  isImageTypeAllowed,
} from "@/lib/server/images/constants";
import { getImageGenerationOptions } from "@/lib/server/images/generation-mode";
import {
  generateImage,
  generateImageFromImage,
  generateImageWithPollinations,
} from "@/lib/server/images/generator";
import { imageStore } from "@/lib/server/images/store";
import { Telegram } from "@/lib/server/telegram";

export type CurrentUser = {
  id: string;
  role: UserRole;
};

export type CreateImageResponse = {
  id: string;
  url?: string;
};

export type ImageListItem = {
  id: string;
  description: string | null;
  imageUrl: string;
  sourceImageUrl?: string | null;
  createdAt: string; // ISO string representation
};

function getCloudinaryPublicUrl(publicId: string): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error(ErrorCode.SERVICE_UNAVAILABLE);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

/** SERVER ACTION: createImage */
export async function createImage(payload: {
  description: string;
  image?: File | null;
  usePaidModel?: boolean;
}): Promise<CreateImageResponse> {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  const user = await getOrCreateUser(userId);
  const role = user.role;

  const { usePaidModel: usePaid, allowImageFromImage } =
    getImageGenerationOptions(role, !!payload.usePaidModel);

  const hasImage =
    payload.image instanceof File &&
    payload.image.size > 0 &&
    payload.image.type.startsWith("image/");
  const hasDescription =
    typeof payload.description === "string" &&
    payload.description.trim() !== "";

  if (hasImage && hasDescription) {
    throw new Error(ErrorCode.INVALID_INPUT);
  }
  if (!hasImage && !hasDescription) {
    throw new Error(ErrorCode.INVALID_INPUT);
  }

  const id = crypto.randomUUID();
  /** Public IDs uploaded to Cloudinary in this request; deleted on failure for rollback. */
  const uploadedPublicIds: string[] = [];

  try {
    if (hasImage && payload.image instanceof File) {
      if (!allowImageFromImage) {
        throw new Error(ErrorCode.FORBIDDEN);
      }
      if (!isImageTypeAllowed(payload.image.type)) {
        throw new Error(ErrorCode.INVALID_IMAGE_TYPE);
      }
      if (!isImageSizeValid(payload.image.size)) {
        throw new Error(ErrorCode.IMAGE_TOO_LARGE);
      }

      const sourceBuffer = Buffer.from(await payload.image.arrayBuffer());
      const sourcePublicId = await imageStore.save(sourceBuffer);
      uploadedPublicIds.push(sourcePublicId);
      const sourceImageUrl = getCloudinaryPublicUrl(sourcePublicId);

      const buffer = await generateImageFromImage(sourceImageUrl);
      const publicId = await imageStore.save(buffer);
      uploadedPublicIds.push(publicId);
      const url = getCloudinaryPublicUrl(publicId);

      await insertImage({
        id,
        userId,
        description: null,
        imageUrl: url,
        sourceImageUrl,
      });

      revalidatePath("/imagenes");
      return { id, url };
    }

    const trimmedDescription = payload.description.trim();
    if (!isDescriptionLengthValid(trimmedDescription)) {
      throw new Error(ErrorCode.DESCRIPTION_TOO_LONG);
    }
    const buffer = usePaid
      ? await generateImage(trimmedDescription)
      : await generateImageWithPollinations(trimmedDescription);
    const publicId = await imageStore.save(buffer);
    uploadedPublicIds.push(publicId);
    const url = getCloudinaryPublicUrl(publicId);

    await insertImage({
      id,
      userId,
      description: trimmedDescription,
      imageUrl: url,
    });

    revalidatePath("/imagenes");
    return { id, url };
  } catch (error) {
    for (const publicId of uploadedPublicIds) {
      try {
        await imageStore.delete(publicId);
      } catch (deleteErr) {
        console.error(
          "Rollback: failed to delete uploaded image:",
          publicId,
          deleteErr,
        );
      }
    }
    console.error("Image creation failed:", error);
    const message = error instanceof Error ? error.message : String(error);

    // If it's already a known error code, rethrow it
    if (
      Object.values(ErrorCode).includes(message as unknown as ErrorCodeType)
    ) {
      throw error;
    }

    // Config errors (env vars missing)
    if (
      message.includes("OPEN_ROUTER") ||
      message.includes("POLLINATIONS_API_KEY") ||
      message.includes("CLOUDINARY")
    ) {
      throw new Error(ErrorCode.SERVICE_UNAVAILABLE);
    }

    throw new Error(ErrorCode.GENERIC_ERROR);
  }
}

/** SERVER ACTION/COMPONENT HELP: listImages */
export async function listImages(): Promise<ImageListItem[]> {
  const { userId } = await auth();
  if (!userId) throw new Error(ErrorCode.UNAUTHORIZED);

  const images = await listImagesByUserId(userId);
  return images.map((img) => ({
    ...img,
    createdAt: new Date(img.createdAt).toISOString(),
  }));
}

/** SERVER ACTION/COMPONENT HELP: getImage */
export async function getImage(id: string): Promise<ImageListItem> {
  const { userId } = await auth();
  if (!userId) throw new Error(ErrorCode.UNAUTHORIZED);

  const image = await getImageByIdAndUserId(id, userId);
  if (!image) throw new Error(ErrorCode.NOT_FOUND);

  return {
    ...image,
    createdAt: new Date(image.createdAt).toISOString(),
  };
}

/** SERVER ACTION: deleteImage */
export async function deleteImage(id: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error(ErrorCode.UNAUTHORIZED);

  const deleted = await deleteImageByIdAndUserId(id, userId);
  if (!deleted) throw new Error(ErrorCode.NOT_FOUND);

  revalidatePath("/imagenes");
}

/** SERVER ACTION/COMPONENT HELP: getCurrentUser */
export async function getCurrentUser(): Promise<CurrentUser> {
  const { userId } = await auth();
  if (!userId) throw new Error(ErrorCode.UNAUTHORIZED);

  const user = await getOrCreateUser(userId);
  return {
    id: user.userId,
    role: user.role,
  };
}

/** SERVER ACTION: submitFeedback */
export async function submitFeedback(message: string): Promise<void> {
  const [authResult, clUser] = await Promise.all([auth(), currentUser()]);
  const userId = authResult.userId;
  if (!userId || !clUser) throw new Error(ErrorCode.UNAUTHORIZED);

  const trimmedMessage = message.trim();
  if (!trimmedMessage) throw new Error(ErrorCode.INVALID_INPUT);

  const primaryEmail =
    clUser.emailAddresses.find(({ id }) => id === clUser.primaryEmailAddressId)
      ?.emailAddress ?? "";

  const formattedMessage = [
    `User Email: ${primaryEmail}`,
    `User id: ${userId}`,
    `Message: ${trimmedMessage}`,
  ].join("\n");

  try {
    const telegram = new Telegram();
    await telegram.sendMessage(formattedMessage);
  } catch (error) {
    console.error("Feedback send failed:", error);
    const message = error instanceof Error ? error.message : String(error);

    // If it's already a known error code, rethrow it
    if (
      Object.values(ErrorCode).includes(message as unknown as ErrorCodeType)
    ) {
      throw error;
    }

    if (message.includes("Configuración") || message.includes("ERR_")) {
      throw new Error(ErrorCode.FEEDBACK_UNAVAILABLE);
    }

    throw new Error(ErrorCode.GENERIC_ERROR);
  }
}
