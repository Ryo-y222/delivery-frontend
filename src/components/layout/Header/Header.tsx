import { Bell, Settings } from "lucide-react";
import type { UserRole } from "../../../mocks/types/common";
import styles from "./Header.module.css";

type HeaderProps = {
  title: string;
  subtitle?: string;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  showRoleSwitcher?: boolean;
};

export function Header({
  title,
  subtitle,
  currentRole,
  onRoleChange,
  showRoleSwitcher = true,
}: HeaderProps) {
  return (
    <div className={styles.header}>
      {/* 左側 */}
      <div>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {/* 右側 */}
      <div className={styles.right}>
        {showRoleSwitcher && (
          <div className={styles.roleSwitcher}>
            <button
              className={`${styles.roleBtn} ${currentRole === "shipper" ? styles.roleActive : ""}`}
              onClick={() => onRoleChange("shipper")}
            >
              荷主ビュー
            </button>
            <button
              className={`${styles.roleBtn} ${currentRole === "transport_company" ? styles.roleActive : ""}`}
              onClick={() => onRoleChange("transport_company")}
            >
              運送会社ビュー
            </button>
          </div>
        )}

        <button className={styles.iconBtn}>
          <Bell size={18} strokeWidth={1.8} />
          <span className={styles.dot} />
        </button>

        <button className={styles.iconBtn}>
          <Settings size={18} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}