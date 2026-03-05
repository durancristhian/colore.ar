// new-image-form.tsx
//
// Main form for creating a new image. Standard users see only the text prompt;
// admin/vip can toggle "paid model" to get the tabbed form (text + image-from-file).
// Success: stores id in localStorage for confetti on the detail page, then redirects.
//
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { InfoIcon, SparkleIcon } from "@phosphor-icons/react/dist/ssr";
import { ErrorMessage } from "@/components/shared/error-message";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { DescriptionPromptField } from "@/components/forms/description-prompt-field";
import { TabbedGenerateForm } from "@/components/forms/tabbed-generate-form";
import { useUserContext } from "@/components/providers/user-provider";
import { createImage } from "@/lib/server/api";
import { isDescriptionLengthValid } from "@/lib/server/images/constants";
import { translateError } from "@/lib/shared/errors";

export function NewImageForm() {
  const router = useRouter();
  const { user: currentUser, refreshUser } = useUserContext();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const treatAsStandard = !currentUser || currentUser.role === "standard";
  const isAdminOrVip =
    !!currentUser &&
    (currentUser.role === "admin" || currentUser.role === "vip");

  const [usePaidModel, setUsePaidModel] = useState(false);
  const [description, setDescription] = useState("");

  // Standard: text only. Admin/VIP: text by default; tabbed (text + image upload) when paid model is on.
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
            // Refresh user to update credits in the header immediately.
            await refreshUser();
          } catch {
            // Ignore errors.
          }
          router.push(`/imagenes/${data.id}`);
        }
      } catch (err) {
        setError(translateError(err));
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
