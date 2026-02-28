"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { InfoIcon, SparkleIcon } from "@phosphor-icons/react/dist/ssr";
import { ErrorMessage } from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { DescriptionPromptField } from "@/components/description-prompt-field";
import { TabbedGenerateForm } from "./tabbed-generate-form";
import { createImage } from "@/lib/api";
import { isDescriptionLengthValid } from "@/lib/images/constants";
import type { CurrentUser } from "@/lib/api";

export function NewImageForm({
  currentUser,
}: {
  currentUser: CurrentUser | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const treatAsStandard = !currentUser || currentUser.role === "standard";
  const isAdminOrVip =
    !!currentUser &&
    (currentUser.role === "admin" || currentUser.role === "vip");

  const [usePaidModel, setUsePaidModel] = useState(false);
  const [description, setDescription] = useState("");

  const showTextOnlyForm = treatAsStandard || (isAdminOrVip && !usePaidModel);
  const showTabbedForm = isAdminOrVip && usePaidModel;

  const handleGenerate = (payload: {
    description: string;
    image: File | null;
    usePaidModel: boolean;
  }) => {
    setError(null);
    startTransition(async () => {
      try {
        const data = await createImage(payload);
        if (data.id) {
          try {
            localStorage.setItem("show-confetti", data.id);
          } catch {
            // Ignore localStorage errors.
          }
          router.push(`/imagenes/${data.id}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Algo salió mal.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {isAdminOrVip && (
        <Alert>
          <InfoIcon className="size-4 shrink-0" aria-hidden />
          <AlertTitle>¿Usar modelo de pago?</AlertTitle>
          <AlertDescription className="gap-2">
            <p>
              La calidad va a ser excelente pero cada generación cuesta una
              moneda, así que usálo solo cuando sea necesario. Al activarlo
              también podés generar imágenes desde una foto, no solo desde
              texto.
            </p>
            <div className="flex items-center gap-2">
              <Switch
                id="use-paid-model"
                checked={usePaidModel}
                onCheckedChange={setUsePaidModel}
                disabled={isPending}
              />
              <Label htmlFor="use-paid-model">Sí, usar modelo de pago</Label>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {showTextOnlyForm && (
        <>
          <DescriptionPromptField
            value={description}
            onChange={setDescription}
            disabled={isPending}
          />
          <Button
            className="w-full"
            onClick={() =>
              handleGenerate({
                description: description.trim(),
                image: null,
                usePaidModel: false,
              })
            }
            disabled={
              isPending ||
              description.trim() === "" ||
              !isDescriptionLengthValid(description)
            }
          >
            {isPending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <SparkleIcon className="size-4" />
            )}
            {isPending ? "Generando..." : "Generar"}
          </Button>
        </>
      )}

      {showTabbedForm && (
        <TabbedGenerateForm
          key="paid"
          onGenerate={(payload) =>
            handleGenerate({
              ...payload,
              usePaidModel: true,
            })
          }
          disabled={isPending}
        />
      )}

      {error && <ErrorMessage title="Algo salió mal" description={error} />}
    </div>
  );
}
