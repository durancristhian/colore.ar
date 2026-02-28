// page.tsx
//
// Feedback form page. Uses submitFeedback (lib/api).
//
"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { PaperPlaneRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { PageLayout } from "@/components/page-layout";
import { BackButton } from "@/components/back-button";
import { submitFeedback } from "@/lib/api";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const canSubmit = message.trim() !== "" && !isPending;

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        await submitFeedback(message.trim());
        setMessage("");
        toast.success("Gracias, tu feedback fue enviado.");
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Algo salió mal. Por favor, intentá de nuevo.",
        );
      }
    });
  };

  return (
    <PageLayout
      title="Enviar feedback"
      leftContent={<BackButton href="/imagenes" />}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="feedback-message">¿Qué te gustaría contarnos?</Label>
          <Textarea
            id="feedback-message"
            rows={5}
            placeholder="Contanos tu experiencia, sugerencias o lo que quieras..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isPending}
            className="min-h-24 w-full"
          />
        </div>
        <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit}>
          {isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <PaperPlaneRightIcon className="size-4" />
          )}
          {isPending ? "Enviando..." : "Enviar feedback"}
        </Button>
      </div>
    </PageLayout>
  );
}
