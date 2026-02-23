"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, MessageCircle, Monitor, Moon, Sun } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const themes = [
  { value: "system", label: "Como el sistema", icon: Monitor },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "light", label: "Claro", icon: Sun },
] as const;

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
  const { theme, setTheme } = useTheme();

  const displayName =
    user?.firstName ?? user?.fullName ?? user?.username ?? "Usuario";

  if (!isLoaded) {
    return (
      <div
        className="flex h-auto items-center gap-2 rounded-full py-1.5"
        aria-hidden
      >
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-24 shrink-0" />
      </div>
    );
  }

  const initials = user
    ? getInitials(user.firstName, user.lastName, user.fullName)
    : "??";

  const ThemeIcon =
    themes.find((t) => t.value === (theme ?? "system"))?.icon ?? Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex h-auto items-center gap-2 rounded-full p-1.5 pr-3"
          aria-label="Menú de usuario"
        >
          <Avatar>
            <AvatarImage
              src={user?.imageUrl}
              alt={user?.fullName ?? "Usuario"}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span>{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/feedback">
            <MessageCircle className="size-4" />
            Enviar feedback
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ThemeIcon className="size-4" />
            Tema
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={theme ?? "system"}
              onValueChange={(value) => setTheme(value)}
            >
              {themes.map(({ value, label, icon: Icon }) => (
                <DropdownMenuRadioItem key={value} value={value}>
                  <Icon className="size-4" />
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <SignOutButton>
          <DropdownMenuItem>
            <LogOutIcon className="size-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
