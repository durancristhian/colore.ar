"use client";

import { useEffect, useState } from "react";
import { ConfettiFireworks } from "@/components/confetti-fireworks";

const SHOW_CONFETTI_KEY = "show-confetti";

export function ConfettiHandler({ id }: { id: string }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!id) return;
    try {
      if (localStorage.getItem(SHOW_CONFETTI_KEY) === id) {
        queueMicrotask(() => setShowConfetti(true));
      }
    } catch {}
  }, [id]);

  const handleConfettiComplete = () => {
    try {
      localStorage.removeItem(SHOW_CONFETTI_KEY);
    } catch {}
    setShowConfetti(false);
  };

  if (!showConfetti) return null;
  return <ConfettiFireworks onComplete={handleConfettiComplete} />;
}
