"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

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

  return (
    <PrintImageContext.Provider value={{ printImage }}>
      {children}
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
    </PrintImageContext.Provider>
  );
}

export function usePrintImage(): PrintImageContextValue | null {
  return useContext(PrintImageContext);
}
