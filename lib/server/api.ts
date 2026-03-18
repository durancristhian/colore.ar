// api.ts
//
// Server Actions for the app: createImage, listImages, getImage, deleteImage,
// getCurrentUser, submitFeedback. All image actions are user-scoped (Clerk userId).
// createImage rolls back Cloudinary uploads on failure; errors are normalized
// to ErrorCode for the UI (see lib/shared/errors).
//
"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { env } from "@/lib/env.server";
import { getOrCreateUser, type UserRole } from "@/lib/server/db/users";
import { ErrorCode, ErrorCodeType } from "@/lib/shared/errors";
import { getDb } from "@/lib/server/db/client";
import {
  insertImage,
  listImagesByUserId,
  getImageByIdAndUserId,
  deleteImageByIdAndUserId,
  ensureImagesTable,
} from "@/lib/server/db/images";
import { ensureCreditsTable, recordTransaction } from "@/lib/server/db/credits";
import { canPurchaseCredits, CREDITS_PER_PURCHASE } from "@/lib/credits/config";
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
  credits: number | null;
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

/** Builds the public CDN URL for a Cloudinary image from its public_id. */
function getCloudinaryPublicUrl(publicId: string): string {
  return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
}

/**
 * Creates an image (text-to-image or image-to-image). Role and usePaidModel
 * determine which backend is used; on failure, any Cloudinary uploads from this
 * request are deleted for rollback.
 */
export async function createImage(payload: {
  description: string;
  image?: File | null;
  usePaidModel?: boolean;
}): Promise<CreateImageResponse> {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  // Ensure tables exist before the batch
  await Promise.all([ensureImagesTable(), ensureCreditsTable()]);

  const user = await getOrCreateUser(userId);
  const role = user.role;
  const isPro = !!payload.usePaidModel;

  const { usePaidModel: usePaid, allowImageFromImage } =
    getImageGenerationOptions(role, user.credits ?? 0, isPro);

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
  // Track uploads so we can delete them on failure (rollback).
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

      const now = new Date().toISOString();
      const db = getDb();
      await db.batch([
        {
          sql: `INSERT INTO images (id, user_id, description, image_url, source_image_url, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [id, userId, null, url, sourceImageUrl, now, now],
        },
        ...(usePaid
          ? [
              {
                sql: "INSERT INTO credit_transactions (id, user_id, amount, type, description) VALUES (?, ?, ?, ?, ?)",
                args: [
                  crypto.randomUUID(),
                  userId,
                  -1,
                  "usage",
                  `Generación Pro (ID: ${id})`,
                ],
              },
            ]
          : []),
      ]);

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

    const now = new Date().toISOString();
    const db = getDb();
    await db.batch([
      {
        sql: `INSERT INTO images (id, user_id, description, image_url, source_image_url, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [id, userId, trimmedDescription, url, null, now, now],
      },
      ...(usePaid
        ? [
            {
              sql: "INSERT INTO credit_transactions (id, user_id, amount, type, description) VALUES (?, ?, ?, ?, ?)",
              args: [
                crypto.randomUUID(),
                userId,
                -1,
                "usage",
                `Generación Pro (ID: ${id})`,
              ],
            },
          ]
        : []),
    ]);

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

/** Returns all images for the current user, newest first. ISO date strings. */
export async function listImages(): Promise<ImageListItem[]> {
  const { userId } = await auth();
  if (!userId) throw new Error(ErrorCode.UNAUTHORIZED);

  const images = await listImagesByUserId(userId);
  return images.map((img) => ({
    ...img,
    createdAt: new Date(img.createdAt).toISOString(),
  }));
}

/** Returns a single image by id if owned by the current user; throws NOT_FOUND otherwise. */
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

/** Deletes the image if owned by the current user; throws NOT_FOUND if missing or not owned. */
export async function deleteImage(id: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error(ErrorCode.UNAUTHORIZED);

  const deleted = await deleteImageByIdAndUserId(id, userId);
  if (!deleted) throw new Error(ErrorCode.NOT_FOUND);

  revalidatePath("/imagenes");
}

/** Returns current user id and role (from DB); throws if not signed in. */
export async function getCurrentUser(): Promise<CurrentUser> {
  const { userId } = await auth();
  if (!userId) throw new Error(ErrorCode.UNAUTHORIZED);

  const user = await getOrCreateUser(userId);
  return {
    id: user.userId,
    role: user.role,
    credits: user.role === "standard" ? user.credits : null,
  };
}

/** Sends feedback to Telegram (user email, id, message). Throws on missing auth or send failure. */
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
    const errorMessage = error instanceof Error ? error.message : String(error);

    // If it's already a known error code, rethrow it
    if (
      Object.values(ErrorCode).includes(
        errorMessage as unknown as ErrorCodeType,
      )
    ) {
      throw error;
    }

    if (
      errorMessage.includes("Configuración") ||
      errorMessage.includes("ERR_")
    ) {
      throw new Error(ErrorCode.FEEDBACK_UNAVAILABLE);
    }

    throw new Error(ErrorCode.GENERIC_ERROR);
  }
}

/**
 * Purchases credits for the current user. Validates that the user can purchase
 * more credits according to max balance rules.
 */
export async function purchaseCredits(): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error(ErrorCode.UNAUTHORIZED);

  const user = await getOrCreateUser(userId);
  const currentBalance = user.credits ?? 0;

  if (!canPurchaseCredits(currentBalance)) {
    throw new Error(ErrorCode.FORBIDDEN);
  }

  await recordTransaction({
    userId,
    amount: CREDITS_PER_PURCHASE,
    type: "purchase",
    description: "Compra de pack de créditos",
  });

  revalidatePath("/creditos");
  revalidatePath("/imagenes");
}
