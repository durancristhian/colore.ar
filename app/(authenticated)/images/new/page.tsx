"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createPreview } from "@/lib/api";

export default function NewImagePage() {
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
    <div className="w-full">
      <div className="mb-4 flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/images">Back</Link>
        </Button>
        <h1 className="font-semibold">New image</h1>
      </div>
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

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="secondary" onClick={handleClear} disabled={disabled}>
            Clear
          </Button>
          <Button
            onClick={() => createMutation.mutate(description)}
            disabled={disabled || !description.trim()}
          >
            {isGenerating ? "Generating…" : "Generate"}
          </Button>
        </div>

        {previewUrl && (
          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Generated preview"
              className="w-full rounded-md border object-contain print:block"
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
