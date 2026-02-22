"use client";

import { SignInButton, SignedOut } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SparklesText } from "@/components/ui/sparkles-text";

export function LandingContent() {
  return (
    <div className="min-h-[calc(100dvh-2rem)] flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-2">
        <div>
          <SparklesText as={<h1 />}>Colore.ar</SparklesText>
        </div>
        <p className="text-muted-foreground">Generate. Print. Paint.</p>
      </div>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>
            <Sparkles className="size-4" />
            Start creating
          </Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
