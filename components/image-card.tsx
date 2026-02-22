"use client";

import { CldImage } from "@/components/cld-image";
import { DeleteImageButton } from "@/components/delete-image-button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCreatedAt } from "@/lib/format-date";
import { Eye } from "lucide-react";
import Link from "next/link";

interface ImageCardProps {
  imageId: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
}

export function ImageCard({
  imageId,
  imageUrl,
  prompt,
  createdAt,
}: ImageCardProps) {
  return (
    <Card className="p-0 gap-0">
      <CldImage src={imageUrl} alt={prompt} wrapperClassName="rounded-t-xl" />
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-2" title={prompt}>
          {prompt}
        </CardTitle>
        <CardDescription>Created {formatCreatedAt(createdAt)}</CardDescription>
        <CardAction>
          <DeleteImageButton imageId={imageId} />
        </CardAction>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/images/${imageId}`}>
            <Eye />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
