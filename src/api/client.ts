const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// interface ApiError {
//   message: string;
//   status: number;
// }

const apiClient = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`)
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }
    return response.json() as Promise<T>
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }
    return response.json() as Promise<T>
  },

  async put<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }
    return response.json() as Promise<T>
  },

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }
    return response.json() as Promise<T>
  },
}

export default apiClient
