"use client";

import { SignInButton, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function LandingContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">print</h1>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
