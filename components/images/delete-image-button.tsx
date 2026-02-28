// delete-image-button.tsx
//
// Button that opens DeleteImageDialog.
//
"use client";

import { useState } from "react";
import { TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { DeleteImageDialog } from "@/components/images/delete-image-dialog";

interface DeleteImageButtonProps {
  imageId: string;
  onSuccess?: () => void;
}

export function DeleteImageButton({
  imageId,
  onSuccess,
}: DeleteImageButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="destructive"
        size="icon-sm"
        className="size-9 p-2"
        aria-label="Eliminar imagen"
        onClick={() => setOpen(true)}
      >
        <TrashIcon className="size-4" />
      </Button>
      <DeleteImageDialog
        imageId={imageId}
        open={open}
        onOpenChange={setOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}
