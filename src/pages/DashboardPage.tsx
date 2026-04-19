
export function DashboardPage() {
  return <div>ダッシュボード（仮）</div>;
}
// import { useAuth } from "../contexts/useAuth";
// import { useNavigate } from "react-router-dom";
// import styles from "./DashboardPage.module.css";

// const MOCK_STATS = [
//   { label: "今月のマッチング", value: "24", unit: "件", delta: "+12%", up: true },
//   { label: "稼働中ドライバー", value: "8", unit: "名", delta: "+2", up: true },
//   { label: "今月の売上", value: "1,240,000", unit: "円", delta: "+8%", up: true },
//   { label: "未対応アラート", value: "3", unit: "件", delta: "-1", up: false },
// ];

// const MOCK_MATCHES = [
//   { id: "M-021", from: "東京", to: "大阪", driver: "田中 健二", amount: "¥85,000", status: "運行中", date: "2026/04/12" },
//   { id: "M-022", from: "大阪", to: "広島", driver: "佐藤 誠", amount: "¥45,000", status: "配送中", date: "2026/04/12" },
//   { id: "M-023", from: "福岡", to: "熊本", driver: "鈴木 一郎", amount: "¥28,000", status: "待機中", date: "2026/04/11" },
//   { id: "M-024", from: "名古屋", to: "仙台", driver: "山田 次郎", amount: "¥130,000", status: "運行中", date: "2026/04/11" },
// ];

// const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
//   運行中: { bg: "#dbeafe", color: "#1d4ed8" },
//   配送中: { bg: "#fdf0ea", color: "#e85d26" },
//   待機中: { bg: "#fef9c3", color: "#ca8a04" },
// };

// const NAV_ITEMS = [
//   { label: "ダッシュボード", path: "/" },
//   { label: "マッチング", path: "/matching" },
//   { label: "配車計画", path: "/dispatch" },
//   { label: "チャット", path: "/chat" },
//   { label: "決済", path: "/payment" },
//   { label: "レビュー", path: "/review" },
// ];

// export function DashboardPage() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };

//   return (
//     <div className={styles.shell}>

//       {/* Sidebar */}
//       <div className={styles.sidebar}>
//         <div className={styles.sidebarLogo}>
//           Track<em>Match</em>
//         </div>

//         <nav className={styles.nav}>
//           {NAV_ITEMS.map(item => (
//             <button
//               key={item.path}
//               onClick={() => navigate(item.path)}
//               className={`${styles.navBtn} ${item.path === "/" ? styles.active : ""}`}
//             >
//               {item.label}
//             </button>
//           ))}
//         </nav>

//         <div className={styles.sidebarUser}>
//           <div className={styles.userName}>{user?.name}</div>
//           <div className={styles.userRole}>{user?.role}</div>
//           <button className={styles.logoutBtn} onClick={handleLogout}>
//             ログアウト
//           </button>
//         </div>
//       </div>

//       {/* Main */}
//       <div className={styles.main}>

//         <div className={styles.pageLabel}>Dashboard</div>
//         <div className={styles.pageTitle}>おはようございます、{user?.name}さん</div>

//         {/* Stats */}
//         <div className={styles.statsGrid}>
//           {MOCK_STATS.map(s => (
//             <div key={s.label} className={styles.statCard}>
//               <div className={styles.statLabel}>{s.label}</div>
//               <div className={styles.statValue}>
//                 {s.value}<span className={styles.statUnit}>{s.unit}</span>
//               </div>
//               <div className={`${styles.statDelta} ${s.up ? styles.up : styles.down}`}>
//                 {s.delta} 先月比
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Table */}
//         <div className={styles.tableWrap}>
//           <div className={styles.tableTitle}>最近のマッチング</div>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 {["ID", "ルート", "ドライバー", "金額", "ステータス", "日付"].map(h => (
//                   <th key={h} className={styles.th}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {MOCK_MATCHES.map(m => {
//                 const sc = STATUS_COLOR[m.status];
//                 return (
//                   <tr key={m.id}>
//                     <td className={`${styles.td} ${styles.tdMono} ${styles.tdAccent}`}>{m.id}</td>
//                     <td className={styles.td}>{m.from} → {m.to}</td>
//                     <td className={styles.td}>{m.driver}</td>
//                     <td className={`${styles.td} ${styles.tdMono} ${styles.tdBold}`}>{m.amount}</td>
//                     <td className={styles.td}>
//                       <span className={styles.badge} style={{ background: sc.bg, color: sc.color }}>{m.status}</span>
//                     </td>
//                     <td className={`${styles.td} ${styles.tdMono} ${styles.tdMuted}`}>{m.date}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </div>
//   );
// }