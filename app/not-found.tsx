// not-found.tsx
//
// 404 page. Renders "Página no encontrada" and a link back to home.
//
import Link from "next/link";
import { HouseIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center p-4">
      <div className="flex min-h-[calc(100dvh-2rem)] flex-col items-center justify-center gap-8">
        <div className="space-y-2 text-center">
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
