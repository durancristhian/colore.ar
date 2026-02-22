"use client";

import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

const DURATION_MS = 5 * 1000;
const DEFAULTS = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export interface ConfettiFireworksProps {
  onComplete?: () => void;
}

/**
 * Runs a fireworks confetti animation on mount for 5 seconds, then calls onComplete
 * so the parent can unmount (stop rendering) this component.
 */
export function ConfettiFireworks({ onComplete }: ConfettiFireworksProps) {
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const animationEnd = Date.now() + DURATION_MS;

    const intervalId = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(intervalId);
        onCompleteRef.current?.();
        return;
      }

      const particleCount = 50 * (timeLeft / DURATION_MS);
      confetti({
        ...DEFAULTS,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...DEFAULTS,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(intervalId);
  }, []);

  return null;
}
