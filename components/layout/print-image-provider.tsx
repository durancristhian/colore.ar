// print-image-provider.tsx
//
// Context that exposes printImage(url, alt). Portals a print-only image to body and triggers window.print on load; clears after CLEAR_PENDING_DELAY_MS.
//
"use client";

import {
  createContext,
  useCallback,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type PrintImageContextValue = {
  printImage: (url: string, alt?: string) => void;
};

const PrintImageContext = createContext<PrintImageContextValue | null>(null);

// Delay before clearing the portaled image so the print dialog can capture it.
const CLEAR_PENDING_DELAY_MS = 600;

export function PrintImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pending, setPending] = useState<{ url: string; alt: string } | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const clearPendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const printImage = useCallback((url: string, alt = "") => {
    if (clearPendingTimeoutRef.current) {
      clearTimeout(clearPendingTimeoutRef.current);
      clearPendingTimeoutRef.current = null;
    }
    setPending({ url, alt });
  }, []);

  const handleImageLoad = useCallback(() => {
    window.print();
    if (clearPendingTimeoutRef.current) {
      clearTimeout(clearPendingTimeoutRef.current);
    }
    clearPendingTimeoutRef.current = setTimeout(() => {
      setPending(null);
      clearPendingTimeoutRef.current = null;
    }, CLEAR_PENDING_DELAY_MS);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => {
      cancelAnimationFrame(id);
      if (clearPendingTimeoutRef.current) {
        clearTimeout(clearPendingTimeoutRef.current);
      }
    };
  }, []);

  const printOnlyNode = (
    <div className="print-only" aria-hidden>
      {pending ? (
        // eslint-disable-next-line @next/next/no-img-element -- portaled print-only image; next/image not used
        <img
          key={pending.url}
          src={pending.url}
          alt={pending.alt}
          className="rounded-md border-2"
          onLoad={handleImageLoad}
        />
      ) : null}
    </div>
  );

  return (
    <PrintImageContext.Provider value={{ printImage }}>
      {children}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(printOnlyNode, document.body)}
    </PrintImageContext.Provider>
  );
}

/** Returns context value or null when used outside provider. */
export function usePrintImage(): PrintImageContextValue | null {
  return use(PrintImageContext);
}
