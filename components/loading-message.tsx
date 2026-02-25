import { Spinner } from "@/components/ui/spinner";

type LoadingMessageProps = {
  label: string;
};

export function LoadingMessage({ label }: LoadingMessageProps) {
  return (
    <div className="w-full space-y-2 text-center text-muted-foreground">
      <Spinner className="mx-auto block size-8 shrink-0" />
      <p>{label}</p>
    </div>
  );
}
