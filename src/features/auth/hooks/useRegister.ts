import { apiPost } from "../../../lib/api";

interface RegisterResponse {
  id: number;
}

export function useRegister() {
  async function register(data: {
    email: string;
    password: string;
    name: string;
    role: string;
    company: string;
    phone?: string;
  }) {
    const result = await apiPost<RegisterResponse>("/auth/register", data);
    return result;
  }

  return { register };
}