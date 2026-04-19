import type { StatusBadgeVariant } from "../../../mocks/types/common";
import styles from "./StatusBadge.module.css";

const STATUS_MAP: Record<StatusBadgeVariant, { label: string; bg: string; color: string }> = {
  pending:   { label: "申請中",  bg: "#fffbeb", color: "#92400e" },
  approved:  { label: "承認済み", bg: "#ecfdf5", color: "#065f46" },
  payment:   { label: "支払待ち", bg: "#eff6ff", color: "#1e40af" },
  completed: { label: "完了",    bg: "#f0fdf4", color: "#166534" },
  rejected:  { label: "却下",    bg: "#fef2f2", color: "#991b1b" },
  cancelled: { label: "キャンセル", bg: "#f8fafc", color: "#475569" },
};

type StatusBadgeProps = {
  status: StatusBadgeVariant;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, bg, color } = STATUS_MAP[status];
  return (
    <span className={styles.badge} style={{ background: bg, color }}>
      {label}
    </span>
  );
}