"use client";

import { Button } from "@/components/ui/button";
import { buildImageDownloadFilename } from "@/utils/image-download-filename";
import { downloadImage } from "@/utils/download-image";

interface ImageWithActionsProps {
  src: string;
  /** Prompt used to generate the image; used as the img alt text for accessibility. */
  prompt: string;
  onPrint?: () => void;
}

export function ImageWithActions({
  src,
  prompt,
  onPrint = () => window.print(),
}: ImageWithActionsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Screen: styled image (hidden when printing via global print CSS) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={prompt}
        className="w-full rounded-md border object-contain"
      />
      {/* Print only: clean image (hidden on screen via .print-only display: none) */}
      <div className="print-only">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={prompt} className="border-2 rounded-md" />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          className="flex-1"
          onClick={() =>
            downloadImage(src, buildImageDownloadFilename(prompt, new Date()))
          }
        >
          Download
        </Button>
        <Button className="flex-1" onClick={onPrint}>
          Print
        </Button>
      </div>
    </div>
  );
}
