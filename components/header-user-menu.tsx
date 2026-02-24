"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { getCurrentUser } from "@/lib/api";
import { ROLE_BADGE_CLASSES, ROLE_LABELS } from "@/lib/roles";

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
  const { data: currentUser } = useQuery({
    queryKey: ["user", "me"],
    queryFn: getCurrentUser,
  });

  const initials = user
    ? getInitials(user.firstName, user.lastName, user.fullName)
    : "??";

  const ThemeIcon =
    themes.find((t) => t.value === (theme ?? "system"))?.icon ?? Monitor;

  return (
    <div className="flex items-center gap-2">
      {currentUser && currentUser.role !== "standard" && (
        <Badge
          variant="outline"
          className={ROLE_BADGE_CLASSES[currentUser.role]}
        >
          {ROLE_LABELS[currentUser.role]}
        </Badge>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Menú de usuario"
          >
            {!isLoaded ? (
              <Skeleton className="size-8 shrink-0 rounded-full" />
            ) : (
              <Avatar>
                <AvatarImage
                  src={user?.imageUrl}
                  alt={user?.fullName ?? "Usuario"}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            )}
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
    </div>
  );
}
