"use client";

import { Button } from "@/components/ui/button";

interface ImageWithPrintProps {
  src: string;
  alt: string;
  onPrint?: () => void;
}

export function ImageWithPrint({
  src,
  alt,
  onPrint = () => window.print(),
}: ImageWithPrintProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Screen: styled image (hidden when printing via global print CSS) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full rounded-md border object-contain"
      />
      {/* Print only: clean image (hidden on screen via .print-only display: none) */}
      <div className="print-only">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="border-2 rounded-md" />
      </div>
      <Button className="w-full" onClick={onPrint}>Print</Button>
    </div>
  );
}
