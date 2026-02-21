"use client";

import {
  CldImage as CldImageDefault,
  type CldImageProps,
} from "next-cloudinary";
import { clsx } from "clsx";
import { getPublicIdFromCloudinaryUrl } from "@/utils/cloudinary-url";

export type CldImagePropsWithWrapper = Omit<CldImageProps, "fill" | "sizes"> & {
  /** Extra classes for the aspect-ratio placeholder wrapper. */
  wrapperClassName?: string;
};

/**
 * Client wrapper for CldImage so it can be used from App Router pages
 * without marking those pages as client components.
 * Accepts full Cloudinary URLs or public IDs as src; resolves to public ID internally.
 * Always fills its wrapper (aspect-ratio box) to avoid layout shift. Requires src and alt.
 */
export function CldImage(props: CldImagePropsWithWrapper) {
  const { wrapperClassName, ...rest } = props;
  const resolvedSrc = getPublicIdFromCloudinaryUrl(props.src) ?? props.src;

  return (
    <div
      className={clsx(
        "relative aspect-square w-full overflow-hidden bg-white",
        wrapperClassName,
      )}
    >
      <CldImageDefault
        {...rest}
        src={resolvedSrc}
        fill
        objectFit="contain"
        sizes="(max-width: 1024px) 100vw, 512px"
      />
    </div>
  );
}
