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

export async function listImages(): Promise<ImageListItem[]> {
  const res = await fetch(`${base}/api/images`);
  if (!res.ok) throw new Error("No se pudieron cargar las imágenes.");
  return res.json();
}

export async function getImage(id: string): Promise<ImageListItem> {
  const res = await fetch(`${base}/api/images/${id}`);
  if (!res.ok) throw new Error("No se pudo cargar la imagen.");
  return res.json();
}

export async function deleteImage(id: string): Promise<void> {
  const res = await fetch(`${base}/api/images/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("No se pudo eliminar la imagen.");
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const res = await fetch(`${base}/api/user/me`);
  if (!res.ok) throw new Error("No se pudo cargar el usuario.");
  return res.json();
}

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
