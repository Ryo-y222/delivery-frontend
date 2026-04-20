import { logger } from "../lib/logger";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...options.headers,
    },
  });

  if (!response.ok) {

    if (response.status === 401) {
    window.dispatchEvent(new Event("auth:unauthorized"));
  }
    
    let message = "予期しないエラーが発生しました";
    try {
      const data = await response.json();
      message = data.error ?? `サーバーエラー (${response.status})`;
    } catch {
      message = `サーバーエラー (${response.status})`;
      logger.error("APIエラー:", response.status, response.url);
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

const apiClient = {
  get<T>(path: string): Promise<T> {
    return request<T>(path);
  },
  post<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, { method: "POST", body: JSON.stringify(body) });
  },
  put<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, { method: "PUT", body: JSON.stringify(body) });
  },
  delete<T>(path: string): Promise<T> {
    return request<T>(path, { method: "DELETE" });
  },
};

export default apiClient;