import { useAppStore } from "../../../stores/appStore";
import { apiPost } from "../../../lib/api";

interface LoginResponse {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export function useLogin() {
  const { setPage } = useAppStore();

  async function login(email: string, password: string) {
    const data = await apiPost<LoginResponse>("/auth/login", { email, password });
    setPage("dashboard");
    return data.user;
  }

  return { login };
}