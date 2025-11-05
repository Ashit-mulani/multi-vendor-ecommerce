"use client";

import { createContext, useContext } from "react";
import { useGetMe } from "@/hooks/api-hooks/auth-api-hooks";

const InitContext = createContext(null);

export function InitProvider({ children }) {
  const { isLoading } = useGetMe();

  return (
    <InitContext.Provider value={{ isLoading }}>
      {children}
    </InitContext.Provider>
  );
}

export const useInit = () => useContext(InitContext);
