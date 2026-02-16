const base = "";

export type CreatePreviewResponse = {
  id: string;
  url?: string;
};

export type GetPreviewResponse = {
  url: string;
};

export async function createPreview(
  description: string
): Promise<CreatePreviewResponse> {
  const res = await fetch(`${base}/api/images/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  if (!res.ok) throw new Error("Failed to create preview");
  return res.json();
}

/**
 * GET /api/images/preview/[id] returns raw PNG bytes (Content-Type: image/png), not JSON.
 * For displaying the image, use the `url` from the createPreview response as <img src={url} />.
 * Use res.blob() here if you need the image blob (e.g. for Print).
 */
export async function getPreview(id: string): Promise<GetPreviewResponse> {
  const res = await fetch(`${base}/api/images/preview/${id}`);
  if (!res.ok) throw new Error("Failed to get preview");
  return res.json();
}
