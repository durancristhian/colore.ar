// image-actions-menu.tsx
//
// Print button + dropdown (download, copy image, copy URL, delete). Uses useImageActions hook, printImage context, DeleteImageDialog. Refs for url/prompt to avoid stale closures in print.
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
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DeleteImageDialog } from "@/components/images/delete-image-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrintImage } from "@/components/layout/print-image-provider";
import { useImageActions } from "@/hooks/use-image-actions";

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
  const { handleDownload, handleCopyImage, handleCopyUrl } = useImageActions(
    imageUrl,
    prompt,
  );
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

  function handleDeleteSelect() {
    setDeleteDialogOpen(true);
  }

  return (
    <>
      <ButtonGroup
        className="w-full flex-1"
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
