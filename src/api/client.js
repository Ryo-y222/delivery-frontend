const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

/**
 * fetch をラップした API クライアント
 * - ベースURLの自動付与
 * - JSON の自動パース
 * - エラーハンドリング
 */
const apiClient = {
  async get(path) {
    const response = await fetch(`${API_URL}${path}`)

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  },

  async post(path, body) {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  },

  async put(path, body) {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  },

  async delete(path) {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  },
}

export default apiClient