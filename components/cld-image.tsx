// cld-image.tsx
//
// Client wrapper for next-cloudinary CldImage. Accepts full Cloudinary URL or public ID; resolves via getPublicIdFromCloudinaryUrl.
// Supports thumbnail mode (explicit width/height, no fill) and detail mode (fill + 2× container sizes). Forwards crop/quality to next-cloudinary.
// Right-click context menu: download, copy image, copy URL (useImageActions). Optional promptForDownload for download filename.
//
"use client";

import {
  CldImage as CldImageDefault,
  type CldImageProps,
} from "next-cloudinary";
import {
  DownloadIcon,
  ImageIcon,
  LinkIcon,
} from "@phosphor-icons/react/dist/ssr";
import { clsx } from "clsx";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useImageActions } from "@/hooks/use-image-actions";
import { getPublicIdFromCloudinaryUrl } from "@/lib/cloudinary-url";

/** CldImage props plus wrapperClassName, wrapperBackgroundClassName, objectFit (contain | cover), promptForDownload (optional, for context menu download filename). */
export type CldImagePropsWithWrapper = Omit<CldImageProps, "fill" | "sizes"> & {
  wrapperClassName?: string;
  wrapperBackgroundClassName?: string;
  objectFit?: "contain" | "cover";
  promptForDownload?: string;
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
    promptForDownload,
    ...rest
  } = props;
  const resolvedSrc = getPublicIdFromCloudinaryUrl(props.src) ?? props.src;
  const { handleDownload, handleCopyImage, handleCopyUrl } = useImageActions(
    props.src,
    promptForDownload ?? props.alt ?? "",
  );

  const isThumbnail =
    width !== undefined &&
    height !== undefined &&
    Number(width) > 0 &&
    Number(height) > 0;

  return (
    <div
      className="contents"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={clsx(
              "bg-muted/50 relative aspect-square w-full overflow-hidden print:bg-white",
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
        </ContextMenuTrigger>
        <ContextMenuContent
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <ContextMenuItem onSelect={handleDownload}>
            <DownloadIcon />
            Descargar
          </ContextMenuItem>
          <ContextMenuItem onSelect={handleCopyImage}>
            <ImageIcon />
            Copiar imagen
          </ContextMenuItem>
          <ContextMenuItem onSelect={handleCopyUrl}>
            <LinkIcon />
            Copiar URL de la imagen
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
