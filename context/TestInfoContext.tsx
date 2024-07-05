"use client";
import { createContext, useContext, useState } from "react";
import type { TestInfoContextType } from "@/app/types/types";

export const TestInfoProviderContext = createContext<
  TestInfoContextType | undefined
>(undefined);

export function TestInfoProvider({ children }: { children: React.ReactNode }) {
  const [testInfo, setTestInfo] = useState<TestInfoContextType["testInfo"]>();

  return (
    <TestInfoProviderContext.Provider value={{ testInfo, setTestInfo }}>
      {children}
    </TestInfoProviderContext.Provider>
  );
}

export const useTestInfoContext = () => {
  const context = useContext(TestInfoProviderContext);
  if (context === undefined)
    throw new Error("useTestContext must be used within the TestProvider");
  return context;
};
