"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteImage } from "@/lib/api";

interface DeleteImageButtonProps {
  imageId: string;
  onSuccess?: () => void;
}

export function DeleteImageButton({
  imageId,
  onSuccess,
}: DeleteImageButtonProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      queryClient.invalidateQueries({ queryKey: ["image", imageId] });
      onSuccess?.();
    },
  });

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this creation?"))
      return;
    deleteMutation.mutate(imageId);
  }

  return (
    <Button
      variant="destructive"
      size="icon-sm"
      className="size-9 p-2"
      aria-label="Delete creation"
      onClick={handleClick}
      disabled={deleteMutation.isPending}
    >
      <TrashIcon className="size-4" />
    </Button>
  );
}
