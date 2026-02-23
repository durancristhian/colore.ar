"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteImage } from "@/lib/api";

interface DeleteImageDialogProps {
  imageId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteImageDialog({
  imageId,
  open,
  onOpenChange,
  onSuccess,
}: DeleteImageDialogProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      queryClient.invalidateQueries({ queryKey: ["image", imageId] });
      onOpenChange(false);
      onSuccess?.();
    },
  });

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toast.promise(deleteMutation.mutateAsync(imageId), {
      loading: "Eliminando...",
      success: "Imagen eliminada.",
      error: (err) =>
        err instanceof Error
          ? err.message
          : "Algo salió mal. Por favor, intentá de nuevo.",
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará esta imagen de forma permanente. Esta acción no se
            puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
