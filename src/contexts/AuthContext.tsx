import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User, RegisterData} from "./types";
import { AuthContext } from "./authContextStore";
import apiClient from "../api/client";
import toast from "react-hot-toast";

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
    const handleUnauthorized = () => {
      setUser(null);
      toast.error("セッションの有効期限が切れました。再度ログインしてください");
    };
  window.addEventListener("auth:unauthorized", handleUnauthorized);
  return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
}, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiClient.post<{ user: User }>("/auth/login", { email, password });
      setUser(data.user);
      toast.success("ログインしました。おかえりなさい！");
    } catch (error) {
      toast.error("ログインに失敗しました。");
      throw error;
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const data = await apiClient.post<{user: User}>("/auth/register", registerData);
      setUser(data.user);
      toast.success("アカウントを作成しました。ようこそ！");
    } catch (error) {
      toast.error("登録に失敗しました。入力内容を確認してください");
      throw error;
    }
  };

  const logout = async () => {
    await apiClient.post("/auth/logout", {});
    setUser(null);
    toast("ログアウトしました");
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