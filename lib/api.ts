const base = "";

export type CreatePreviewResponse = {
  id: string;
  url?: string;
};

export type PreviewListItem = {
  id: string;
  description: string;
  previewUrl: string;
  createdAt: string;
};

export async function createPreview(
  description: string,
): Promise<CreatePreviewResponse> {
  const res = await fetch(`${base}/api/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  if (!res.ok) throw new Error("Failed to create preview");
  return res.json();
}

export async function listPreviews(): Promise<PreviewListItem[]> {
  const res = await fetch(`${base}/api/images`);
  if (!res.ok) throw new Error("Failed to list previews");
  return res.json();
}
