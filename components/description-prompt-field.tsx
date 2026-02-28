// description-prompt-field.tsx
//
// Controlled textarea for image prompt; used in new-image and tabbed form.
// Shows destructive state and validation message only when over MAX_DESCRIPTION_LENGTH.
//
"use client";

import {
  MAX_DESCRIPTION_LENGTH,
  isDescriptionLengthValid,
} from "@/lib/server/images/constants";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface DescriptionPromptFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

export function DescriptionPromptField({
  value,
  onChange,
  disabled = false,
  id = "prompt",
}: DescriptionPromptFieldProps) {
  const overLimit = !isDescriptionLengthValid(value);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>¿Qué te gustaría crear?</Label>
      <Textarea
        id={id}
        rows={5}
        placeholder="Ejemplo: Una persona feliz con un perro sentado al lado. Montañas de fondo."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={overLimit}
        className="min-h-24 w-full"
      />
      {overLimit && (
        <p className="text-destructive text-sm" aria-live="polite">
          La descripción no puede superar los {MAX_DESCRIPTION_LENGTH}{" "}
          caracteres. Acortá un poco para continuar.
        </p>
      )}
    </div>
  );
}
