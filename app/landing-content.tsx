"use client";

import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function LandingContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">print</h1>
      <SignedOut>
        <div className="flex gap-2">
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="secondary">Sign up</Button>
          </SignUpButton>
        </div>
      </SignedOut>
    </div>
  );
}
