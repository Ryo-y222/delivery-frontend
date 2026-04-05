const BASE_URL = "http://localhost:8080/api/v1";

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",  // Cookieを送受信するために必要
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "エラーが発生しました");
  }

  return res.json();
}