import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { Header } from "../Header";
import type { UserRole } from "../../../mocks/types/common";
import { useAuth } from "../../../contexts/useAuth";
import styles from "./DashboardLayout.module.css";

type DashboardLayoutProps = {
  title: string;
  subtitle?: string;
  showRoleSwitcher?: boolean;
};

export function DashboardLayout({
  title,
  subtitle,
  showRoleSwitcher = true,
}: DashboardLayoutProps) {
  const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState<UserRole>(
    user?.role ?? "transport_company"
  );

  return (
    <div className={styles.shell}>
      <Sidebar
        userName={user?.name ?? ""}
        userRole={currentRole === "transport_company" ? "運送会社" : "荷主"}
        avatarInitial={user?.name?.[0] ?? "U"}
      />
      <div className={styles.main}>
        <Header
          title={title}
          subtitle={subtitle}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          showRoleSwitcher={showRoleSwitcher}
        />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}