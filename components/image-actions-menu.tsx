"use client";

import { useEffect, useRef, useState } from "react";
import {
  DownloadIcon,
  ImageIcon,
  Link2Icon,
  MoreHorizontalIcon,
  PrinterIcon,
  Trash2Icon,
} from "lucide-react";
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
  /** Button variant: "default" (primary) for details, "outline" for list cards. */
  variant?: "default" | "outline";
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
        <Button variant={variant} className="flex-1" onClick={handlePrint}>
          <PrinterIcon className="size-4" />
          Imprimir
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={variant} size="icon" aria-label="Más opciones">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
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
                <Link2Icon />
                Copiar URL de la imagen
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onSelect={handleDeleteSelect}
              >
                <Trash2Icon />
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
