"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User, UserContextType } from "@/app/types/types";
import axios from "@/axiosConfig";

export const UserProviderContext = createContext<UserContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    async function checkAuthenticated() {
      if (!user) {
        try {
          const response = await axios.get("/api/admin");
          if (response.status === 200) {
            console.log("user dta: ", response.data);
            setUser(response.data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    }
    checkAuthenticated();
  }, [])

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
