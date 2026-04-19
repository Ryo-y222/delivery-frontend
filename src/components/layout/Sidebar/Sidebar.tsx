import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, GitMerge, Truck, MessageSquare,
  Building2, Users, Car, CreditCard, Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./Sidebar.module.css";

type SidebarProps = {
  userName: string;
  userRole: string;
  avatarInitial: string;
};

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  group: "main" | "manage" | "settings";
}

const navItems: NavItem[] = [
  { label: "ダッシュボード", icon: LayoutDashboard, path: "/dashboard", group: "main" },
  { label: "マッチング",     icon: GitMerge,        path: "/matching",  group: "main" },
  { label: "配車計画",       icon: Truck,           path: "/dispatch",  group: "main" },
  { label: "チャット",       icon: MessageSquare,   path: "/chat",      group: "main" },
  { label: "会社情報",       icon: Building2,       path: "/company",   group: "manage" },
  { label: "ドライバー",     icon: Users,           path: "/drivers",   group: "manage" },
  { label: "車両管理",       icon: Car,             path: "/vehicles",  group: "manage" },
  { label: "決済・プラン",   icon: CreditCard,      path: "/payment",   group: "settings" },
  { label: "レビュー",       icon: Star,            path: "/reviews",   group: "settings" },
];

const groupLabels = { main: "Main", manage: "管理", settings: "設定" } as const;

export function Sidebar({ userName, userRole, avatarInitial }: SidebarProps) {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>
        Track<em>Match</em>
      </div>
      {(["main", "manage", "settings"] as const).map((group) => (
        <div key={group}>
          <div className={styles.groupLabel}>{groupLabels[group]}</div>
          {navItems.filter(n => n.group === group).map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <item.icon size={15} strokeWidth={1.8} />
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}

      {/* フッター */}
      <div className={styles.footer}>
        <div className={styles.avatar}>{avatarInitial}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{userName}</div>
          <div className={styles.userRole}>{userRole}</div>
        </div>
      </div>
    </nav>
  );
}