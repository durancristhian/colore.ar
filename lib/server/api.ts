// api.ts
//
// Application API/Server Actions. Contains actions for: createImage, listImages, getImage, deleteImage, getCurrentUser, submitFeedback.
//
"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getOrCreateUser, type UserRole } from "@/lib/server/db/users";
import {
  insertImage,
  listImagesByUserId,
  getImageByIdAndUserId,
  deleteImageByIdAndUserId,
} from "@/lib/server/db/images";
import {
  ALLOWED_IMAGE_TYPES,
  isDescriptionLengthValid,
  isImageSizeValid,
  isImageTypeAllowed,
  MAX_DESCRIPTION_LENGTH,
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
  if (!cloudName) throw new Error("CLOUDINARY_CLOUD_NAME is not set");
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
    throw new Error("Enviá solo descripción o imagen, no ambos.");
  }
  if (!hasImage && !hasDescription) {
    throw new Error("Se requiere descripción o imagen.");
  }

  const id = crypto.randomUUID();

  try {
    if (hasImage && payload.image instanceof File) {
      if (!allowImageFromImage) {
        throw new Error("La generación desde imagen no está disponible.");
      }
      if (!isImageTypeAllowed(payload.image.type)) {
        throw new Error(
          `El tipo de imagen debe ser uno de: ${ALLOWED_IMAGE_TYPES.join(", ")}.`,
        );
      }
      if (!isImageSizeValid(payload.image.size)) {
        throw new Error("La imagen debe pesar como máximo 10MB.");
      }

      const sourceBuffer = Buffer.from(await payload.image.arrayBuffer());
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

      revalidatePath("/imagenes");
      return { id, url };
    }

    const trimmedDescription = payload.description.trim();
    if (!isDescriptionLengthValid(trimmedDescription)) {
      throw new Error(
        `La descripción no puede superar los ${MAX_DESCRIPTION_LENGTH} caracteres. Acortá un poco para continuar.`,
      );
    }
    const buffer = usePaid
      ? await generateImage(trimmedDescription)
      : await generateImageWithPollinations(trimmedDescription);
    const publicId = await imageStore.save(buffer);
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
    console.error("Image creation failed:", error);
    const message = error instanceof Error ? error.message : String(error);

    // Config errors (env vars missing)
    if (
      (message.includes("OPEN_ROUTER") &&
        message.includes("environment variable")) ||
      (message.includes("POLLINATIONS_API_KEY") &&
        message.includes("environment variable"))
    ) {
      throw new Error("La generación no está disponible en este momento.");
    }

    // Explicit validation messages we threw
    const knownErrors = [
      "Enviá",
      "Se requiere",
      "La generación desde",
      "El tipo de",
      "La imagen debe",
      "La descripción no",
    ];
    if (knownErrors.some((k) => message.includes(k))) {
      throw error;
    }

    throw new Error("Algo salió mal. Por favor, intentá de nuevo.");
  }
}

/** SERVER ACTION/COMPONENT HELP: listImages */
export async function listImages(): Promise<ImageListItem[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  const images = await listImagesByUserId(userId);
  return images.map((img) => ({
    ...img,
    createdAt: new Date(img.createdAt).toISOString(),
  }));
}

/** SERVER ACTION/COMPONENT HELP: getImage */
export async function getImage(id: string): Promise<ImageListItem> {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  const image = await getImageByIdAndUserId(id, userId);
  if (!image) throw new Error("Imagen no encontrada");

  return {
    ...image,
    createdAt: new Date(image.createdAt).toISOString(),
  };
}

/** SERVER ACTION: deleteImage */
export async function deleteImage(id: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  const deleted = await deleteImageByIdAndUserId(id, userId);
  if (!deleted) throw new Error("Imagen no encontrada");

  revalidatePath("/imagenes");
}

/** SERVER ACTION/COMPONENT HELP: getCurrentUser */
export async function getCurrentUser(): Promise<CurrentUser> {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

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
  if (!userId || !clUser) throw new Error("No autorizado");

  const trimmedMessage = message.trim();
  if (!trimmedMessage)
    throw new Error("message es requerido y debe ser un string no vacío");

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
    const msg = error instanceof Error ? error.message : String(error);

    if (msg.includes("Configuración")) {
      throw new Error("El feedback no está disponible temporalmente.");
    }

    throw new Error("Algo salió mal. Por favor, intentá de nuevo.");
  }
}
