import styles from "./StatCard.module.css";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: LucideIcon;
  color: string;
};

export function StatCard({ label, value, change, up, icon:Icon , color }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        <div className={styles.iconBox} style={{ background: color + "22" }}>
          <Icon size={20} strokeWidth={1.8} color={color} />
        </div>
      </div>
      <div className={styles.value}>{value}</div>
      <div className={`${styles.change} ${up ? styles.up : styles.down}`}>
        {up ? "↑" : "↓"} {change} 前月比
      </div>
    </div>
  );
}