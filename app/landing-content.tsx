"use client";

import { SignInButton, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function LandingContent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Printar</h1>
        <p className="text-sm text-muted-foreground">Generate. Print. Paint.</p>
      </div>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Start creating</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
