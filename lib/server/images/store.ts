// store.ts
//
// Abstraction for storing image buffers; save returns an identifier. Implementation in cloudinary-store.
//
/** save returns an id (e.g. Cloudinary public_id); get returns the buffer or null; delete removes by id (for rollback). */
export interface ImageStore {
  save(buffer: Buffer): Promise<string>;
  get(id: string): Promise<Buffer | null>;
  delete(id: string): Promise<void>;
}

export { cloudinaryStore as imageStore } from "./cloudinary-store";
