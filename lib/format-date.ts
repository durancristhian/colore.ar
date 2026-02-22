export function formatCreatedAt(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    return date.toLocaleString();
  } catch {
    return createdAt;
  }
}
