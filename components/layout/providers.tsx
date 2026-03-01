// providers.tsx
//
// Root client providers: theme (next-themes) and motion (Motion). LazyMotion loads
// only domAnimation to keep the bundle small; reducedMotion="user" respects
// prefers-reduced-motion for accessibility.
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
