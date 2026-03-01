// use-image-actions.ts
//
// Shared handlers for download, copy image, and copy URL. Used by ImageActionsMenu
// and CldImage context menu. Copy image converts to PNG for clipboard compatibility.
//

import { toast } from "sonner";
import { blobToPng } from "@/lib/client/blob-to-png";
import { buildImageDownloadFilename } from "@/lib/shared/image-download-filename";
import { downloadImage } from "@/lib/client/download-image";

export function useImageActions(imageUrl: string, prompt: string) {
  function handleDownload() {
    downloadImage(imageUrl, buildImageDownloadFilename(prompt, new Date()));
  }

  async function handleCopyImage() {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      // ClipboardItem expects PNG for reliable paste in most apps.
      const pngBlob = blob.type === "image/png" ? blob : await blobToPng(blob);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob }),
      ]);
      toast.success("Imagen copiada al portapapeles");
    } catch {
      toast.error("No se pudo copiar la imagen");
    }
  }

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(imageUrl);
      toast.success("URL copiada al portapapeles");
    } catch {
      toast.error("No se pudo copiar la URL");
    }
  }

  return { handleDownload, handleCopyImage, handleCopyUrl };
}
