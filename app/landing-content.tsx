"use client";

import { SignInButton, SignedOut } from "@clerk/nextjs";
import { SparkleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { SparklesText } from "@/components/ui/sparkles-text";

export function LandingContent() {
  return (
    <div className="min-h-[calc(100dvh-2rem)] flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-2">
        <div>
          <SparklesText>
            <h1>Colore.ar</h1>
          </SparklesText>
        </div>
        <p className="text-muted-foreground">Generá. Imprimí. Pintá.</p>
      </div>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>
            <SparkleIcon className="size-4" />
            Quiero crear mi imagen
          </Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
