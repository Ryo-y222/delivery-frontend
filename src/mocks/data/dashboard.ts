import type { DashboardData, ChartDataPoint } from '../types/dashboard';

export const dashboardDataCarrier: DashboardData = {
  stats: [
    { label: "今月のマッチング", value: "24", change: "+12%", up: true, icon: "🔗", color: "#e85d26" },
    { label: "稼働中ドライバー", value: "8", change: "+2", up: true, icon: "🚛", color: "#0ea5e9" },
    { label: "今月の売上", value: "¥1,240,000", change: "+8%", up: true, icon: "💴", color: "#16a34a" },
    { label: "未対応アラート", value: "3", change: "-1", up: false, icon: "⚠️", color: "#dc2626" },
  ],
  matches: [
    { from: "東京", to: "大阪", date: "2026/04/12", status: "approved", statusLabel: "運行中", amount: "¥85,000" },
    { from: "大阪", to: "広島", date: "2026/04/12", status: "payment", statusLabel: "配送中", amount: "¥45,000" },
    { from: "福岡", to: "熊本", date: "2026/04/11", status: "pending", statusLabel: "待機中", amount: "¥28,000" },
    { from: "名古屋", to: "仙台", date: "2026/04/11", status: "approved", statusLabel: "運行中", amount: "¥130,000" },
  ],
  activities: [
    { dotColor: "green", text: "M-024 名古屋→仙台 マッチング成立", time: "10分前" },
    { dotColor: "blue", text: "M-023 福岡→熊本 配車計画作成", time: "1時間前" },
    { dotColor: "orange", text: "M-022 大阪→広島 支払い処理中", time: "2時間前" },
    { dotColor: "red", text: "M-021 東京→大阪 アラート発生", time: "3時間前" },
  ],
  quickActions: [
    { icon: "➕", label: "配車計画作成" },
    { icon: "🔍", label: "マッチング検索" },
    { icon: "📋", label: "レポート確認" },
    { icon: "💬", label: "チャット" },
  ],
};

export const dashboardDataShipper: DashboardData = {
  stats: [
    { label: "依頼中の案件", value: "5", change: "+2", up: true, icon: "📦", color: "#e85d26" },
    { label: "今月の依頼数", value: "12", change: "+3", up: true, icon: "📋", color: "#0ea5e9" },
    { label: "今月の支払い", value: "¥380,000", change: "+5%", up: true, icon: "💴", color: "#16a34a" },
    { label: "未対応見積り", value: "2", change: "+1", up: false, icon: "⚠️", color: "#dc2626" },
  ],
  matches: [
    { from: "東京", to: "大阪", date: "2026/04/12", status: "approved", statusLabel: "運行中", amount: "¥85,000" },
    { from: "大阪", to: "福岡", date: "2026/04/10", status: "completed", statusLabel: "完了", amount: "¥95,000" },
    { from: "名古屋", to: "東京", date: "2026/04/09", status: "completed", statusLabel: "完了", amount: "¥72,000" },
    { from: "東京", to: "札幌", date: "2026/04/08", status: "pending", statusLabel: "見積中", amount: "¥210,000" },
  ],
  activities: [
    { dotColor: "green", text: "東京→大阪 運送会社とマッチング成立", time: "10分前" },
    { dotColor: "blue", text: "大阪→福岡 配送完了", time: "1日前" },
    { dotColor: "orange", text: "名古屋→東京 支払い完了", time: "2日前" },
    { dotColor: "red", text: "東京→札幌 見積り待ち", time: "3日前" },
  ],
  quickActions: [
    { icon: "➕", label: "荷物依頼" },
    { icon: "🔍", label: "運送会社検索" },
    { icon: "📋", label: "依頼履歴" },
    { icon: "💬", label: "チャット" },
  ],
};

export const chartData: ChartDataPoint[] = [
  { month: "11月", requests: 18, deals: 14 },
  { month: "12月", requests: 22, deals: 17 },
  { month: "1月", requests: 15, deals: 11 },
  { month: "2月", requests: 28, deals: 21 },
  { month: "3月", requests: 31, deals: 25 },
  { month: "4月", requests: 24, deals: 19 },
];