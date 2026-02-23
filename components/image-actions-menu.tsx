"use client";

import { useState } from "react";
import {
  CopyIcon,
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

interface ImageActionsMenuProps {
  imageId: string;
  imageUrl: string;
  onDeleteSuccess?: () => void;
}

export function ImageActionsMenu({
  imageId,
  imageUrl,
  onDeleteSuccess,
}: ImageActionsMenuProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
        className="flex-1"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Button
          variant="default"
          className="flex-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.print();
          }}
        >
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
