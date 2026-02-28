// providers.tsx
//
// Root providers: ThemeProvider (next-themes).
//
"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig, LazyMotion, domAnimation } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation}>{children}</LazyMotion>
      </MotionConfig>
    </ThemeProvider>
  );
}
