// cld-image.tsx
//
// Client wrapper for next-cloudinary CldImage. Accepts full Cloudinary URL or public ID; resolves via getPublicIdFromCloudinaryUrl. Aspect-ratio wrapper to avoid layout shift.
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

/** Renders CldImage in an aspect-ratio wrapper; resolves full Cloudinary URL to public ID. */
export function CldImage(props: CldImagePropsWithWrapper) {
  const {
    wrapperClassName,
    wrapperBackgroundClassName,
    objectFit = "contain",
    ...rest
  } = props;
  const resolvedSrc = getPublicIdFromCloudinaryUrl(props.src) ?? props.src;

  return (
    <div
      className={clsx(
        "relative aspect-square w-full overflow-hidden bg-muted/50 print:bg-white",
        wrapperBackgroundClassName,
        wrapperClassName,
      )}
    >
      <CldImageDefault
        {...rest}
        src={resolvedSrc}
        fill
        style={{ ...rest.style, objectFit }}
        sizes="(max-width: 1024px) 100vw, 512px"
        loading="eager"
      />
    </div>
  );
}
