// error.tsx
//
// Error boundary UI for route-level errors. Shows a message and "Intentar de nuevo" / "Volver al inicio".
//
"use client";
import Link from "next/link";
import { HouseIcon, ArrowClockwiseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function Error({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center p-4">
      <div className="flex min-h-[calc(100dvh-2rem)] flex-col items-center justify-center gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-6xl font-bold">Algo salió mal</h1>
          <p className="text-muted-foreground mx-auto max-w-sm">
            Ocurrió un error inesperado. No te preocupes: podés intentar de
            nuevo o volver al inicio y seguir desde ahí.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button onClick={() => reset()} className="flex items-center gap-2">
            <ArrowClockwiseIcon className="size-4" />
            Intentar de nuevo
          </Button>
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center gap-2">
              <HouseIcon className="size-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
