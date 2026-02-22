"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePageLayout } from "@/components/image-page-layout";
import { submitFeedback } from "@/lib/api";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");

  const feedbackMutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      setMessage("");
    },
  });

  const isSubmitting = feedbackMutation.isPending;
  const canSubmit = message.trim() !== "" && !isSubmitting;

  const handleSubmit = () => {
    feedbackMutation.mutate(message.trim());
  };

  return (
    <ImagePageLayout title="Feedback" backHref="/images">
      <main className="flex flex-col gap-4">
        <label
          htmlFor="feedback-message"
          className="text-sm font-medium leading-none"
        >
          Your message
        </label>
        <Textarea
          id="feedback-message"
          rows={5}
          placeholder="Share your feedback, ideas, or report an issue…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
          className="min-h-24 w-full"
        />

        <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit}>
          {isSubmitting ? "Submitting feedback..." : "Submit feedback"}
        </Button>

        {feedbackMutation.isError && (
          <p className="text-sm text-destructive">
            {feedbackMutation.error instanceof Error
              ? feedbackMutation.error.message
              : "Something went wrong. Please try again."}
          </p>
        )}

        {feedbackMutation.isSuccess && (
          <p className="text-sm text-muted-foreground">
            Thanks, your feedback was sent.
          </p>
        )}
      </main>
    </ImagePageLayout>
  );
}
