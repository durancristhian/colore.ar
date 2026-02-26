// store.ts
//
// Abstraction for storing image buffers; save returns an identifier. Implementation in cloudinary-store.
//
/** save returns an id (e.g. Cloudinary public_id); get returns the buffer or null. */
export interface ImageStore {
  save(buffer: Buffer): Promise<string>;
  get(id: string): Promise<Buffer | null>;
}

export { cloudinaryStore as imageStore } from "./cloudinary-store";
