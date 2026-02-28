// loading-message.tsx
//
// Centered spinner + label for loading states.
//
import { Spinner } from "@/components/ui/spinner";

type LoadingMessageProps = {
  label: string;
};

export function LoadingMessage({ label }: LoadingMessageProps) {
  return (
    <div className="text-muted-foreground w-full space-y-2 text-center">
      <Spinner className="mx-auto block size-8 shrink-0" />
      <p>{label}</p>
    </div>
  );
}
