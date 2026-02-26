// landing-content.tsx
//
// Home hero and CTA. Shows sign-in button when loaded; placeholder while auth loads.
//
"use client";

import { SignInButton, SignedOut, useAuth } from "@clerk/nextjs";
import { SparkleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { SparklesText } from "@/components/ui/sparkles-text";

export function LandingContent() {
  const { isLoaded } = useAuth();
  return (
    <div className="flex min-h-[calc(100dvh-2rem)] flex-col items-center justify-center gap-8">
      <div className="space-y-2 text-center">
        <div>
          <SparklesText>
            <h1>Colore.ar</h1>
          </SparklesText>
        </div>
        <p className="text-muted-foreground">
          Dibujos para imprimir y pintar, hechos a tu medida.
        </p>
      </div>
      {!isLoaded ? (
        <div className="h-9" aria-hidden />
      ) : (
        <SignedOut>
          <SignInButton mode="modal">
            <Button>
              <SparkleIcon className="size-4" />
              Quiero crear mi imagen
            </Button>
          </SignInButton>
        </SignedOut>
      )}
    </div>
  );
}
