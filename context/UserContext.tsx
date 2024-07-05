"use client";
import { createContext, useContext, useState } from "react";
import type { User, UserContextType } from "@/app/types/types";

export const UserProviderContext = createContext<UserContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();

  return (
    <UserProviderContext.Provider value={{ user, setUser }}>
      {children}
    </UserProviderContext.Provider>
  );
}

export const useUserContext = () => {
  const context = useContext(UserProviderContext);
  if (context === undefined)
    throw new Error("useUserContext must be used within the UserProvider");
  return context;
};
