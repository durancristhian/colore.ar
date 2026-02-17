"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePageLayout } from "@/components/image-page-layout";
import { ImageWithPrint } from "@/components/image-with-print";
import { createImage } from "@/lib/api";

export default function NewImagePage() {
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createImage,
    onSuccess: (data) => {
      setImageUrl(data.url ?? null);
    },
  });

  const isGenerating = createMutation.isPending;
  const disabled = isGenerating;

  return (
    <ImagePageLayout title="New image" backHref="/images">
      <main className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="prompt" className="text-sm font-medium leading-none">
            Describe the image you want to generate:
          </label>
          <Textarea
            id="prompt"
            rows={5}
            placeholder="A happy person with a dog sitting aside"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={disabled}
            className="min-h-24 w-full"
          />
        </div>

        {!imageUrl && (
          <Button
            className="w-full"
            onClick={() => createMutation.mutate(description)}
            disabled={disabled || !description.trim()}
          >
            {isGenerating ? "Generating…" : "Generate"}
          </Button>
        )}

        {imageUrl && <ImageWithPrint src={imageUrl} alt="Generated image" />}

        {createMutation.isError && (
          <p className="text-sm text-destructive">
            Failed to create image. Try again.
          </p>
        )}
      </main>
    </ImagePageLayout>
  );
}
