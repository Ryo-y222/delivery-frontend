import { useContext } from "react";
import { AuthContext } from "./authContextStore";
import type { AuthContextType } from "./types";

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}