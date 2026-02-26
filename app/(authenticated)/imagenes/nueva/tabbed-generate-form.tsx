// tabbed-generate-form.tsx
//
// Tabbed form for "Desde una foto" (file upload, HEIC→JPEG for preview) and "Desde texto". Validates
// with lib/images/constants; calls onGenerate with { description, image }. Used only when paid model is on.
//
"use client";

import { useId, useRef, useState } from "react";
import { ImageSquareIcon, SparkleIcon, TrashIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DescriptionPromptField } from "@/components/description-prompt-field";
import {
  ALLOWED_IMAGE_TYPES,
  isDescriptionLengthValid,
  isImageFileValid,
  isImageSizeValid,
  isImageTypeAllowed,
} from "@/lib/images/constants";
import { ErrorMessage } from "@/components/error-message";

type Tab = "image" | "description";

/** onGenerate receives { description, image }; disabled blocks submit and file picker. */
export interface TabbedGenerateFormProps {
  onGenerate: (payload: { description: string; image: File | null }) => void;
  disabled?: boolean;
}

export function TabbedGenerateForm({
  onGenerate,
  disabled = false,
}: TabbedGenerateFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>("image");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const fileInputId = useId();

  const canGenerate =
    activeTab === "image"
      ? selectedFile != null && isImageFileValid(selectedFile)
      : description.trim() !== "" && isDescriptionLengthValid(description);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file?.type.startsWith("image/")) return;

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

    const isHeic = file.type === "image/heic" || file.type === "image/heif";
    let url: string;
    if (isHeic) {
      // HEIC not supported for object URL preview; convert to JPEG for createObjectURL.
      const heic2any = (await import("heic2any")).default;
      const result = await heic2any({ blob: file, toType: "image/jpeg" });
      const blob = Array.isArray(result) ? result[0] : result;
      url = URL.createObjectURL(blob);
    } else {
      url = URL.createObjectURL(file);
    }

    previewUrlRef.current = url;
    setPreviewUrl(url);
    setSelectedFile(file);
  };

  const clearFile = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (activeTab === "image" && selectedFile) {
      onGenerate({ description: "", image: selectedFile });
    } else {
      onGenerate({ description: description.trim(), image: null });
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as Tab)}
      defaultValue="image"
      className="gap-0"
    >
      <TabsList className="w-full">
        <TabsTrigger value="image">Desde una foto</TabsTrigger>
        <TabsTrigger value="description">Desde texto</TabsTrigger>
      </TabsList>

      <TabsContent value="image" className="mt-4 flex flex-col gap-2">
        {!selectedFile && (
          <>
            <Label htmlFor={fileInputId}>Elegí una imagen</Label>
            <input
              id={fileInputId}
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(",")}
              onChange={handleFileChange}
              className="hidden"
              aria-hidden
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              <ImageSquareIcon className="size-4" />
              Seleccionar imagen
            </Button>
          </>
        )}
        {selectedFile && (
          <>
            <div className="border-border bg-background flex items-center gap-2 rounded-md border p-2">
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- blob URL preview; next/image not used for object URLs
                <img
                  src={previewUrl}
                  alt={selectedFile.name}
                  className="size-16 shrink-0 rounded object-cover"
                />
              )}
              <p className="min-w-0 flex-1 truncate" title={selectedFile.name}>
                {selectedFile.name}
              </p>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={clearFile}
                disabled={disabled}
                className="shrink-0"
                aria-label="Quitar archivo"
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
            {!isImageFileValid(selectedFile) && (
              <ErrorMessage
                variant="default"
                title="Imagen inválida"
                description={
                  !isImageTypeAllowed(selectedFile.type) &&
                  !isImageSizeValid(selectedFile.size)
                    ? "La imagen debe ser JPEG, PNG, WebP o HEIC y pesar como máximo 10MB."
                    : !isImageTypeAllowed(selectedFile.type)
                      ? "La imagen debe ser JPEG, PNG, WebP o HEIC."
                      : "La imagen debe pesar como máximo 10MB."
                }
              />
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="description" className="mt-4 flex flex-col gap-2">
        <DescriptionPromptField
          value={description}
          onChange={setDescription}
          disabled={disabled}
        />
      </TabsContent>

      <Button
        className="mt-4 w-full"
        onClick={handleSubmit}
        disabled={disabled || !canGenerate}
      >
        {disabled ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <SparkleIcon className="size-4" />
        )}
        {disabled ? "Generando..." : "Generar"}
      </Button>
    </Tabs>
  );
}
