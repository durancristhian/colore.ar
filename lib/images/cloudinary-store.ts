// cloudinary-store.ts
//
// ImageStore implementation using Cloudinary unsigned upload (preset). save returns public_id for URL building (e.g. in the API).
//
import { v2 as cloudinary } from "cloudinary";
import type { ImageStore } from "./store";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
const apiKey = process.env.CLOUDINARY_API_KEY;

function getConfig() {
  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Missing Cloudinary env: CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET are required",
    );
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey ?? undefined,
    secure: true,
  });
  return { cloudName, uploadPreset };
}

/** save returns Cloudinary public_id (use to build public URLs); get fetches by that id and returns the buffer or null. */
export const cloudinaryStore: ImageStore = {
  async save(buffer: Buffer): Promise<string> {
    const { uploadPreset: preset } = getConfig();

    const result = await new Promise<{ public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.unsigned_upload_stream(
          preset,
          (error, uploadResult) => {
            if (error) return reject(error);
            if (!uploadResult?.public_id)
              return reject(new Error("No public_id in upload response"));
            resolve({ public_id: uploadResult.public_id });
          },
        );
        stream.end(buffer);
      },
    );

    return result.public_id;
  },

  async get(id: string): Promise<Buffer | null> {
    const { cloudName: name } = getConfig();
    if (!name) return null;

    const url = `https://res.cloudinary.com/${name}/image/upload/${id}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  },
};
