import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ImagesPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-1 items-center justify-between gap-4">
          <h1 className="font-semibold">Your images</h1>
          <Button asChild>
            <Link href="/images/new">New</Link>
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">No images yet.</p>
      </div>
    </div>
  );
}
