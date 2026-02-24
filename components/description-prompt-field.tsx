"use client";

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
        className="min-h-24 w-full"
      />
    </div>
  );
}
