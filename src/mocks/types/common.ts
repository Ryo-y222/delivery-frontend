export type UserRole = 'shipper' | 'transport_company';

export type StatusBadgeVariant = 'pending' | 'approved' | 'payment' | 'completed' | 'rejected' | 'cancelled';

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

export interface User {
  name: string;
  role: UserRole;
  avatarInitial: string;
}