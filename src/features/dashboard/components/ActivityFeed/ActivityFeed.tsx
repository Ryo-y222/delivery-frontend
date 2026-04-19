import type { ActivityItem } from "../../../../mocks/types/dashboard";
import styles from "./ActivityFeed.module.css";

const DOT_COLOR: Record<ActivityItem["dotColor"], string> = {
  blue:   "#2563eb",
  green:  "#10b981",
  orange: "#f59e0b",
  red:    "#ef4444",
};

type ActivityFeedProps = {
  activities: ActivityItem[];
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>アクティビティ</h3>
        <button className={styles.seeAll}>すべて見る →</button>
      </div>
      <div className={styles.list}>
        {activities.map((a, i) => (
          <div key={i} className={`${styles.item} ${i === activities.length - 1 ? styles.last : ""}`}>
            <span className={styles.dot} style={{ background: DOT_COLOR[a.dotColor] }} />
            <div className={styles.body}>
              <span className={styles.text}>{a.text}</span>
              <span className={styles.time}>{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}