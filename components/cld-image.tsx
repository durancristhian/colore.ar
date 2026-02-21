"use client";

import {
  CldImage as CldImageDefault,
  type CldImageProps,
} from "next-cloudinary";
import { getPublicIdFromCloudinaryUrl } from "@/utils/cloudinary-url";

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 800;

/**
 * Client wrapper for CldImage so it can be used from App Router pages
 * without marking those pages as client components.
 * Accepts full Cloudinary URLs or public IDs as src; resolves to public ID internally.
 * Defaults to 800x800; pass width/height to override. Requires src and alt.
 */
export function CldImage(props: CldImageProps) {
  const resolvedSrc = getPublicIdFromCloudinaryUrl(props.src) ?? props.src;
  return (
    <CldImageDefault
      width={DEFAULT_WIDTH}
      height={DEFAULT_HEIGHT}
      {...props}
      src={resolvedSrc}
    />
  );
}
