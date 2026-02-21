"use client";

import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ImagePageLayout } from "@/components/image-page-layout";
import { ImageWithActions } from "@/components/image-with-actions";
import { createImage } from "@/lib/api";

type Tab = "image" | "description";

export default function NewImagePage() {
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: createImage,
    onSuccess: (data) => {
      setImageUrl(data.url ?? null);
    },
  });

  const isGenerating = createMutation.isPending;
  const disabled = isGenerating;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
      setSelectedFile(file);
    }
    e.target.value = "";
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canGenerate =
    activeTab === "image" ? selectedFile != null : description.trim() !== "";

  const handleGenerate = () => {
    if (activeTab === "image" && selectedFile) {
      createMutation.mutate({ description: "", image: selectedFile });
    } else {
      createMutation.mutate({
        description: description.trim(),
        image: null,
      });
    }
  };

  return (
    <ImagePageLayout title="New creation" backHref="/images">
      <main className="flex flex-col gap-4">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as Tab)}
          defaultValue="description"
          className="gap-0"
        >
          <TabsList className="w-full">
            <TabsTrigger value="description">From a prompt</TabsTrigger>
            <TabsTrigger value="image">From an image</TabsTrigger>
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
                  accept="image/*"
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
              <div className="flex items-center gap-2 rounded-md border bg-white p-2">
                <p
                  className="min-w-0 flex-1 truncate text-sm"
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

        {!imageUrl && (
          <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={disabled || !canGenerate}
          >
            {isGenerating ? "Generating…" : "Generate"}
          </Button>
        )}

        {imageUrl && (
          <ImageWithActions src={imageUrl} prompt="Generated creation" />
        )}

        {createMutation.isError && (
          <p className="text-sm text-destructive">
            Something went wrong. Please try again.
          </p>
        )}
      </main>
    </ImagePageLayout>
  );
}
