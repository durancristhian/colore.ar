"use client";

import Link from "next/link";
import { HouseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-lg p-4 min-h-dvh flex flex-col items-center justify-center">
      <div className="min-h-[calc(100dvh-2rem)] flex flex-col items-center justify-center gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold">Página no encontrada</h1>
          <p className="text-muted-foreground">
            No encontramos la página que buscás.
          </p>
        </div>
        <Button asChild>
          <Link href="/" className="flex items-center gap-2">
            <HouseIcon className="size-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
