"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";

function getInitials(
  firstName: string | null,
  lastName: string | null,
  fullName: string | null,
): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName.slice(0, 2).toUpperCase();
  }
  if (lastName) {
    return lastName.slice(0, 2).toUpperCase();
  }
  if (fullName && fullName.length >= 2) {
    return fullName.slice(0, 2).toUpperCase();
  }
  return "??";
}

export function HeaderUserMenu() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full size-8"
        aria-label="User menu"
        disabled
      >
        <span className="text-muted-foreground text-sm">…</span>
      </Button>
    );
  }

  const initials = user
    ? getInitials(user.firstName, user.lastName, user.fullName)
    : "??";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <SignOutButton>
          <DropdownMenuItem>
            <LogOutIcon className="size-4" />
            Sign out
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
