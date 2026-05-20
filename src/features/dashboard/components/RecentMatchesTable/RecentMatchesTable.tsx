import { useNavigate } from "react-router-dom";
import { StatusBadge } from "../../../../components/atoms/StatusBadge";
import type { MatchRow } from "../../../../mocks/types/dashboard";
import styles from "./RecentMatchesTable.module.css";

type RecentMatchesTableProps = {
  matches: MatchRow[];
};

export function RecentMatchesTable({ matches }: RecentMatchesTableProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>最近のマッチング</h3>
        <button className={styles.seeAll} onClick={() => navigate("/matching")}>
          すべて見る →
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            {["ルート", "日付", "ステータス", "金額"].map(h => (
              <th key={h} className={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matches.map((m, i) => (
            <tr key={i} className={styles.tr}>
              <td className={styles.td}>
                <span className={styles.route}>
                  <strong>{m.from}</strong>
                  <span className={styles.arrow}>→</span>
                  <strong>{m.to}</strong>
                </span>
              </td>
              <td className={`${styles.td} ${styles.tdMuted}`}>{m.date}</td>
              <td className={styles.td}><StatusBadge status={m.status} /></td>
              <td className={`${styles.td} ${styles.tdBold}`}>{m.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}