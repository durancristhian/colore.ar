/**
 * Image store interface. Implementations can be swapped (e.g. in-memory → Cloudinary + Turso).
 */
export interface ImageStore {
  save(buffer: Buffer): Promise<string>;
  get(id: string): Promise<Buffer | null>;
}

const storage = new Map<string, Buffer>();

/**
 * In-memory image store. Replace with Cloudinary (and optionally Turso for metadata) later.
 */
export const imageStore: ImageStore = {
  async save(buffer: Buffer): Promise<string> {
    const id = crypto.randomUUID();
    storage.set(id, buffer);
    return id;
  },

  async get(id: string): Promise<Buffer | null> {
    return storage.get(id) ?? null;
  },
};
