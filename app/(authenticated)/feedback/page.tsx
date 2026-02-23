"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="feedback-message">
            What would you like to tell us?
          </Label>
          <Textarea
            id="feedback-message"
            rows={5}
            placeholder="Share your feedback, ideas, or report an issue…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            className="min-h-24 w-full"
          />
        </div>
        <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit}>
          <Send className="size-4" />
          Send feedback
        </Button>
      </main>
    </PageLayout>
  );
}
