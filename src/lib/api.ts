import { logger } from "./logger";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "予期しないエラーが発生しました";
    try {
      const data = await res.json();
      message = data.error ?? `サーバーエラー (${res.status})`;
    } catch {
      message = `サーバーエラー (${res.status})`;
      logger.error("APIエラー:", res.status, res.url);
    }
    throw new Error(message);
  }

  return res.json();
}