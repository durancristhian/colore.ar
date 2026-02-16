"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createPreview } from "@/lib/api";

export default function Home() {
  const [description, setDescription] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createPreview,
    onSuccess: (data) => {
      setPreviewId(data.id);
      setPreviewUrl(data.url ?? null);
    },
  });

  const isGenerating = createMutation.isPending;
  const disabled = isGenerating;

  function handleClear() {
    setDescription("");
    setPreviewId(null);
    setPreviewUrl(null);
  }

  function handlePrint() {
    console.log("Print", { previewId, previewUrl });
  }

  return (
    <div className="w-full min-h-screen px-4 py-8">
      <main className="mx-auto max-w-lg flex flex-col gap-6">
        <h1 className="text-xl font-semibold">print</h1>

        <Textarea
          placeholder="Describe the image you want to generate..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={disabled}
          className="min-h-24 w-full"
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={() => createMutation.mutate(description)}
            disabled={disabled || !description.trim()}
          >
            {isGenerating ? "Generating…" : "Generate preview"}
          </Button>
          <Button variant="secondary" onClick={handleClear} disabled={disabled}>
            Clear
          </Button>
        </div>

        {previewUrl && (
          <div className="flex flex-col gap-4">
            <img
              src={previewUrl}
              alt="Generated preview"
              className="w-full rounded-md border object-contain"
            />
            <Button variant="outline" onClick={handlePrint}>
              Print
            </Button>
          </div>
        )}

        {createMutation.isError && (
          <p className="text-sm text-destructive">
            Failed to load preview. Try again.
          </p>
        )}
      </main>
    </div>
  );
}
