// cld-image.tsx
//
// Client wrapper for next-cloudinary CldImage. Accepts full Cloudinary URL or public ID; resolves via getPublicIdFromCloudinaryUrl.
// Supports thumbnail mode (explicit width/height, no fill) and detail mode (fill + 2× container sizes). Forwards crop/quality to next-cloudinary.
//
"use client";

import {
  CldImage as CldImageDefault,
  type CldImageProps,
} from "next-cloudinary";
import { clsx } from "clsx";
import { getPublicIdFromCloudinaryUrl } from "@/utils/cloudinary-url";

/** CldImage props plus wrapperClassName, wrapperBackgroundClassName, objectFit (contain | cover). */
export type CldImagePropsWithWrapper = Omit<CldImageProps, "fill" | "sizes"> & {
  wrapperClassName?: string;
  wrapperBackgroundClassName?: string;
  objectFit?: "contain" | "cover";
};

const DETAIL_SIZES = "(max-width: 1024px) 100vw, 1024px";
const DETAIL_QUALITY = "auto:good";

/** Renders CldImage in an aspect-ratio wrapper; resolves full Cloudinary URL to public ID.
 * When width and height are provided (thumbnail mode), requests that size from Cloudinary (e.g. 288×288 for 2× retina).
 * When not provided (detail mode), uses fill + sizes 1024px (2× container) + quality auto:good. */
export function CldImage(props: CldImagePropsWithWrapper) {
  const {
    wrapperClassName,
    wrapperBackgroundClassName,
    objectFit = "contain",
    width,
    height,
    crop,
    quality,
    ...rest
  } = props;
  const resolvedSrc = getPublicIdFromCloudinaryUrl(props.src) ?? props.src;

  const isThumbnail =
    width !== undefined &&
    height !== undefined &&
    Number(width) > 0 &&
    Number(height) > 0;

  return (
    <div
      className={clsx(
        "relative aspect-square w-full overflow-hidden bg-muted/50 print:bg-white",
        wrapperBackgroundClassName,
        wrapperClassName,
      )}
    >
      {isThumbnail ? (
        <CldImageDefault
          {...rest}
          src={resolvedSrc}
          width={width}
          height={height}
          crop={crop ?? "fill"}
          quality={quality ?? DETAIL_QUALITY}
          style={{ ...rest.style, objectFit }}
          loading="eager"
        />
      ) : (
        <CldImageDefault
          {...rest}
          src={resolvedSrc}
          fill
          sizes={DETAIL_SIZES}
          quality={quality ?? DETAIL_QUALITY}
          style={{ ...rest.style, objectFit }}
          loading="eager"
        />
      )}
    </div>
  );
}
