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
    <div className="mx-auto w-full max-w-lg p-4 min-h-dvh flex flex-col items-center justify-center">
      <div className="min-h-[calc(100dvh-2rem)] flex flex-col items-center justify-center gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold">Algo salió mal</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Ocurrió un error inesperado. No te preocupes: podés intentar de
            nuevo o volver al inicio y seguir desde ahí.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
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
