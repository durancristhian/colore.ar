import { AlertCircleIcon, AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ErrorMessageProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
  variant?: "destructive" | "default";
};

export function ErrorMessage({
  title,
  description,
  action,
  variant = "destructive",
}: ErrorMessageProps) {
  const Icon = variant === "destructive" ? AlertCircleIcon : AlertTriangleIcon;

  return (
    <Alert variant={variant}>
      <Icon className="size-4 shrink-0" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description}
        {action ? <span className="mt-2 block">{action}</span> : null}
      </AlertDescription>
    </Alert>
  );
}
