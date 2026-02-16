/**
 * Image store interface. Implementations can be swapped (e.g. Cloudinary + Turso for metadata).
 */
export interface ImageStore {
  save(buffer: Buffer): Promise<string>;
  get(id: string): Promise<Buffer | null>;
}

export { cloudinaryStore as imageStore } from "./cloudinary-store";
