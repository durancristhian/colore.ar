// header-user-menu.tsx
//
// Avatar dropdown with theme switcher, feedback link, sign-out. Shows role badge from getCurrentUser.
//
"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChatCircleIcon,
  CoinVerticalIcon,
  MonitorIcon,
  CoinVerticalIcon,
  MoonIcon,
  SignOutIcon,
  SunIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/components/providers/user-provider";
import { type CurrentUser } from "@/lib/server/api";
import { ROLE_BADGE_CLASSES, ROLE_LABELS } from "@/lib/shared/roles";
import { areCreditsEnabled } from "@/lib/credits/config";

const themes = [
  { value: "system", label: "Como el sistema", icon: MonitorIcon },
  { value: "light", label: "Claro", icon: SunIcon },
  { value: "dark", label: "Oscuro", icon: MoonIcon },
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
  const { user: currentUser } = useUserContext();
  const { isLoaded, user } = useUser();
  const { theme, setTheme } = useTheme();

  const initials = user
    ? getInitials(user.firstName, user.lastName, user.fullName)
    : "??";

  const ThemeIcon =
    themes.find((t) => t.value === (theme ?? "system"))?.icon ?? MonitorIcon;

  // Treat as standard. Non-logged users defaults to standard rules
  const isStandard = !currentUser || currentUser.role === "standard";

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
      {currentUser &&
        currentUser.role === "standard" &&
        currentUser.credits !== null && (
          <Badge
            variant="secondary"
            title="Credits balance"
            className="flex items-center gap-1 bg-zinc-800 px-2 py-0.5 font-mono text-zinc-200"
          >
            <CoinVerticalIcon className="size-4 text-amber-400" />
            {currentUser.credits}
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
          {isStandard && areCreditsEnabled() && (
            <DropdownMenuItem asChild>
              <Link href="/creditos">
                <CoinVerticalIcon className="size-4" />
                Créditos
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/feedback">
              <ChatCircleIcon className="size-4" />
              Enviar feedback
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ThemeIcon className="size-4" />
              Tema
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {themes.map(({ value, label, icon: Icon }) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={(theme ?? "system") === value}
                  onCheckedChange={(checked) => {
                    if (checked) setTheme(value);
                  }}
                >
                  <Icon className="size-4" />
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <SignOutButton>
            <DropdownMenuItem>
              <SignOutIcon className="size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
