"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type PrintImageContextValue = {
  printImage: (url: string, alt?: string) => void;
};

const PrintImageContext = createContext<PrintImageContextValue | null>(null);

export function PrintImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pending, setPending] = useState<{ url: string; alt: string } | null>(
    null,
  );

  const printImage = useCallback((url: string, alt = "") => {
    setPending({ url, alt });
  }, []);

  useEffect(() => {
    if (!pending) return;
    const id = setTimeout(() => {
      window.print();
      setPending(null);
    }, 0);
    return () => clearTimeout(id);
  }, [pending]);

  return (
    <PrintImageContext.Provider value={{ printImage }}>
      {children}
      <div className="print-only" aria-hidden>
        {pending ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={pending.url}
            alt={pending.alt}
            className="border-2 rounded-md"
          />
        ) : null}
      </div>
    </PrintImageContext.Provider>
  );
}

export function usePrintImage(): PrintImageContextValue | null {
  return useContext(PrintImageContext);
}
