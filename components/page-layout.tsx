import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageLayoutProps {
  title: string;
  backHref: string;
  children: React.ReactNode;
}

export function PageLayout({ title, backHref, children }: PageLayoutProps) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={backHref} aria-label="Volver">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <h1 className="font-semibold">{title}</h1>
      </div>
      {children}
    </div>
  );
}
