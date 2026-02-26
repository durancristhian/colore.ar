// api.ts
//
// Client for app API routes. Exposes createImage, listImages, getImage, deleteImage, getCurrentUser, submitFeedback. Throws with server error message when res.ok is false.
//
import type { UserRole } from "@/lib/db/users";

const base = "";

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
  createdAt: string;
};

/** POST /api/images. Throws on non-ok with server error message. */
export async function createImage(payload: {
  description: string;
  image?: File | null;
  usePaidModel?: boolean;
}): Promise<CreateImageResponse> {
  const formData = new FormData();
  formData.append("description", payload.description ?? "");
  if (payload.image instanceof File) {
    formData.append("image", payload.image);
  }
  formData.append(
    "usePaidModel",
    payload.usePaidModel === true ? "true" : "false",
  );
  const res = await fetch(`${base}/api/images`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = typeof body?.error === "string" ? body.error : null;
    throw new Error(error ?? "Algo salió mal. Por favor, intentá de nuevo.");
  }
  return res.json();
}

/** GET /api/images. Throws on non-ok. */
export async function listImages(): Promise<ImageListItem[]> {
  const res = await fetch(`${base}/api/images`);
  if (!res.ok) throw new Error("No se pudieron cargar las imágenes.");
  return res.json();
}

/** GET /api/images/:id. Throws on non-ok. */
export async function getImage(id: string): Promise<ImageListItem> {
  const res = await fetch(`${base}/api/images/${id}`);
  if (!res.ok) throw new Error("No se pudo cargar la imagen.");
  return res.json();
}

/** DELETE /api/images/:id. Throws on non-ok. */
export async function deleteImage(id: string): Promise<void> {
  const res = await fetch(`${base}/api/images/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("No se pudo eliminar la imagen.");
}

/** GET /api/user/me. Throws on non-ok. */
export async function getCurrentUser(): Promise<CurrentUser> {
  const res = await fetch(`${base}/api/user/me`);
  if (!res.ok) throw new Error("No se pudo cargar el usuario.");
  return res.json();
}

/** POST /api/feedback. Throws on non-ok with server error message. */
export async function submitFeedback(message: string): Promise<void> {
  const res = await fetch(`${base}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = typeof body?.error === "string" ? body.error : null;
    throw new Error(error ?? "Algo salió mal. Por favor, intentá de nuevo.");
  }
}
