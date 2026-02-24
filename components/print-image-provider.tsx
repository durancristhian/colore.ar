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
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={pending.url}
          src={pending.url}
          alt={pending.alt}
          className="border-2 rounded-md"
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

export function usePrintImage(): PrintImageContextValue | null {
  return use(PrintImageContext);
}
