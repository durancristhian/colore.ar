import { Spinner } from "@/components/ui/spinner";

type LoadingMessageProps = {
  label: string;
};

export function LoadingMessage({ label }: LoadingMessageProps) {
  return (
    <div className="flex w-full items-center justify-center gap-2 text-muted-foreground">
      <Spinner className="size-4 shrink-0" />
      <span>{label}</span>
    </div>
  );
}
