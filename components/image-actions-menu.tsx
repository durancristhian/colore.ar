"use client";

import { useState } from "react";
import {
  CopyIcon,
  DownloadIcon,
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
import { buildImageDownloadFilename } from "@/utils/image-download-filename";
import { downloadImage } from "@/utils/download-image";

interface ImageActionsMenuProps {
  imageId: string;
  imageUrl: string;
  prompt: string;
  onDeleteSuccess?: () => void;
}

export function ImageActionsMenu({
  imageId,
  imageUrl,
  prompt,
  onDeleteSuccess,
}: ImageActionsMenuProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const printImage = usePrintImage();

  function handlePrint(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (printImage) {
      printImage.printImage(imageUrl, prompt);
    } else {
      window.print();
    }
  }

  function handleDownload() {
    downloadImage(imageUrl, buildImageDownloadFilename(prompt, new Date()));
  }

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(imageUrl);
      toast.success("URL copied to clipboard");
    } catch {
      toast.error("Could not copy URL");
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
        <Button variant="default" className="flex-1" onClick={handlePrint}>
          <PrinterIcon className="size-4" />
          Print
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon" aria-label="More options">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={handleDownload}>
                <DownloadIcon />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleCopyUrl}>
                <CopyIcon />
                Copy image URL
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onSelect={handleDeleteSelect}
              >
                <Trash2Icon />
                Delete
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
