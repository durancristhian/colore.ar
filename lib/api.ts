const base = "";

export type CreatePreviewResponse = {
  id: string;
  url?: string;
};

export async function createPreview(
  description: string
): Promise<CreatePreviewResponse> {
  const res = await fetch(`${base}/api/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  if (!res.ok) throw new Error("Failed to create preview");
  return res.json();
}
