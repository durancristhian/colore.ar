"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    },
  });

  const isSubmitting = feedbackMutation.isPending;
  const canSubmit = message.trim() !== "" && !isSubmitting;

  const handleSubmit = () => {
    toast.promise(feedbackMutation.mutateAsync(message.trim()), {
      loading: "Sending feedback...",
      success: "Thanks, your feedback was sent.",
      error: (err) =>
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
    });
  };

  return (
    <PageLayout title="Send feedback" backHref="/images">
      <main className="flex flex-col gap-4">
        <label
          htmlFor="feedback-message"
          className="text-sm font-medium leading-none"
        >
          What would you like to tell us?
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
          <Send className="size-4" />
          Send feedback
        </Button>
      </main>
    </PageLayout>
  );
}
