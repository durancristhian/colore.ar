import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageLayoutProps {
  title: string;
  backHref?: string;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({
  title,
  backHref = "/",
  showBackButton = true,
  rightContent,
  children,
}: PageLayoutProps) {
  return (
    <div className="w-full">
      <div className="mb-4 flex flex-1 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button variant="outline" size="icon" asChild>
              <Link href={backHref} aria-label="Volver">
                <ArrowLeftIcon />
              </Link>
            </Button>
          )}
          <h1 className="font-semibold">{title}</h1>
        </div>
        {rightContent != null ? <div>{rightContent}</div> : null}
      </div>
      {children}
    </div>
  );
}
