"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Sparkles, TrashIcon } from "lucide-react";
import { ErrorMessage } from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageLayout } from "@/components/page-layout";
import { createImage } from "@/lib/api";
import {
  ALLOWED_IMAGE_TYPES,
  isImageFromImageEnabled,
  isImageFileValid,
  isImageSizeValid,
  isImageTypeAllowed,
} from "@/lib/images/constants";

const imageFromImageEnabled = isImageFromImageEnabled();

type Tab = "image" | "description";

export default function NewImagePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>(() =>
    imageFromImageEnabled ? "image" : "description",
  );
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const createMutation = useMutation({
    mutationFn: createImage,
    onSuccess: (data) => {
      if (data.id) {
        try {
          localStorage.setItem("show-confetti", data.id);
        } catch {
          // ignore localStorage errors
        }
        router.push(`/imagenes/${data.id}`);
      }
    },
  });

  const isGenerating = createMutation.isPending;
  const disabled = isGenerating;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file?.type.startsWith("image/")) return;

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

    const isHeic = file.type === "image/heic" || file.type === "image/heif";
    let url: string;
    if (isHeic) {
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

  const canGenerate =
    activeTab === "image"
      ? selectedFile != null && isImageFileValid(selectedFile)
      : description.trim() !== "";

  const handleGenerate = () => {
    const payload =
      activeTab === "image" && selectedFile
        ? { description: "", image: selectedFile }
        : { description: description.trim(), image: null as File | null };
    createMutation.mutate(payload);
  };

  return (
    <PageLayout title="Nueva imagen" backHref="/imagenes">
      <main className="flex flex-col gap-4">
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            if (v === "image" && !imageFromImageEnabled) return;
            setActiveTab(v as Tab);
          }}
          defaultValue="description"
          className="gap-0"
        >
          <TabsList className="w-full">
            <TabsTrigger value="image" disabled={!imageFromImageEnabled}>
              Desde una foto
            </TabsTrigger>
            <TabsTrigger value="description">Desde texto</TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="flex flex-col gap-2 mt-4">
            {!selectedFile && (
              <>
                <Label>Elegí una imagen para convertir</Label>
                <input
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
                  Seleccionar imagen
                </Button>
              </>
            )}
            {selectedFile && (
              <>
                <div className="flex items-center gap-2 rounded-md border border-border bg-background p-2">
                  {previewUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={previewUrl}
                      alt={selectedFile.name}
                      className="size-16 shrink-0 rounded object-cover"
                    />
                  )}
                  <p
                    className="min-w-0 flex-1 truncate"
                    title={selectedFile.name}
                  >
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

          <TabsContent value="description" className="flex flex-col gap-2 mt-4">
            <Label htmlFor="prompt">¿Qué te gustaría crear?</Label>
            <Textarea
              id="prompt"
              rows={5}
              placeholder="Ejemplo: Una persona feliz con un perro sentado al lado. Montañas de fondo."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={disabled}
              className="min-h-24 w-full"
            />
          </TabsContent>
        </Tabs>

        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={disabled || !canGenerate}
        >
          {isGenerating ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isGenerating ? "Generando..." : "Generar"}
        </Button>

        {createMutation.isError && (
          <ErrorMessage
            title="Algo salió mal"
            description={
              createMutation.error?.message ??
              "Algo salió mal. Por favor, intentá de nuevo."
            }
          />
        )}
      </main>
    </PageLayout>
  );
}
