"use client";

import {
  CldImage as CldImageDefault,
  type CldImageProps,
} from "next-cloudinary";
import { getPublicIdFromCloudinaryUrl } from "@/utils/cloudinary-url";
import { getShimmerDataUrl } from "@/utils/shimmer";

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 800;

/**
 * Client wrapper for CldImage so it can be used from App Router pages
 * without marking those pages as client components.
 * Accepts full Cloudinary URLs or public IDs as src; resolves to public ID internally.
 * Defaults to 800x800; pass width/height to override. Requires src and alt.
 * Shows a shimmer placeholder while loading; pass placeholder or blurDataURL to override.
 */
export function CldImage(props: CldImageProps) {
  const resolvedSrc = getPublicIdFromCloudinaryUrl(props.src) ?? props.src;
  const width = props.width ?? DEFAULT_WIDTH;
  const height = props.height ?? DEFAULT_HEIGHT;
  const placeholder =
    props.placeholder ??
    (!props.blurDataURL
      ? getShimmerDataUrl(
          Number(width) || DEFAULT_WIDTH,
          Number(height) || DEFAULT_HEIGHT,
        )
      : undefined);
  return (
    <CldImageDefault
      width={width}
      height={height}
      {...props}
      src={resolvedSrc}
      placeholder={placeholder as CldImageProps["placeholder"]}
    />
  );
}
