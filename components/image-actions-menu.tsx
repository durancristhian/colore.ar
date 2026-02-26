// image-actions-menu.tsx
//
// Print button + dropdown (download, copy image, copy URL, delete). Uses printImage context, downloadImage/blobToPng/buildImageDownloadFilename (utils), DeleteImageDialog. Refs for url/prompt to avoid stale closures in print.
//
"use client";

import { useEffect, useRef, useState } from "react";
import {
  DownloadIcon,
  DotsThreeIcon,
  ImageIcon,
  LinkIcon,
  PrinterIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DeleteImageDialog } from "@/components/delete-image-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrintImage } from "@/components/print-image-provider";
import { blobToPng } from "@/utils/blob-to-png";
import { buildImageDownloadFilename } from "@/utils/image-download-filename";
import { downloadImage } from "@/utils/download-image";

interface ImageActionsMenuProps {
  imageId: string;
  imageUrl: string;
  prompt: string;
  onDeleteSuccess?: () => void;
  variant?: React.ComponentProps<typeof Button>["variant"];
}

export function ImageActionsMenu({
  imageId,
  imageUrl,
  prompt,
  onDeleteSuccess,
  variant = "default",
}: ImageActionsMenuProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const printImage = usePrintImage();
  // Refs so print handler gets current url/prompt after async mount.
  const imageUrlRef = useRef(imageUrl);
  const promptRef = useRef(prompt);
  useEffect(() => {
    imageUrlRef.current = imageUrl;
    promptRef.current = prompt;
  }, [imageUrl, prompt]);

  function handlePrint(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (printImage) {
      printImage.printImage(imageUrlRef.current, promptRef.current);
    } else {
      window.print();
    }
  }

  function handleDownload() {
    downloadImage(imageUrl, buildImageDownloadFilename(prompt, new Date()));
  }

  async function handleCopyImage() {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
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

  function handleDeleteSelect() {
    setDeleteDialogOpen(true);
  }

  return (
    <>
      <ButtonGroup
        className="flex-1 w-full"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Button className="flex-1" variant={variant} onClick={handlePrint}>
          <PrinterIcon className="size-4" />
          Imprimir
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant={variant} aria-label="Más opciones">
              <DotsThreeIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-fit **:data-[slot=dropdown-menu-item]:whitespace-nowrap"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={handleDownload}>
                <DownloadIcon />
                Descargar
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleCopyImage}>
                <ImageIcon />
                Copiar imagen
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleCopyUrl}>
                <LinkIcon />
                Copiar URL de la imagen
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onSelect={handleDeleteSelect}
              >
                <TrashIcon />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <DeleteImageDialog
        imageId={imageId}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={onDeleteSuccess}
      />
    </>
  );
}
