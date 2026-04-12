import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User, RegisterData} from "./types";
import { AuthContext } from "./authContextStore";
import apiClient from "../api/client";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await apiClient.get<{ user: User }>("/users/me");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiClient.post<{ user: User }>("/auth/login", { email, password });
    setUser(data.user);
  };

  const register = async (registerData: RegisterData) => {
    await apiClient.post("/auth/register", registerData);
    const me = await apiClient.get<{ user: User }>("/users/me");
    setUser(me.user);
  };

  const logout = async () => {
    await apiClient.post("/auth/logout", {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}