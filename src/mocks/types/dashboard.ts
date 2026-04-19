import type { StatusBadgeVariant } from './common';

export interface StatCard {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: string;
  color: string;
}

export interface MatchRow {
  from: string;
  to: string;
  date: string;
  status: StatusBadgeVariant;
  statusLabel: string;
  amount: string;
}

export interface ActivityItem {
  dotColor: 'blue' | 'green' | 'orange' | 'red';
  text: string;
  time: string;
}

export interface QuickAction {
  icon: string;
  label: string;
}

export interface ChartDataPoint {
  month: string;
  requests: number;
  deals: number;
}

export interface DashboardData {
  stats: StatCard[];
  matches: MatchRow[];
  activities: ActivityItem[];
  quickActions: QuickAction[];
}