import type { QuickAction } from "../../../../mocks/types/dashboard";
import styles from "./QuickActions.module.css";

type QuickActionsProps = {
  actions: QuickAction[];
};

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>クイックアクション</h3>
      </div>
      <div className={styles.grid}>
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <button key={action.label} className={styles.actionBtn}>
              <Icon size={20} strokeWidth={1.8} />
              <span className={styles.label}>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}