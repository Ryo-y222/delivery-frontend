import { useState, useEffect } from 'react'
import apiClient from './api/client'
import './App.css'

function App() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        // fetch ベースの apiClient で GET リクエスト
        const data = await apiClient.get('/health')
        setHealth(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
  }, [])

  return (
    <div className="App">
      <h1>🚚 Delivery App</h1>

      <div style={{
        padding: '20px',
        margin: '20px',
        borderRadius: '8px',
        backgroundColor: health?.status === 'healthy' ? '#d4edda' : '#f8d7da',
        border: `1px solid ${health?.status === 'healthy' ? '#c3e6cb' : '#f5c6cb'}`,
      }}>
        <h2>サーバーステータス</h2>

        {loading && <p>⏳ 確認中...</p>}

        {error && (
          <div>
            <p>❌ エラー: {error}</p>
            <p>バックエンドが起動しているか確認してください</p>
          </div>
        )}

        {health && (
          <div>
            <p>ステータス: {health.status === 'healthy' ? '🟢 正常' : '🔴 異常'}</p>
            <p>データベース: {health.database === 'connected' ? '✅ 接続済み' : '❌ 未接続'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
