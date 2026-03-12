// user-provider.tsx
//
// Context provider for the current user's data (including credits).
// Wraps the app to avoid repeated getCurrentUser calls.
//
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { type CurrentUser, getCurrentUser } from "@/lib/server/api";

interface UserContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: CurrentUser | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<CurrentUser | null>(initialUser);
  const [isRefreshing, startTransition] = useTransition();

  async function refreshUser() {
    startTransition(async () => {
      try {
        const updatedUser = await getCurrentUser();
        setUser(updatedUser);
      } catch (error) {
        console.error("Failed to refresh user:", error);
      }
    });
  }

  // Update local state if initialUser changes (e.g. on navigation)
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading: isRefreshing,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
