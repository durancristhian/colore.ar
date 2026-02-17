const base = "";

export type CreateImageResponse = {
  id: string;
  url?: string;
};

export type ImageListItem = {
  id: string;
  description: string;
  imageUrl: string;
  createdAt: string;
};

export async function createImage(
  description: string,
): Promise<CreateImageResponse> {
  const res = await fetch(`${base}/api/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  if (!res.ok) throw new Error("Something went wrong. Please try again.");
  return res.json();
}

export async function listImages(): Promise<ImageListItem[]> {
  const res = await fetch(`${base}/api/images`);
  if (!res.ok) throw new Error("Failed to load creations.");
  return res.json();
}

export async function getImage(id: string): Promise<ImageListItem> {
  const res = await fetch(`${base}/api/images/${id}`);
  if (!res.ok) throw new Error("Failed to load creation.");
  return res.json();
}

export async function deleteImage(id: string): Promise<void> {
  const res = await fetch(`${base}/api/images/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete creation.");
}
