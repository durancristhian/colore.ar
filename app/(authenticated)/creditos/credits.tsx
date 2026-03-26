"use client";

import { useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CoinVerticalIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  canPurchaseCredits,
  getCreditsMaxBalance,
  CREDITS_PER_PURCHASE,
} from "@/lib/credits/config";
import { useUserContext } from "@/components/providers/user-provider";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { createCreditPurchaseLink } from "@/lib/server/api";

export function Credits({ initialBalance = 0 }: { initialBalance?: number }) {
  const { user, isLoading, refreshUser } = useUserContext();
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast.success("¡Pago procesado con éxito!", {
        description: `Se están acreditando ${CREDITS_PER_PURCHASE} créditos a tu cuenta.`,
      });
      refreshUser();
      // Remove query param to prevent showing the toast again on reload
      window.history.replaceState(null, "", "/creditos");
    } else if (searchParams.get("payment") === "failure") {
      toast.error("Error en el pago", {
        description: "El pago no pudo ser completado.",
      });
      window.history.replaceState(null, "", "/creditos");
    }
  }, [searchParams, refreshUser]);

  // If loading or no user
  if (isLoading || !user) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-start md:justify-center">
        <Skeleton className="h-[240px] flex-1 rounded-xl" />
        <Skeleton className="h-[240px] flex-1 rounded-xl" />
      </div>
    );
  }

  const currentBalance = user.credits ?? initialBalance;
  const isPurchaseAllowed = canPurchaseCredits(currentBalance);
  const maxBalance = getCreditsMaxBalance();

  const handlePurchase = () => {
    startTransition(async () => {
      try {
        const url = await createCreditPurchaseLink();
        window.location.href = url;
      } catch (error) {
        toast.error("Error al generar el link de pago", {
          description:
            error instanceof Error
              ? error.message
              : "Intenta nuevamente más tarde.",
        });
      }
    });
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-start md:justify-center">
      {/* Balance Card */}
      <Card className="flex-1 gap-4 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 text-center dark:border-indigo-900 dark:from-indigo-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="text-muted-foreground flex items-center justify-center gap-2 text-xl">
            <CoinVerticalIcon
              className="size-6 text-amber-500"
              weight="duotone"
            />
            Saldo actual
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2 pb-8">
          <span className="text-6xl font-black text-indigo-600 dark:text-indigo-400">
            {currentBalance}
          </span>
          <span className="text-muted-foreground text-sm font-medium">
            ({maxBalance} máximo permitidos)
          </span>
        </CardContent>
      </Card>

      {/* Purchase Card */}
      <Card className="flex-1 gap-4">
        <CardHeader>
          <CardTitle>Comprar créditos</CardTitle>
          <CardDescription>
            Obtené créditos adicionales para seguir generando imágenes con los
            modelos premium de Inteligencia Artificial.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="bg-muted/50 flex items-center justify-between rounded-xl border p-4">
            <div className="flex items-center gap-2">
              <div className="bg-background rounded-lg p-2 shadow-sm">
                <CoinVerticalIcon
                  className="size-6 text-amber-500"
                  weight="duotone"
                />
              </div>
              <div>
                <h4 className="text-foreground font-semibold">
                  Pack de {CREDITS_PER_PURCHASE} créditos
                </h4>
                <p className="text-muted-foreground text-sm">
                  Generaciones premium
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold">1000$</span>
            </div>
          </div>

          <Button
            size="lg"
            disabled={!isPurchaseAllowed || isPending}
            onClick={handlePurchase}
          >
            {isPending ? (
              "Procesando..."
            ) : (
              <>
                <PlusIcon className="mr-2 size-5" weight="bold" />
                Comprar ahora
              </>
            )}
          </Button>

          {!isPurchaseAllowed && (
            <p className="text-center text-sm font-medium text-amber-600 dark:text-amber-500">
              No podes comprar más créditos porque el pack supera el limite
              maximo.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
