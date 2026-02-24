import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  "aria-label"?: string;
  className?: string;
}

export function BackButton({
  href,
  "aria-label": ariaLabel = "Volver",
  className,
}: BackButtonProps) {
  return (
    <Button variant="outline" size="icon" asChild className={className}>
      <Link href={href} aria-label={ariaLabel}>
        <ArrowLeftIcon />
      </Link>
    </Button>
  );
}
