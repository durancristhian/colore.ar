import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ImagePageLayoutProps {
  title: string;
  backHref: string;
  children: React.ReactNode;
}

export function ImagePageLayout({
  title,
  backHref,
  children,
}: ImagePageLayoutProps) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href={backHref}>Back</Link>
        </Button>
        <h1 className="font-semibold">{title}</h1>
      </div>
      {children}
    </div>
  );
}
