// page.tsx
//
// Credits management page. Displays current balance and allows purchasing more.
//
"use client";

import { useState } from "react";
import { CoinVerticalIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLayout } from "@/components/layout/page-layout";
import { BackButton } from "@/components/layout/back-button";
import {
  canPurchaseCredits,
  getCreditsMaxBalance,
  CREDITS_PER_PURCHASE,
} from "@/lib/credits/config";

export default function CreditosPage() {
  // Mock current balance since DB integration is not yet done
  const [currentBalance, setCurrentBalance] = useState(0);

  const isPurchaseAllowed = canPurchaseCredits(currentBalance);
  const maxBalance = getCreditsMaxBalance();

  return (
    <PageLayout
      title="Mis Créditos"
      leftContent={<BackButton href="/imagenes" />}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-6 md:flex-row md:items-start md:justify-center">
        {/* Balance Card */}
        <Card className="flex-1 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 text-center dark:border-indigo-900 dark:from-indigo-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="text-muted-foreground flex items-center justify-center gap-2 text-xl">
              <CoinVerticalIcon
                className="size-6 text-indigo-500"
                weight="fill"
              />
              Saldo Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2 pb-8">
            <span className="text-6xl font-black text-indigo-600 dark:text-indigo-400">
              {currentBalance}
            </span>
            <span className="text-muted-foreground text-sm font-medium">
              / {maxBalance} máximo permitidos
            </span>
          </CardContent>
        </Card>

        {/* Purchase Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Comprar Créditos</CardTitle>
            <CardDescription>
              Obtené créditos adicionales para seguir generando imágenes con los
              modelos premium de Inteligencia Artificial.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="bg-muted/50 flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-background rounded-lg p-2 shadow-sm">
                  <CoinVerticalIcon
                    className="size-6 text-amber-500"
                    weight="duotone"
                  />
                </div>
                <div>
                  <h4 className="text-foreground font-semibold">
                    Pack de {CREDITS_PER_PURCHASE} Créditos
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
              className="text-md h-14 w-full"
              disabled={!isPurchaseAllowed}
            >
              <PlusIcon className="mr-2 size-5" weight="bold" />
              Comprar Ahora
            </Button>

            {!isPurchaseAllowed && (
              <p className="text-center text-sm font-medium text-amber-600 dark:text-amber-500">
                Has alcanzado el límite máximo de créditos ({maxBalance}).
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
