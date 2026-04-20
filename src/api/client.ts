import { logger } from "../lib/logger";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

let refreshPromise: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  try {
    await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return true;
  } catch {
    return false;    
  }
}

async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = doRefresh();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${path}`, fetchOptions);

  if (response.status === 401) {
    const refreshed = await tryRefresh();
    if(refreshed) {
      // リフレッシュ成功→元のリクエストを再送
      const retryResponse = await fetch(`${API_URL}${path}`, fetchOptions);
      if(retryResponse.ok) return retryResponse.json() as Promise<T>;
    }
        // リフレッシュ失敗→自動ログアウト
        window.dispatchEvent(new Event("auth:unauthorized"));
        throw new Error("セッションの有効期限が切れました。");
  }
    if (!response.ok) {
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