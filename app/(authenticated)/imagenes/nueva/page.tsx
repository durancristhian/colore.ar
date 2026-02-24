"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InfoIcon, SparkleIcon } from "@phosphor-icons/react";
import { ErrorMessage } from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/page-layout";
import { BackButton } from "@/components/back-button";
import { DescriptionPromptField } from "@/components/description-prompt-field";
import { TabbedGenerateForm } from "./tabbed-generate-form";
import { createImage, getCurrentUser } from "@/lib/api";

export default function NewImagePage() {
  const router = useRouter();
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", "me"],
    queryFn: getCurrentUser,
  });

  const treatAsStandard =
    isLoadingUser || !currentUser || currentUser.role === "standard";
  const isAdminOrVip =
    !!currentUser &&
    (currentUser.role === "admin" || currentUser.role === "vip");

  const [usePaidModel, setUsePaidModel] = useState(false);
  const [description, setDescription] = useState("");

  const createMutation = useMutation({
    mutationFn: createImage,
    onSuccess: (data) => {
      if (data.id) {
        try {
          localStorage.setItem("show-confetti", data.id);
        } catch {
          // ignore localStorage errors
        }
        router.push(`/imagenes/${data.id}`);
      }
    },
  });

  const isGenerating = createMutation.isPending;

  const showTextOnlyForm = treatAsStandard || (isAdminOrVip && !usePaidModel);
  const showTabbedForm = isAdminOrVip && usePaidModel;

  return (
    <PageLayout
      title="Nueva imagen"
      leftContent={<BackButton href="/imagenes" />}
    >
      <main className="flex flex-col gap-4">
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
              disabled={isGenerating}
            />
            <Button
              className="w-full"
              onClick={() =>
                createMutation.mutate({
                  description: description.trim(),
                  image: null,
                  usePaidModel: false,
                })
              }
              disabled={isGenerating || description.trim() === ""}
            >
              {isGenerating ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SparkleIcon className="size-4" />
              )}
              {isGenerating ? "Generando..." : "Generar"}
            </Button>
          </>
        )}

        {showTabbedForm && (
          <TabbedGenerateForm
            key="paid"
            onGenerate={(payload) =>
              createMutation.mutate({
                ...payload,
                usePaidModel: true,
              })
            }
            disabled={isGenerating}
          />
        )}

        {createMutation.isError && (
          <ErrorMessage
            title="Algo salió mal"
            description={
              createMutation.error?.message ??
              "Algo salió mal. Por favor, intentá de nuevo."
            }
          />
        )}
      </main>
    </PageLayout>
  );
}
