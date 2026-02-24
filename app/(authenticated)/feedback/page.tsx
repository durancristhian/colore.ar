"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { PageLayout } from "@/components/page-layout";
import { submitFeedback } from "@/lib/api";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");

  const feedbackMutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      setMessage("");
      feedbackMutation.reset();
      toast.success("Gracias, tu feedback fue enviado.");
    },
    onError: (err) => {
      toast.error(
        err instanceof Error
          ? err.message
          : "Algo salió mal. Por favor, intentá de nuevo.",
      );
    },
  });

  const isSubmitting = feedbackMutation.isPending;
  const canSubmit = message.trim() !== "" && !isSubmitting;

  const handleSubmit = () => {
    feedbackMutation.mutateAsync(message.trim());
  };

  return (
    <PageLayout title="Enviar feedback" backHref="/imagenes">
      <main className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="feedback-message">¿Qué te gustaría contarnos?</Label>
          <Textarea
            id="feedback-message"
            rows={5}
            placeholder="Contanos tu experiencia, sugerencias o lo que quieras..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            className="min-h-24 w-full"
          />
        </div>
        <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit}>
          {isSubmitting ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <PaperPlaneRightIcon className="size-4" />
          )}
          {isSubmitting ? "Enviando..." : "Enviar feedback"}
        </Button>
      </main>
    </PageLayout>
  );
}
