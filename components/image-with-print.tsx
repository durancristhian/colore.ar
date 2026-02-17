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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full rounded-md border object-contain print:block"
      />
      <Button onClick={onPrint}>Print</Button>
    </div>
  );
}
