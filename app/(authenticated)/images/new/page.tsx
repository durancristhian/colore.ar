"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [activeTab, setActiveTab] = useState<Tab>("description");
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
        router.push(`/images/${data.id}`);
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
    <PageLayout title="New creation" backHref="/images">
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
              From an image
            </TabsTrigger>
            <TabsTrigger value="description">From a prompt</TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="flex flex-col gap-2 mt-4">
            {!selectedFile && (
              <>
                <label className="text-sm font-medium leading-none">
                  Choose an image to convert
                </label>
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
                  Select image
                </Button>
              </>
            )}
            {selectedFile && (
              <>
                <div className="flex items-center gap-2 rounded-md border bg-white p-2">
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
                    aria-label="Remove file"
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
                {!isImageFileValid(selectedFile) && (
                  <p className="text-sm text-destructive">
                    {!isImageTypeAllowed(selectedFile.type) &&
                    !isImageSizeValid(selectedFile.size)
                      ? "Image must be JPEG, PNG, WebP, or HEIC and at most 10MB."
                      : !isImageTypeAllowed(selectedFile.type)
                        ? "Image must be JPEG, PNG, WebP, or HEIC."
                        : "Image must be at most 10MB."}
                  </p>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="description" className="flex flex-col gap-2 mt-4">
            <label
              htmlFor="prompt"
              className="text-sm font-medium leading-none"
            >
              What would you like to create?
            </label>
            <Textarea
              id="prompt"
              rows={5}
              placeholder="A happy person with a dog sitting next to it. Mountains behind them."
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
          {isGenerating && <Spinner data-icon="inline-start" />}
          Generate
        </Button>

        {createMutation.isError && (
          <p className="text-sm text-destructive">
            Something went wrong. Please try again.
          </p>
        )}
      </main>
    </PageLayout>
  );
}
